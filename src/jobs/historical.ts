import { insertStakeAndReward } from "../services/validator";
import { Metadata } from "../models";
import { connection } from "../config";

export default async function historical() {
    const last = await Metadata.getLastIndexedEpoch();
    const currentEpoch = await connection.getEpochInfo();
    for (let epoch = last + 1; epoch <= currentEpoch.epoch; epoch++) {
        await insertStakeAndReward(epoch);
        await Metadata.setLastIndexedEpoch(epoch);
    }
}