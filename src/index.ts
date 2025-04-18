import dotenv from "dotenv";
dotenv.config();

import { connectDB } from "./config/db";
import historical from "./jobs/historical";
import startUpdater from "./jobs/updater";

async function main() {
  await connectDB(process.env.MONGO_URI!);
  await historical();       // one‑time boot backfill
  startUpdater();           // schedule regular polling
}

main().catch(console.error);