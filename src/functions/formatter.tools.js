const REPORT_HEADER = '📊 **Crypto Report** 📊\n';

export function formatReportMessage(listings) {
  if (listings.length === 0) {
    return null;
  }

  const lines = [];
  listings.forEach((listing) => {
    const dailyChange = (listing.percentChange24h || 0).toFixed(2);
    const weeklyChange = (listing.percentChange7d || 0).toFixed(2);

    const line = [
      `**🪙 ${listing.symbol}** - $${formatPrice(listing.price)}`,
      `- 24h Change: ${dailyChange}% ${dailyChange >= 0 ? '🟢' : '🔴'}`,
      `- 7d Change: ${weeklyChange}% ${weeklyChange >= 0 ? '🟢' : '🔴'}\n`,
    ];
    lines.push(line.join('\n'));
  });

  lines.unshift(REPORT_HEADER);
  return lines.join('\n');
}

function formatTimePeriod(hours) {
  if (hours % 24 === 0) {
    return `${hours / 24}d`;
  }
  return `${hours}h`;
}

function formatPrice(price) {
  if (price >= 1000) {
    // Rounding for large prices and add a space as thousand separator
    return Math.round(price)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  } else if (price > 0) {
    return price.toFixed(2);
  } else if (price < 0.001) {
    return price.toExponential(4);
  }
  return price.toFixed(4);
}

export function formatChangeResults(results) {
  const groupedBySymbol = results
    .sort(
      (a, b) => a.symbol.localeCompare(b.symbol) || a.hourPeriod - b.hourPeriod
    )
    .reduce((acc, { symbol, price, ...rest }) => {
      if (!acc[symbol]) {
        acc[symbol] = { changes: [] };
      }
      acc[symbol].price = formatPrice(price);
      acc[symbol].changes.push(rest);
      return acc;
    }, {});

  const linesList = Object.entries(groupedBySymbol).map(
    ([symbol, { price, changes }]) => {
      const lines = changes
        .map((change) => {
          const oldPrice = formatPrice(change.oldPrice);
          const variation = price > oldPrice ? '📈' : '📉';
          const percentage = (((price - oldPrice) / oldPrice) * 100).toFixed(2);
          return `- ${formatTimePeriod(
            change.hourPeriod
          )}: ${percentage}% ${variation} (old price $${oldPrice})`;
        })
        .join('\n');
      return `**${symbol}**: $${price}\n${lines}`;
    }
  );
  if (linesList.length === 0) {
    return null;
  }
  linesList.unshift('🚨 Significant price changes detected:\n');
  return linesList.join('\n');
}
