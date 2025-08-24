import { dbConnector } from "../db/connector.js";
import { CoinHistoryRepository } from "../db/repositories/coin-history.repository.js";
import { extractAmountFromListing, isSignificantChange } from "../functions/crypto.tools.js";
import { CmcProviderService } from "../providers/cmc-provider.service.js";

const FOLLOWED_SYMBOLS = ["BTC", "ETH", "ADA", "SOL", "AVAX", "XTZ", "BNB"];
const THRESHOLD_PERCENTAGE = 1;

async function checkSignificantChanges(listings, repository) {
  for (const count of [1, 12]) {
    await checkSignificantChangesForNPreviousListings(listings, repository, count);
  }
}

async function checkSignificantChangesForNPreviousListings(listings, repository, n) {
  for (const listing of listings) {
    const meanPrice = await repository.getNPreviousListingsMeanPrice(n, listing.symbol);
    if (meanPrice === null) {
      continue;
    }
    const isSignificant = isSignificantChange(meanPrice, listing.price, THRESHOLD_PERCENTAGE);
    if (isSignificant) {
      console.log(
        `Significant change detected for ${listing.symbol}: from mean ${meanPrice} (last ${n} values) to ${listing.price}`
      );
      // Here you can add code to send an alert/notification
    }
  }
}

export async function main() {
  const db = dbConnector.getDb();
  const repository = new CoinHistoryRepository(db);
  const cmcProvider = new CmcProviderService();

  const rawListings = await cmcProvider.getCryptocurrencyListings();
  const listings = rawListings
    .map((listing) => extractAmountFromListing(listing))
    .filter((listing) => FOLLOWED_SYMBOLS.includes(listing.symbol));

  await checkSignificantChanges(listings, repository);
  await repository.saveListings(listings);
}
