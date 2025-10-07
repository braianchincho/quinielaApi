
import cache from "../helpers/cache";
import { logger } from "../helpers/logger";
import { Draw } from "../models/draw";
import { DrawDto, IDraw, DrawFilterParams } from "../models/dtos/draw.dto";

export class DrawService {

    private static myInstance: DrawService;
    private constructor() { }

    public async getDraws(filterParams: DrawFilterParams) {
        const onlyDefinedParams: DrawFilterParams = Object.fromEntries(
            Object.entries(filterParams).filter(([_, v]) => v !== undefined)
        );
        const cacheData = this.getCache(onlyDefinedParams);
        if (cacheData) {
            logger.info(`draws: ${cacheData.length}`);
            return cacheData;
        }
        const draws: IDraw[] = await Draw.find(onlyDefinedParams);
        const drawsDtos: DrawDto[] = this.formatToDto(draws);
        this.setCache(drawsDtos, onlyDefinedParams)
        return drawsDtos;
    }

    public static getInstance(): DrawService {
        if (!this.myInstance) {
            this.myInstance = new DrawService();
        }
        return this.myInstance;
    }

    /**
     * Convierte documentos de DB a DTO para exponer en la API
     */
    private formatToDto(documents: IDraw[]): DrawDto[] {
        return documents.map(({ date, type, province, updated, drawNumbers }) => ({
            date,
            type,
            province,
            updated,
            drawNumbers: drawNumbers.map(({ position, drawNumber }) => ({
                position,
                drawNumber,
            })),
        }));
    }

    private getCache(filterParams: DrawFilterParams): DrawDto[] | undefined {
        const key = Object.values(filterParams).join(',');
        logger.info(`Get from cache ${key}`);
        return cache.get(key);
    }

    private setCache(listDraws: DrawDto[], filterParams: DrawFilterParams): void {
        const key = Object.values(filterParams).join(',');
        logger.info(`Set cache ${key}`);
        cache.set(key, listDraws, 3600);
    }
}