import { Client, GatewayIntentBits } from "discord.js";

export class DiscordClient {
  constructor() {
    const token = process.env.DISCORD_TOKEN;
    const channelId = process.env.DISCORD_CHANNEL_ID;
    const client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
      ],
    });
    if (!token || !channelId) {
      throw new Error("Discord token or channel ID is not set in environment variables");
    }
    this.token = token;
    this.channelId = channelId;
    this.client = client;
    this.#initClient();
  }

  #initClient() {
    return new Promise((resolve) => {
      this.client.once("ready", () => {
        console.log(`✅ Discord bot logged in as ${this.client.user?.tag}`);
        resolve();
      });
      this.client.login(this.token);
    });
  }

  async sendNotification(content) {
    try {
      const channel = await this.client.channels.fetch(this.channelId);
      await channel.send({ content });
    } catch (error) {
      console.error("❌ Failed to send Discord notification:", error);
    }
  }
}
