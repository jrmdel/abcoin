import { CoinHistoryRepository } from "../db/repositories/coin-history.repository.js";
import { ReportSubscriptionRepository } from "../db/repositories/report-subscription.repository.js";
import { formatReportMessage } from "../functions/formatter.tools.js";
import { discordClient } from "../lib/discord-client.js";

export async function generateReport() {
  const repository = new ReportSubscriptionRepository();
  const historyRepository = new CoinHistoryRepository();

  const subscriptions = await repository.getSubscriptions();
  for (const sub of subscriptions) {
    const symbols = sub.symbols || [];
    const listings = await historyRepository.getLastListings(symbols);
    const message = formatReportMessage(listings);
    discordClient.sendNotification(message);
  }
  // Placeholder for report generation logic
  console.log("Report generated.");
}
