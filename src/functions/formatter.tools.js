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
