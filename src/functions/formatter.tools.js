const REPORT_HEADER = "📊 **Crypto Report** 📊\n";

export function formatReportMessage(listings) {
  if (listings.length === 0) {
    return null;
  }

  const lines = [];
  listings.forEach((listing) => {
    const dailyChange = (listing.percentChange24h || 0).toFixed(2);
    const weeklyChange = (listing.percentChange7d || 0).toFixed(2);

    const line = [
      `**🪙 ${listing.symbol}** - $${listing.price.toFixed(4)}`,
      `- 24h Change: ${dailyChange}% ${dailyChange >= 0 ? "🟢" : "🔴"}`,
      `- 7d Change: ${weeklyChange}% ${weeklyChange >= 0 ? "🟢" : "🔴"}\n`,
    ];
    lines.push(line.join("\n"));
  });

  lines.unshift(REPORT_HEADER);
  return lines.join("\n");
}

export function formatChangeResults(results) {
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
        const variation = cleanPrice > change.oldPrice ? "📈" : "📉";
        const mean = change.oldPrice.toFixed(4);
        const percentage = (((cleanPrice - mean) / mean) * 100).toFixed(2);
        return `- -${change.hourPeriod}h : ${percentage}% ${variation} (mean $${mean})`;
      })
      .join("\n");
    return `**${symbol}**: $${cleanPrice}\n${lines}`;
  });
  if (linesList.length === 0) {
    return null;
  }
  linesList.unshift("🚨 Significant price changes detected:\n");
  return linesList.join("\n");
}
