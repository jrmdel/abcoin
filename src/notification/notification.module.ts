import { Module } from '@nestjs/common';
import { DiscordModule } from 'src/notification/discord/discord.module';
import { NotificationService } from 'src/notification/notification.service';

@Module({
  imports: [DiscordModule],
  providers: [NotificationService],
  exports: [NotificationService],
})
export class NotificationModule {}
