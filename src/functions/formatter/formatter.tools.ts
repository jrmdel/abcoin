import { ICoinListingChange, ICoinListingChangeReport } from 'src/coin-history/coin-history.interface';

const REPORT_HEADER = '📊 **Crypto Report** 📊\n';

export function formatReportMessage(listings: ICoinListingChangeReport[]): string | null {
  if (listings.length === 0) {
    return null;
  }

  const lines: string[] = [];
  listings.forEach((listing) => {
    const dailyChange = listing.percentChange24h.toFixed(2);
    const weeklyChange = listing.percentChange7d.toFixed(2);

    const line = [
      `**🪙 ${listing.symbol}** - $${formatPrice(listing.price)}`,
      `- 24h Change: ${dailyChange}% ${listing.percentChange24h >= 0 ? '🟢' : '🔴'}`,
      `- 7d Change: ${weeklyChange}% ${listing.percentChange7d >= 0 ? '🟢' : '🔴'}\n`,
    ];
    lines.push(line.join('\n'));
  });

  lines.unshift(REPORT_HEADER);
  return lines.join('\n');
}

function formatTimePeriod(hours: number): string {
  if (hours % 24 === 0) {
    return `${hours / 24}d`;
  }
  return `${hours}h`;
}

export function formatPrice(price: number): string {
  if (price >= 1000) {
    // Rounding for large prices and add a space as thousand separator
    return Math.round(price)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  } else if (price > 10) {
    return price.toFixed(2);
  } else if (price > 0.1) {
    return price.toFixed(3);
  } else if (price < 0.001) {
    return price.toExponential(4);
  }
  return price.toFixed(4);
}

export function formatChangeResults(results: ICoinListingChange[]): string | null {
  const accumulator: Record<string, { price: number; changes: { oldPrice: number; hourPeriod: number }[] }> = {};
  const groupedBySymbol = results
    .sort((a, b) => a.symbol.localeCompare(b.symbol) || a.hourPeriod - b.hourPeriod)
    .reduce((acc, { symbol, price, ...rest }) => {
      if (!acc[symbol]) {
        acc[symbol] = { price: NaN, changes: [] };
      }
      acc[symbol].price = price;
      acc[symbol].changes.push(rest);
      return acc;
    }, accumulator);

  const linesList = Object.entries(groupedBySymbol).map(([symbol, { price, changes }]) => {
    const lines = changes
      .map((change) => {
        const oldPrice = formatPrice(change.oldPrice);
        const variation = price > change.oldPrice ? '📈' : '📉';
        const percentage = (((price - change.oldPrice) / change.oldPrice) * 100).toFixed(2);
        return `- ${formatTimePeriod(change.hourPeriod)}: ${percentage}% ${variation} (old price $${oldPrice})`;
      })
      .join('\n');
    return `**${symbol}**: $${formatPrice(price)}\n${lines}`;
  });
  if (linesList.length === 0) {
    return null;
  }
  linesList.unshift('🚨 Significant price changes detected:\n');
  return linesList.join('\n');
}
