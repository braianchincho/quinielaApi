import { Request, Response } from "express";
import { getLocaleDate } from "../helpers/date.helper";
import { DrawDto} from "../models/dtos/draw.dto";
import { DrawService } from "../services/draw.service";
import { DrawType } from "../models/enums/draw.enum";
import { Province } from "../models/enums/province.enum";

export default class DrawController {

  /**
   * GET /api/draws?date=yyyy-mm-dd
   */
  async getDraws(req: Request, res: Response): Promise<Response> {
    try {
      const dateParam = req.query.date as string | undefined;
      const date = dateParam || getLocaleDate();
      const province = req.query.province as Province | undefined;
      const type = req.query.type as DrawType | undefined;
      const dto: DrawDto[] = await DrawService.getInstance().getDraws({date, province, type});

      return res.json(dto);
    } catch (error) {
      console.error("❌ Error fetching draws:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
}
