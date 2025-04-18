import mongoose, { Schema } from "mongoose";
import { IMetadata } from "./interfaces";

export const MetadataSchema = new Schema<IMetadata>(
    { lastIndexedEpoch: { type: Number, required: true } },
    { collection: 'metadata', timestamps: true }
  );
  
  MetadataSchema.statics.getLastIndexedEpoch = async function (): Promise<number> {
    const doc = await this.findOne().sort({ _id: -1 }).exec();
    return doc?.lastIndexedEpoch ?? parseInt(process.env.BACKFILL_START_EPOCH || '0', 10);
  };
  
  MetadataSchema.statics.setLastIndexedEpoch = async function (epoch: number): Promise<void> {
    await this.updateOne({}, { $set: { lastIndexedEpoch: epoch } }, { upsert: true }).exec();
  };
  
export const Metadata = mongoose.model<IMetadata, mongoose.Model<IMetadata> & {
    getLastIndexedEpoch(): Promise<number>;
    setLastIndexedEpoch(epoch: number): Promise<void>;
  }>('Metadata', MetadataSchema);