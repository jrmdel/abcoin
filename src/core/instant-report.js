import { CoinHistoryRepository } from '../db/repositories/coin-history.repository.js';
import { ReportSubscriptionRepository } from '../db/repositories/report-subscription.repository.js';
import { sendReportNotificationIfNeeded } from './notifications.js';

export async function generateReport() {
  const repository = new ReportSubscriptionRepository();
  const historyRepository = new CoinHistoryRepository();

  const subscriptions = await repository.getSubscriptions();
  for (const sub of subscriptions) {
    const symbols = sub.symbols || [];
    const listings = await historyRepository.getDifferences(symbols);
    sendReportNotificationIfNeeded(listings);
  }
  console.log('Report generated.');
}
