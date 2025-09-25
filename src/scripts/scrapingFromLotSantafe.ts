import axios from "axios";
import pdf from "pdf-parse";
import * as cheerio from "cheerio";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { Draw } from "../models/draw";
import { getLocaleDate } from "../helpers/date.helper";

dotenv.config();
type ExtractType = 'previa' | 'primera' | 'matutina' | 'vespertina' | 'nocturna';

interface Extract {
  suffix: string;
  type: ExtractType;
  drawTime: string;
}

interface DrawNumber {
  position: number;
  drawNumber: string;
}

interface DrawDto {
  date: string;
  type: ExtractType;
  province: string;
  drawNumbers: DrawNumber[];
}

const extracts: Extract[] = [
  { suffix: 'mostrarQuinielaLaPrevia.xhtml', type: 'previa', drawTime: '10:30' },
  { suffix: 'mostrarQuinielaElPrimero.xhtml', type: 'primera', drawTime: '12' },
  { suffix: 'mostrarQuinielaMatutina.xhtml', type: 'matutina', drawTime: '15' },
  { suffix: 'mostrarQuinielaVespertina.xhtml', type: 'vespertina', drawTime: '18' },
  { suffix: 'mostrarQuinielaNocturna.xhtml', type: 'nocturna', drawTime: '21' },
];

async function getPdfLink(url: string): Promise<string | undefined> {
  try {
    const response = await axios.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Cookie": "JSESSIONID=D3D2C767C5A425637E386FD0005BC55D"
      }
    });
    const $ = cheerio.load(response.data as any);
    const pdfLink = $(".soloextracto a").attr("href");
    return pdfLink;
  } catch (err) {
    console.error(`Error al obtener PDF de ${url}:`, err);
    return undefined;
  }
}

async function getPdfLinks(): Promise<{ href: string, type: ExtractType }[]> {
  const links: { href: string, type: ExtractType }[] = [];
  for (const extract of extracts) {
    const href = await getPdfLink(`https://apps.loteriasantafe.gov.ar:8443/Extractos/paginas/${extract.suffix}`);
    if (href) links.push({ href, type: extract.type });
  }
  return links;
}

async function downloadPdfBuffer(url: string): Promise<Buffer> {
  const response = await axios.get(url, { responseType: "arraybuffer" });
  return Buffer.from(response.data as any);
}

function extractDayFromPdf(text: string): number | null {
  // Busca números de día en el texto (ej: 18, 19, 20...)
  const match = text.match(/\b(\d{1,2})\b/);
  return match ? parseInt(match[1], 10) : null;
}

function parseDrawsFromText(text: string, date: string, type: ExtractType): DrawDto[] {
  const lines = text.split("\n").map(l => l.trim()).filter(Boolean);

  // 🔹 validar fecha
  const dayInPdf = extractDayFromPdf(text);
  const today = getLocaleDate();
  if (dayInPdf && dayInPdf !== today.getDate()) {
    console.log(`⚠️ Sorteo ${type} descartado: fecha del PDF (${dayInPdf}) no coincide con hoy (${today.getDate()})`);
    return [];
  }
  console.log(`⚠️ Sorteo ${type} procesado: fecha del PDF (${dayInPdf}) no coincide con hoy (${today.getDate()})`);
  const provinces = ["CÓRDOBA", "LotBA", "ENTRE RIOS", "BUENOS AIRES", "SANTA FE"];
  const normalized = ["cordoba", "nacional", "entrerios", "buenosaires", "santafe"];

  const draws: DrawDto[] = [];

  provinces.forEach((prov, idx) => {
    const startIdx = lines.findIndex(l => l === prov);
    if (startIdx < 0) return;

    const drawNumbers: DrawNumber[] = lines.slice(startIdx + 1, startIdx + 21).map((num, i) => ({
      position: i + 1,
      drawNumber: num
    }));

    draws.push({
      date,
      type,
      province: normalized[idx],
      drawNumbers
    });
  });

  return draws;
}

async function fetchPdfAndConvertToJson(url: string, type: ExtractType, date: string): Promise<DrawDto[]> {
  try {
    const buffer = await downloadPdfBuffer(url);
    const data = await pdf(buffer);
    return parseDrawsFromText(data.text, date, type);
  } catch (error) {
    console.error(`Error procesando PDF ${url}:`, error);
    return [];
  }
}

export async function scrapPDFs(): Promise<DrawDto[]> {
  const links = await getPdfLinks();
  const results: DrawDto[] = [];

  for (const link of links) {
    const draws = await fetchPdfAndConvertToJson(link.href, link.type, new Date().toLocaleString("sv-SE", { timeZone: "America/Argentina/Buenos_Aires" }).split(" ")[0]);
    results.push(...draws);
  }

  return results;
}

const save = async () => {
  try {
    const uri = process.env.MONGO_URI;
    if (!uri) return;
    
    await mongoose.connect(uri);
    const draws = await scrapPDFs();
    console.log("✅ Current data inserted!", new Date().toLocaleString("sv-SE", { timeZone: "America/Argentina/Buenos_Aires" }));
    console.log(draws.map(d => d.date + ' ' + d.province + ' ' + d.type))
    await Draw.insertMany(draws, { ordered: false });

    mongoose.connection.close();
  } catch (err: any) {
    console.log(getLocaleDate());
    console.log(err.message);
    if (err.code === 11000) {
      console.warn("⚠️ Algunos duplicados fueron ignorados");
    } else {
      console.error("❌ Error seeding data:", err.code);
    }
  }
};

// Ejecutar
save().then(results => console.table(results));
