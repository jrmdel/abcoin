import { Injectable } from '@nestjs/common';
import { CacheService } from 'src/cache/cache.service';
import { IAggregatedCoinLastNListings, ICoinListing } from 'src/coin-history/coin-history.interface';
import { CoinHistoryRepository } from 'src/coin-history/coin-history.repository';
import { computeHasThresholdReached } from 'src/functions/threshold/threshold.tools';
import { NotificationService } from 'src/notification/notification.service';
import { IFilterThreshold, IThresholdSettings } from 'src/threshold-settings/threshold-settings.interface';
import { ThresholdSettingsRepository } from 'src/threshold-settings/threshold-settings.repository';

@Injectable()
export class ThresholdSettingsService {
  constructor(
    private readonly thresholdSettingsRepository: ThresholdSettingsRepository,
    private readonly coinHistoryRepository: CoinHistoryRepository,
    private readonly notificationService: NotificationService,
    private readonly cacheService: CacheService,
  ) {}

  public create(symbol: string, value: number): Promise<IThresholdSettings> {
    return this.thresholdSettingsRepository.create(symbol, value);
  }

  public findByQuery(query: IFilterThreshold): Promise<IThresholdSettings[]> {
    return this.thresholdSettingsRepository.findByQuery(query);
  }

  public async updateThreshold(id: string, value: number): Promise<boolean> {
    try {
      await this.thresholdSettingsRepository.update(id, value);
      return true;
    } catch {
      console.error(`Failed to update threshold with id ${id} to value ${value}`);
      return false;
    }
  }

  public deleteThreshold(id: string): Promise<void> {
    return this.thresholdSettingsRepository.delete(id);
  }

  public async checkIfThresholdsHaveBeenReached(
    currentListings?: ICoinListing[],
  ): Promise<IAggregatedCoinLastNListings[]> {
    const aggregatedThresholds = await this.thresholdSettingsRepository.findAggregateThresholds();
    const symbols = aggregatedThresholds.flatMap((threshold) => threshold.symbol);
    const pricesArray = await this.getPriceRanges(symbols, currentListings);

    const thresholdsReached = computeHasThresholdReached(aggregatedThresholds, pricesArray);
    await this.notificationService.sendThresholdNotificationIfNeeded(thresholdsReached);
    return pricesArray;
  }

  private async getPriceRanges(
    symbols: string[],
    currentListings?: ICoinListing[],
  ): Promise<IAggregatedCoinLastNListings[]> {
    if (!currentListings?.length) {
      return this.coinHistoryRepository.getLastNListings(symbols, 2);
    }
    const result: IAggregatedCoinLastNListings[] = [];
    for (const symbol of symbols) {
      const lastPrice = await this.cacheService.get(symbol);
      const listing = currentListings.find((listing) => listing.symbol === symbol);
      if (!listing) {
        continue;
      }
      const prices = [lastPrice, listing.price];
      result.push({ _id: symbol, prices });
    }
    return result;
  }
}
