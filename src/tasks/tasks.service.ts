import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { CoinHistoryService } from 'src/coin-history/coin-history.service';
import { ReportSubscriptionService } from 'src/report-subscription/report-subscription.service';
import { ThresholdSettingsService } from 'src/threshold-settings/threshold-settings.service';

@Injectable()
export class TasksService {
  constructor(
    private readonly coinHistoryService: CoinHistoryService,
    private readonly reportSubscriptionService: ReportSubscriptionService,
    private readonly thresholdSettingsService: ThresholdSettingsService,
  ) {}

  @Cron('0 * * * *')
  public generateLiveAlert(): void {
    console.log('Running scheduled job at', new Date().toISOString());
    this.coinHistoryService.generateLiveAlert().catch((err) => {
      console.error('Error generating alert:', err);
    });
  }

  @Cron('*/10 * * * *')
  public async saveToHistory(): Promise<void> {
    try {
      const listings = await this.coinHistoryService.saveCurrentListings();
      await this.thresholdSettingsService.checkIfThresholdsHaveBeenReached(listings);
      await this.coinHistoryService.cacheListings(listings);
    } catch (error) {
      console.error('Error saving current listings:', error);
    }
  }

  @Cron('0 10 * * *')
  public generateReport(): void {
    console.log('Running scheduled job at', new Date().toISOString());
    this.reportSubscriptionService.generateReport().catch((err) => {
      console.error('Error generating report notification:', err);
    });
  }
}
