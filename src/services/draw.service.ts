
import { Draw } from "../models/draw";
import { DrawDto, IDraw, DrawFilterParams } from "../models/dtos/draw.dto";

export class DrawService {

    private static myInstance: DrawService;
    private constructor() { }

    public async getDraws(filterParams: DrawFilterParams) {
        const onlyDefinedParams: DrawFilterParams = Object.fromEntries(
         Object.entries(filterParams).filter(([_, v]) => v !== undefined)
        );
        const draws: IDraw[] = await Draw.find(onlyDefinedParams);
        const drawsDtos: DrawDto[] = this.formatToDto(draws);
        return drawsDtos;
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

    public static getInstance(): DrawService {
        if (!this.myInstance) {
            this.myInstance = new DrawService();
        }
        return this.myInstance;
    }
}