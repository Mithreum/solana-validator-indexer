import mongoose, { Schema } from "mongoose";
import { IReward } from "./interfaces";

export const RewardSchema = new Schema<IReward>(
    {
      votePubkey: { type: String, required: true, index: true },
      epoch: { type: Number, required: true, index: true },
      rewardLamports: { type: Number, required: true },
      rewardSOL: { type: Number, required: true },
      credits: { type: Number, required: true },
      prevCredits: { type: Number, required: true },
      timestamp: { type: Date, required: true },
    },
    { collection: 'rewards' }
  );
  
export const Reward = mongoose.model<IReward>('Reward', RewardSchema);