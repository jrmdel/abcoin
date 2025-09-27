import { Injectable } from '@nestjs/common';
import { CoinHistoryRepository } from 'src/coin-history/coin-history.repository';
import { computeHasThresholdReached } from 'src/functions/threshold/threshold.tools';
import { NotificationService } from 'src/notification/notification.service';
import { IThresholdSettings } from 'src/threshold-settings/threshold-settings.interface';
import { ThresholdSettingsRepository } from 'src/threshold-settings/threshold-settings.repository';

@Injectable()
export class ThresholdSettingsService {
  constructor(
    private readonly thresholdSettingsRepository: ThresholdSettingsRepository,
    private readonly coinHistoryRepository: CoinHistoryRepository,
    private readonly notificationService: NotificationService,
  ) {}

  public create(symbol: string, value: number): Promise<IThresholdSettings> {
    return this.thresholdSettingsRepository.create(symbol, value);
  }

  public deleteThreshold(id: string): Promise<void> {
    return this.thresholdSettingsRepository.delete(id);
  }

  public async checkIfThresholdsHaveBeenReached(): Promise<void> {
    const aggregatedThresholds = await this.thresholdSettingsRepository.findAggregateThresholds();
    const symbols = aggregatedThresholds.flatMap((threshold) => threshold.symbol);
    const pricesArray = await this.coinHistoryRepository.getLastNListings(symbols, 2);

    const thresholdsReached = computeHasThresholdReached(aggregatedThresholds, pricesArray);
    await this.notificationService.sendThresholdNotificationIfNeeded(thresholdsReached);
  }
}
