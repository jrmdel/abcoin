import { discordClient } from "../lib/discord-client.js";

export function sendDeploymentNotification() {
  const message = "🚀 Bot has been deployed and is now running!";
  return discordClient.sendNotification(message);
}
