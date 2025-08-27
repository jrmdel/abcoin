import { CoinHistoryRepository } from "../db/repositories/coin-history.repository.js";
import { extractAmountFromListing, isSignificantChange } from "../functions/crypto.tools.js";
import { CmcProviderService } from "../providers/cmc-provider.service.js";
import { sendLiveAlertNotificationIfNeeded } from "./notifications.js";

const FOLLOWED_SYMBOLS = ["ADA", "AVAX", "BNB", "BTC", "ETH", "SOL", "XTZ"];
const THRESHOLD_SETTINGS = [
  { hours: 1, percentage: 3 },
  { hours: 24, percentage: 5 },
  { hours: 84, percentage: 10 },
];

async function checkSignificantChanges(listings, repository) {
  const results = [];
  for (const settings of THRESHOLD_SETTINGS) {
    const result = await checkSignificantChangesOnGivenPeriod(listings, repository, settings);
    results.push(...result);
  }
  return results;
}

async function checkSignificantChangesOnGivenPeriod(listings, repository, { hours, percentage }) {
  const results = [];
  for (const listing of listings) {
    const oldPrice = await repository.getHistoricalPrice(listing.symbol, hours);
    if (oldPrice === null) {
      continue;
    }
    const isSignificant = isSignificantChange(oldPrice, listing.price, percentage);
    if (isSignificant) {
      console.log(
        `Significant change detected for ${listing.symbol}: from ${oldPrice} (${hours}h ago) to ${listing.price}`
      );
      results.push({ symbol: listing.symbol, price: listing.price, oldPrice, hourPeriod: hours });
    }
  }
  return results;
}

export async function generateLiveAlert() {
  const repository = new CoinHistoryRepository();
  const cmcProvider = new CmcProviderService();

  const rawListings = await cmcProvider.getCryptocurrencyListings();
  const listings = rawListings
    .map((listing) => extractAmountFromListing(listing))
    .filter((listing) => FOLLOWED_SYMBOLS.includes(listing.symbol));

  const results = await checkSignificantChanges(listings, repository);
  sendLiveAlertNotificationIfNeeded(results);
  await repository.saveListings(listings);
}
