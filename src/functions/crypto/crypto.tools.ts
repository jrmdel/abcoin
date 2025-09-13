import { ICoinListing } from 'src/coin-history/coin-history.interface';
import { ICmcListing } from 'src/providers/cmc/cmc-provider.interface';

export function extractAmountFromListing(listing: ICmcListing): ICoinListing {
  const priceDetails = listing.quote?.['USD'];

  return {
    symbol: listing.symbol,
    price: priceDetails.price,
    updatedAt: priceDetails.last_updated,
  };
}

export function isSignificantChange(
  oldPrice: number,
  newPrice: number,
  thresholdPercentage: number,
): boolean {
  const change = Math.abs(newPrice - oldPrice);
  const changePercentage = (change / oldPrice) * 100;
  return changePercentage >= thresholdPercentage;
}
