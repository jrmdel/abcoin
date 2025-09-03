import { CoinHistoryRepository } from '../db/repositories/coin-history.repository.js';
import { extractAmountFromListing } from '../functions/crypto.tools.js';
import { CmcProviderService } from '../providers/cmc-provider.service.js';

export async function saveToHistory() {
  const repository = new CoinHistoryRepository();
  const provider = new CmcProviderService();

  const rawListings = await provider.getCryptocurrencyListings();
  const listings = rawListings.map((listing) => extractAmountFromListing(listing));

  await repository.saveListings(listings);
  return listings;
}
