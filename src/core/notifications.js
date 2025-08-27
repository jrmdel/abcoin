import { formatChangeResults, formatReportMessage } from "../functions/formatter.tools.js";
import { discordClient } from "../lib/discord-client.js";

export function sendDeploymentNotification() {
  const message = "🚀 Bot has been deployed and is now running!";
  return discordClient.sendNotification(message);
}

export async function sendLiveAlertNotificationIfNeeded(changeResults) {
  const message = formatChangeResults(changeResults);
  if (message) {
    await discordClient.sendNotification(message);
  }
}

export async function sendReportNotificationIfNeeded(listings) {
  const message = formatReportMessage(listings);
  if (message) {
    await discordClient.sendNotification(message);
  }
}
