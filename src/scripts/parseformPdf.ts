import axios from "axios";
import pdf from "pdf-parse";
import * as cheerio from "cheerio";

export async function fetchPdfAndConvertToJson() {
  try {
    let results = [];
    const url =
      "https://jasper2.loteriasantafe.gov.ar/Ejecutar_Reportes2.php?ruta_reporte=/Reports/CAS/Extractos_CAS/extrpp&formato=PDF&param_ID_sor=3D9C8C29-3AD5-44AF-B833-396AF50D067C";

    const response = await axios.get(url, { responseType: "arraybuffer" });
    const buffer = Buffer.from(response.data as unknown as any, "binary");

    const data = await pdf(buffer);
    const text = data.text;

    const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);

    const draws = lines.map((line, idx) => ({
      id: idx + 1,
      raw: line,
    }));

    const base = {
        date: '2025-09-17',
        type: 'nocturna',
    }
    const day = draws[2].raw.split(' ').map(p => parseInt(p)).filter(f => f)[0];
    const cba = draws.splice(draws.findIndex(r => r.raw === 'CÓRDOBA') +1, 20).map((p,i) => ({position: i+1, drawNumber: p.raw}));
    const caba = draws.splice(draws.findIndex(r => r.raw === 'LotBA') +1, 20).map((p,i) => ({position: i+1, drawNumber: p.raw}));
    const entreRios = draws.splice(draws.findIndex(r => r.raw === 'ENTRE RIOS') +1, 20).map((p,i) => ({position: i+1, drawNumber: p.raw}));
    const bsas = draws.splice(draws.findIndex(r => r.raw === 'BUENOS AIRES') +1, 20).map((p,i) => ({position: i+1, drawNumber: p.raw}));
    const santafe = draws.splice(draws.findIndex(r => r.raw === 'SANTA FE') +1, 20).map((p,i) => ({position: i+1, drawNumber: p.raw}));
    results = [
        { ...base, province: 'cordoba',drawNumbers: cba,  },
        { ...base, province: 'caba' ,drawNumbers: caba,  },
        { ...base, province: 'entre rios' ,drawNumbers: entreRios,  },
        { ...base, province: 'buenos aires',drawNumbers:  bsas , },
        { ...base, province: 'santa fe', drawNumbers: santafe ,},

    ];
    return results;
  } catch (error) {
    console.error("Error al leer el PDF:", error);
  }
}

async function getPdf() {
  try {
    const url = "https://apps.loteriasantafe.gov.ar:8443/Extractos/paginas/mostrarQuinielaLaPrevia.xhtml";
    const response = await axios.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        "Cookie": "JSESSIONID=D3D2C767C5A425637E386FD0005BC55D"
      },
    });
    const $ = cheerio.load(response.data as any);

    const pdfLink = $(".soloextracto a").attr("href");

    if (!pdfLink) {
      console.log("No encontré el PDF en la página.");
      return;
    }

    console.log("📄 PDF encontrado:", pdfLink);
  } catch (err) {
    console.error("Error:", err);
  }
}

fetchPdfAndConvertToJson();
