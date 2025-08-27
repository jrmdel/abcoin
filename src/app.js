import "dotenv/config";
import { dbConnector } from "./db/connector.js";
import { schedule } from "node-cron";
import { generateReport } from "./core/instant-report.js";
import { main } from "./core/check-changes.js";

async function startDb() {
  try {
    await dbConnector.connect();
  } catch (error) {
    console.error("An error occurred while running the app:", error);
  }
}

// Schedule the job to run every hour at minute 0
schedule("0 * * * *", () => {
  console.log("Running scheduled job at", new Date().toISOString());
  main().catch((error) => {
    console.error("An error occurred while checking for significant changes:", error);
  });
});

// Schedule the report generation job to run every Monday at noon
schedule("0 12 * * 1", async () => {
  console.log("Running Monday noon job", new Date().toISOString());
  try {
    await generateReport();
  } catch (error) {
    console.error("An error occurred while generating the report:", error);
  }
});

startDb();
