import { DrawType } from "../enums/draw.enum";
import { Province } from "../enums/province.enum";

export interface DrawNumberDto { position: number; drawNumber: number }

export interface IDraw extends Document {
  date: string;
  type: DrawType;
  province: Province;
  updated: Date;
  drawNumbers: { position: number; drawNumber: number }[];
}

export interface DrawDto {
  date: string;
  type: DrawType;
  province: Province;
  updated?: Date;
  drawNumbers: Array<DrawNumberDto>;
}

export interface DrawFilterParams {
  date?: string;
  type?: DrawType;
  province?: Province;
}