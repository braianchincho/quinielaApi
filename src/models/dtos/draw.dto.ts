export interface DrawNumberDto { position: number; drawNumber: number }

export interface IDraw extends Document {
  date: string;
  type: "previa" | "primera" | "matutina" | "vespertina" | "nocturna";
  province: string;
  updated: Date;
  drawNumbers: { position: number; drawNumber: number }[];
}

export interface DrawDto {
  date: string;
  type: "previa" | "primera" | "matutina" | "vespertina" | "nocturna";
  province: string;
  updated?: Date;
  drawNumbers: Array<DrawNumberDto>;
}