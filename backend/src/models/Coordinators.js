import { Schema, model } from "mongoose";

const coordinatorsSchema = new Schema(
  {
    names: { type: String, required: true, maxLength: 100 },
    surnames: { type: String, required: true, maxLength: 100 },
    email: { type: String, required: true, unique: true, maxLength: 100 },
    password: { type: String, required: true, maxLength: 100 },
    department: { type: String, required: true, maxLength: 100 },
  },
  {
    timestamps: true,
  }
);

export default model("Coordinators", coordinatorsSchema);