import { Injectable } from '@nestjs/common';
import { ICoinListingChange, ICoinListingChangeReport } from 'src/coin-history/coin-history.interface';
import { formatChangeResults, formatReportMessage } from 'src/functions/formatter/formatter.tools';
import { DiscordService } from 'src/notification/discord/discord.service';

@Injectable()
export class NotificationService {
  constructor(private readonly discordService: DiscordService) {}

  public async sendDeploymentNotification(): Promise<void> {
    const message = '🚀 Bot has been deployed and is now running!';
    await this.discordService.sendNotification(message);
  }

  public async sendLiveAlertNotificationIfNeeded(changeResults: ICoinListingChange[]): Promise<void> {
    const message = formatChangeResults(changeResults);
    if (message) {
      await this.discordService.sendNotification(message);
    }
  }

  public async sendReportNotificationIfNeeded(listings: ICoinListingChangeReport[]): Promise<void> {
    const message = formatReportMessage(listings);
    if (message) {
      await this.discordService.sendNotification(message);
    }
  }
}
