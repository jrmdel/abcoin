import { Injectable } from '@nestjs/common';
import { FOLLOWED_SYMBOLS, VARIATION_SETTINGS } from 'src/coin-history/coin-history.constants';
import {
  IAggregatedCoinLastListing,
  ICoinListingChange,
  IVariationSettings,
} from 'src/coin-history/coin-history.interface';
import { CoinHistoryRepository } from 'src/coin-history/coin-history.repository';
import { extractAmountFromListing, isSignificantChange } from 'src/functions/crypto/crypto.tools';
import { NotificationService } from 'src/notification/notification.service';
import { CmcProviderService } from 'src/providers/cmc/cmc-provider.service';

@Injectable()
export class CoinHistoryService {
  constructor(
    private readonly coinHistoryRepository: CoinHistoryRepository,
    private readonly provider: CmcProviderService,
    private readonly notificationService: NotificationService,
  ) {}

  public async saveCurrentListings(): Promise<void> {
    const rawListings = await this.provider.getCryptocurrencyListings();
    const listings = rawListings.map((listing) => extractAmountFromListing(listing));

    await this.coinHistoryRepository.saveListings(listings);
  }

  public async generateLiveAlert(): Promise<void> {
    const listings = await this.coinHistoryRepository.getLastListings(FOLLOWED_SYMBOLS);

    const results = await this.checkSignificantChanges(listings);
    this.notificationService.sendLiveAlertNotificationIfNeeded(results).catch((err) => {
      console.error('Error sending live alert notification:', err);
    });
  }

  private async checkSignificantChanges(listings: IAggregatedCoinLastListing[]): Promise<ICoinListingChange[]> {
    const results: ICoinListingChange[] = [];
    for (const settings of VARIATION_SETTINGS) {
      const result = await this.checkSignificantChangesOnGivenPeriod(listings, settings);
      results.push(...result);
    }
    return results;
  }

  private async checkSignificantChangesOnGivenPeriod(
    listings: IAggregatedCoinLastListing[],
    { hours, percentage }: IVariationSettings,
  ): Promise<ICoinListingChange[]> {
    const results: ICoinListingChange[] = [];
    for (const listing of listings) {
      const oldPrice = await this.coinHistoryRepository.getHistoricalPrice(listing._id, hours);
      if (oldPrice === null) {
        continue;
      }
      const isSignificant = isSignificantChange(oldPrice, listing.price, percentage);
      if (isSignificant) {
        console.log(
          `Significant change detected for ${listing._id}: from ${oldPrice} (${hours}h ago) to ${listing.price}`,
        );
        results.push({ symbol: listing._id, price: listing.price, oldPrice, hourPeriod: hours });
      }
    }
    return results;
  }
}
