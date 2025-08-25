import { dbConnector } from "../db/connector.js";
import { CoinHistoryRepository } from "../db/repositories/coin-history.repository.js";
import { extractAmountFromListing, isSignificantChange } from "../functions/crypto.tools.js";
import { DiscordClient } from "../lib/discord-client.js";
import { CmcProviderService } from "../providers/cmc-provider.service.js";

const FOLLOWED_SYMBOLS = ["BTC", "ETH", "ADA", "SOL", "AVAX", "XTZ", "BNB"];
const THRESHOLD_PERCENTAGE = 5;

async function checkSignificantChanges(listings, repository) {
  const results = [];
  for (const count of [1, 12]) {
    const result = await checkSignificantChangesForNPreviousListings(listings, repository, count);
    results.push(...result);
  }
  return results;
}

async function checkSignificantChangesForNPreviousListings(listings, repository, n) {
  const results = [];
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
      results.push({ symbol: listing.symbol, price: listing.price, meanPrice, hourPeriod: n });
    }
  }
  return results;
}

function formatChangeResults(results) {
  const groupedBySymbol = results
    .sort((a, b) => a.symbol.localeCompare(b.symbol) || a.hourPeriod - b.hourPeriod)
    .reduce((acc, { symbol, price, ...rest }) => {
      if (!acc[symbol]) {
        acc[symbol] = { changes: [] };
      }
      acc[symbol].price = price;
      acc[symbol].changes.push(rest);
      return acc;
    }, {});

  const linesList = Object.entries(groupedBySymbol).map(([symbol, { price, changes }]) => {
    const cleanPrice = price.toFixed(4);
    const lines = changes
      .map((change) => {
        const variation = cleanPrice > change.meanPrice ? "📈" : "📉";
        const mean = change.meanPrice.toFixed(4);
        const percentage = (((cleanPrice - mean) / mean) * 100).toFixed(2);
        return `- -${change.hourPeriod}h : ${percentage}% ${variation} (mean $${mean})`;
      })
      .join("\n");
    return `**${symbol}**: $${cleanPrice}\n${lines}`;
  });
  linesList.unshift("🚨 Significant price changes detected:\n");
  return linesList.join("\n");
}

export async function main() {
  const discordClient = new DiscordClient();
  const db = dbConnector.getDb();
  const repository = new CoinHistoryRepository(db);
  const cmcProvider = new CmcProviderService();

  const rawListings = await cmcProvider.getCryptocurrencyListings();
  const listings = rawListings
    .map((listing) => extractAmountFromListing(listing))
    .filter((listing) => FOLLOWED_SYMBOLS.includes(listing.symbol));

  const results = await checkSignificantChanges(listings, repository);
  await discordClient.sendNotification(formatChangeResults(results));
  await repository.saveListings(listings);
}
