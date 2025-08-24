export function extractAmountFromListing(listing) {
  const priceDetails = listing.quote?.["USD"];

  return {
    symbol: listing.symbol,
    price: priceDetails.price,
    updatedAt: priceDetails.last_updated,
  };
}

export function isSignificantChange(oldPrice, newPrice, thresholdPercentage) {
  const change = Math.abs(newPrice - oldPrice);
  const changePercentage = (change / oldPrice) * 100;
  return changePercentage >= thresholdPercentage;
}
