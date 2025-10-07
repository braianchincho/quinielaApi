import cron from "node-cron";
import { scrapPDFs } from "./scrapingFromLotSantafe";
import { Draw } from "../models/draw";
import getDrawsDataFromLaNacion from "./ScrapLanacion";
import { logger } from "../helpers/logger";
import cache from "../helpers/cache";

const runScrap = async () => {
  try {
    logger.info("⏳ Ejecutando scrap...");
    const drawsFromSantaFePage = await scrapPDFs();
    const drawsFromLaNacionPage = await getDrawsDataFromLaNacion();
    const draws = [...drawsFromLaNacionPage, ...drawsFromSantaFePage];
    if (draws.length) {
      cache.flushAll();
      logger.info("cache reset");
      await Draw.insertMany(draws, { ordered: false });
      logger.info("✅ Datos insertados!");
    } else {
      logger.info("⚠️ No se insertaron datos, PDF sin resultados válidos");
    }
  } catch (err: any) {
    if (err.code === 11000) {
      logger.warn("⚠️ Algunos duplicados fueron ignorados");
    } else {
      logger.error("❌ Error seeding data:", err.code);
    }
  }
};

// ⏰ Schedule cron jobs at the times of the draws
export function scheduleJobs() {
  // Previa (10:00 hs)
  cron.schedule("0,15,30,45 10 * * *", runScrap, { timezone: "America/Argentina/Buenos_Aires" });
  cron.schedule("01 11 * * *", runScrap, { timezone: "America/Argentina/Buenos_Aires" });
  // Primera (12:00 hs)
  cron.schedule("01 12 * * *", runScrap, { timezone: "America/Argentina/Buenos_Aires" });

  // Matutina (15:00 hs)
  cron.schedule("01,15,30,45 15 * * *", runScrap, { timezone: "America/Argentina/Buenos_Aires" });

  // Vespertina (18:00 hs)
  cron.schedule("01,15,30,45 18 * * *", runScrap, { timezone: "America/Argentina/Buenos_Aires" });

  // Nocturna (21:00 hs)
  cron.schedule("01,15,30,45 21 * * *", runScrap, { timezone: "America/Argentina/Buenos_Aires" });
  // respaldo
  cron.schedule("15 23 * * *", runScrap, { timezone: "America/Argentina/Buenos_Aires" });
  runScrap();
  logger.info("📅 Cron jobs programados");
}
