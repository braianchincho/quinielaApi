import cron from "node-cron";
import { scrapPDFs } from "./scrapingFromLotSantafe";
import { Draw } from "../models/draw";
import { getLocaleDate } from "../helpers/date.helper";

const runScrap = async () => {
  try {
    console.log("⏳ Ejecutando scrap...", getLocaleDate());
    const draws = await scrapPDFs();
    if (draws.length) {
      await Draw.insertMany(draws, { ordered: false });
      console.log("✅ Datos insertados!",getLocaleDate());
    } else {
      console.log("⚠️ No se insertaron datos, PDF sin resultados válidos", getLocaleDate());
    }
  } catch (err) {
    console.info("❌ Error en scrap:", getLocaleDate());
    console.table(err);
  }
};

// ⏰ Schedule cron jobs at the times of the draws
export function scheduleJobs() {
  // Previa (10:30 hs)
  cron.schedule("30 10 * * *", runScrap, { timezone: "America/Argentina/Buenos_Aires" });

  // Primera (12:00 hs)
  cron.schedule("0 12 * * *", runScrap, { timezone: "America/Argentina/Buenos_Aires" });

  // Matutina (15:00 hs)
  cron.schedule("0 15 * * *", runScrap, { timezone: "America/Argentina/Buenos_Aires" });

  // Vespertina (18:00 hs)
  cron.schedule("0 18 * * *", runScrap, { timezone: "America/Argentina/Buenos_Aires" });

  // Nocturna (21:00 hs)
  cron.schedule("0 21 * * *", runScrap, { timezone: "America/Argentina/Buenos_Aires" });

  console.log("📅 Cron jobs programados", getLocaleDate());
}
