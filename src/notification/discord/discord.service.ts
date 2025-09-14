import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client, GatewayIntentBits } from 'discord.js';
import { INotificationProvider } from 'src/notification/notification.interface';

@Injectable()
export class DiscordService implements OnModuleInit, INotificationProvider {
  private client: Client;
  private token: string | undefined;
  private channelId: string | undefined;
  private readyPromise: Promise<void>;

  constructor(private readonly configService: ConfigService) {
    this.token = this.configService.get<string>('DISCORD_TOKEN');
    this.channelId = this.configService.get<string>('DISCORD_CHANNEL_ID');
    this.client = new Client({
      intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
    });
  }

  public async onModuleInit(): Promise<void> {
    await this.initClient();
  }

  private initClient(): Promise<void> {
    if (this.readyPromise !== undefined) {
      return this.readyPromise;
    }

    this.readyPromise = new Promise((resolve): void => {
      this.client.once('clientReady', () => {
        console.log(`✅ Discord bot logged in as ${this.client.user?.tag}`);
        resolve();
      });
    });
    this.client.login(this.token).catch((error) => {
      console.error('❌ Discord bot failed to log in:', error);
    });

    return this.readyPromise;
  }
  public async sendNotification(content: string): Promise<void> {
    try {
      await this.initClient();
      if (!this.channelId) {
        throw new Error('No channel ID');
      }
      const channel = await this.client.channels.fetch(this.channelId);
      if (!channel) {
        throw new Error('Channel not found');
      }
      if (!channel.isSendable()) {
        throw new Error('Cannot send message to channel');
      }
      await channel.send({ content });
    } catch (error) {
      console.error('❌ Failed to send Discord notification:', error);
    }
  }
}
