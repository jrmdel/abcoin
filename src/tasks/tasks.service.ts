import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { CoinHistoryService } from 'src/coin-history/coin-history.service';
import { ReportSubscriptionService } from 'src/report-subscription/report-subscription.service';

@Injectable()
export class TasksService {
  constructor(
    private readonly coinHistoryService: CoinHistoryService,
    private readonly reportSubscriptionService: ReportSubscriptionService,
  ) {}

  @Cron('0 * * * *')
  public generateLiveAlert(): void {
    console.log('Running scheduled job at', new Date().toISOString());
    this.coinHistoryService.generateLiveAlert().catch((err) => {
      console.error('Error generating alert:', err);
    });
  }

  @Cron('*/10 * * * *')
  saveToHistory(): void {
    this.coinHistoryService.saveCurrentListings().catch((err) => {
      console.error('Error saving current listings:', err);
    });
  }

  @Cron('0 19 * * *')
  public generateReport(): void {
    console.log('Running scheduled job at', new Date().toISOString());
    this.reportSubscriptionService.generateReport().catch((err) => {
      console.error('Error generating report notification:', err);
    });
  }
}
