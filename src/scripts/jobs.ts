import cron from "node-cron";
import { scrapPDFs } from "./scrapingFromLotSantafe";
import { Draw } from "../models/draw";
import { getLocaleDate } from "../helpers/date.helper";
import getDrawsDataFromLaNacion from "./ScrapLanacion";

const runScrap = async () => {
  try {
    console.log("⏳ Ejecutando scrap...", getLocaleDate(),new Date()
    .toLocaleTimeString("sv", { timeZone: "America/Argentina/Buenos_Aires" }));
    const drawsFromSantaFePage = await scrapPDFs();
    const drawsFromLaNacionPage = await getDrawsDataFromLaNacion();
    const draws = [...drawsFromLaNacionPage, ...drawsFromSantaFePage];
    if (draws.length) {
      await Draw.insertMany(draws, { ordered: false });
      console.log("✅ Datos insertados!", getLocaleDate());
    } else {
      console.log("⚠️ No se insertaron datos, PDF sin resultados válidos", getLocaleDate());
    }
  } catch (err: any) {
    if (err.code === 11000) {
      console.warn("⚠️ Algunos duplicados fueron ignorados");
    } else {
      console.error("❌ Error seeding data:", err.code);
    }
  }
};

// ⏰ Schedule cron jobs at the times of the draws
export function scheduleJobs() {
  // Previa (10:30 hs)
  cron.schedule("15 10 * * *", runScrap, { timezone: "America/Argentina/Buenos_Aires" });

  // Primera (12:00 hs)
  cron.schedule("01 12 * * *", runScrap, { timezone: "America/Argentina/Buenos_Aires" });

  // Matutina (15:00 hs)
  cron.schedule("01 15 * * *", runScrap, { timezone: "America/Argentina/Buenos_Aires" });

  // Vespertina (18:00 hs)
  cron.schedule("01 18 * * *", runScrap, { timezone: "America/Argentina/Buenos_Aires" });

  // Nocturna (21:00 hs)
  cron.schedule("01 21 * * *", runScrap, { timezone: "America/Argentina/Buenos_Aires" });
  // respaldo
  cron.schedule("15 21 * * *", runScrap, { timezone: "America/Argentina/Buenos_Aires" });
  runScrap();
  console.log("📅 Cron jobs programados", getLocaleDate());
}
