import { Request, Response } from "express";
import { Draw } from "../models/draw";
import { getLocaleDate } from "../helpers/date.helper";
import { DrawDto, IDraw } from "../models/dtos/draw.dto";

export default class DrawController {

  /**
   * GET /api/draws?date=yyyy-mm-dd
   */
  async getDraws(req: Request, res: Response): Promise<Response> {
    try {
      const dateParam = req.query.date as string | undefined;
      const date = dateParam || getLocaleDate();
      const draws: IDraw[] = await Draw.find({ date });
      const dto: DrawDto[] = this.formatToDto(draws);

      return res.json(dto);
    } catch (error) {
      console.error("❌ Error fetching draws:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
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

}
