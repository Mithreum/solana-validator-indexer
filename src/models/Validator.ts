import mongoose, { Schema } from "mongoose";
import { IValidator } from "./interfaces";

export const ValidatorSchema = new Schema<IValidator>(
    {
      votePubkey: { type: String, required: true, unique: true, index: true },
      nodePubkey: { type: String, required: true },
      commission: { type: Number, required: true },
      firstSeenEpoch: { type: Number, required: true },
      lastSeenEpoch: { type: Number, required: true },
      metadata: {
        address: { type: String, required: true },
        name: { type: String },
        website: { type: String },
      },
    },
    { collection: 'validators' }
  );
  
export  const Validator = mongoose.model<IValidator>('Validator', ValidatorSchema);