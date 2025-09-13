import { Injectable } from '@nestjs/common';
import { CoinHistoryRepository } from 'src/coin-history/coin-history.repository';
import { ReportSubscriptionRepository } from 'src/report-subscription/report-subscription.repository';
import { NotificationService } from 'src/notification/notification.service';

@Injectable()
export class ReportSubscriptionService {
  constructor(
    private readonly repository: ReportSubscriptionRepository,
    private readonly coinHistoryRepository: CoinHistoryRepository,
    private readonly notificationService: NotificationService,
  ) {}

  public async generateReport(): Promise<void> {
    const subscriptions = await this.repository.getSubscriptions();
    for (const subscription of subscriptions) {
      const symbols = subscription.symbols || [];
      const listings = await this.coinHistoryRepository.getDifferences(symbols);
      this.notificationService.sendReportNotificationIfNeeded(listings).catch((err) => {
        console.error('Error sending report notification:', err);
      });
    }
  }
}
