import axios from "axios";
import * as cheerio from "cheerio";
import { logger } from "../../helpers/logger";

/**
 * Cabeceras HTTP para evitar bloqueos por bots.
 */
const HEADERS = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
  "Accept-Language": "es-AR,es;q=0.9,en;q=0.8",
};

/**
 * Obtiene el HTML de una página y lo carga en Cheerio.
 */
const fetchPage = async (url: string): Promise<cheerio.Root> => {
  try {
    const { data } = await axios.get(url, { headers: HEADERS });
    return cheerio.load(data as string);
  } catch (error) {
    logger.error(`❌ Error fetching page: ${url}`);
    throw new Error("Failed to fetch page");
  }
};

/**
 * Obtiene todas las tablas con resultados de sorteos.
 */
const getDrawTables = async (url: string): Promise<cheerio.Element[]> => {
  const $ = await fetchPage(url);
  return $(".table-horizontal-results").toArray();
};

/**
 * Procesa todas las tablas encontradas.
 */
const parseAllDrawTables = async (url: string, province: string) => {
  const tables = await getDrawTables(url);
  const results = await Promise.all(tables.map(t => parseDrawTable(t,province)));
  return results.filter(Boolean); // filtra nulos o errores
};

/**
 * Procesa una tabla individual de resultados.
 */
const parseDrawTable = async (table: cheerio.Element, province: string) => {
  const $ = cheerio.load(table);

  // Extrae texto del título (ej: "Primera - 26/09/2025")
  const title = $("h2").text().trim().toLowerCase();

  if (!title) {
    console.warn("⚠️ No se encontró título en una tabla");
    return null;
  }

  const [type, _ ,dateRaw] = title.replace(" -", "").split(" ").filter(Boolean);

  // Formatea la fecha a formato ISO (YYYY-MM-DD)
  const formattedDate = dateRaw?.includes("/")
    ? dateRaw.split("/").reverse().join("-")
    : null;

  // Extrae cada número de la quiniela
  const drawNumbers = $(".number-box")
    .map((_, el) => {
      const cell = cheerio.load(el);
      return {
        position: Number(cell(".numerator-table").text().trim()),
        drawNumber: Number(cell(".number-table-horizontal").text().trim()),
      };
    })
    .get();

  return {
    date: formattedDate,
    type,
    province,
    drawNumbers,
  };
};


export default parseAllDrawTables;
