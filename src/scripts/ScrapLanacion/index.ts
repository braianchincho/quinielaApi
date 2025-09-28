import { DrawDto } from "../../models/dtos/draw.dto";
import { Province } from "../../models/enums/province.enum";
import parseAllDrawTables from "./scrapLaNacionPage";

type ProvinceConfig = {
  url: string;
  province: Province;
};

const LANACION_BY_PROVINCE: ProvinceConfig[] = [
  { url: "https://www.lanacion.com.ar/loterias/quiniela-cordoba/", province: Province.CORDOBA },
  { url: "https://www.lanacion.com.ar/loterias/quiniela-provincia/", province: Province.BUENOS_AIRES },
  { url: "https://www.lanacion.com.ar/loterias/quiniela-nacional/", province: Province.NACIONAL },
  { url: "https://www.lanacion.com.ar/loterias/quiniela-santa-fe/", province: Province.SANTA_FE },
  { url: "https://www.lanacion.com.ar/loterias/quiniela-montevideo/", province: Province.MONTEVIDEO }
];

export const getDrawsDataFromLaNacion = async () => {
  const promises = LANACION_BY_PROVINCE.map(async ({ url, province }) => {
    try {
      return await parseAllDrawTables(url, province);
    } catch (err) {
      console.error(`❌ Error scrapeando ${province}:`, err);
      return null;
    }
  });

  const results = await Promise.all(promises);

  return results.flat().filter(Boolean) as unknown as DrawDto[];
};

export default getDrawsDataFromLaNacion;