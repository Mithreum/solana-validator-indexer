import mongoose, { Schema } from "mongoose";
import { IStake } from "./interfaces";

export const StakeSchema = new Schema<IStake>(
    {
      votePubkey: { type: String, required: true, index: true },
      epoch: { type: Number, required: true, index: true },
      activatedStake: { type: Number, required: true },
      delegatedStake: { type: Number, required: true },
      totalStake: { type: Number, required: true },
      selfStakePct: { type: Number, required: true },
      timestamp: { type: Date, required: true },
    },
    { collection: 'stakes' }
  );
  
 export  const Stake = mongoose.model<IStake>('Stake', StakeSchema);