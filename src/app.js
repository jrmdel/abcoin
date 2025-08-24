import "dotenv/config";
import { dbConnector } from "./db/connector.js";
import { main } from "./core/main.js";

async function startApp() {
  try {
    await dbConnector.connect();
    await main();
  } catch (error) {
    console.error("Failed to connect to the database:", error);
  } finally {
    await dbConnector.disconnect();
  }
}

setInterval(() => startApp(), 60 * 60 * 1000); // Run every hour
startApp(); // Initial call to start the app immediately
