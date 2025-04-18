import cron from "node-cron";
import historical from "./historical";

export default function startUpdater() {
  cron.schedule(process.env.EPOCH_POLL_INTERVAL_CRON!, async () => {
    console.log("🔄 Running incremental update…");
    await historical();  // backfill handles “from last → current”
  });
}