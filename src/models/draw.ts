import mongoose, { Schema } from "mongoose";
import { IDraw } from "./dtos/draw.dto";

const DrawSchema: Schema = new Schema({
  date: { type: String, required: true },
  type: { type: String, enum: ["previa", "primera", "matutina", "vespertina", "nocturna"], required: true },
  province: { type: String, required: true },
  updated: { type: Date, default: Date.now },
  drawNumbers: [
    {
      position: { type: Number, required: true },
      drawNumber: { type: Number, required: true }
    }
  ]
});
DrawSchema.index({ date: 1, type: 1, province: 1 }, { unique: true });
export const Draw = mongoose.model<IDraw>("Draw", DrawSchema);
