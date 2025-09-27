import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CoinHistoryModule } from 'src/coin-history/coin-history.module';
import { NotificationModule } from 'src/notification/notification.module';
import { ThresholdSettings, ThresholdSettingsSchema } from 'src/threshold-settings/schemas/threshold-settings.schema';
import { ThresholdSettingsController } from 'src/threshold-settings/threshold-settings.controller';
import { ThresholdSettingsRepository } from 'src/threshold-settings/threshold-settings.repository';
import { ThresholdSettingsService } from 'src/threshold-settings/threshold-settings.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: ThresholdSettings.name, schema: ThresholdSettingsSchema }]),
    NotificationModule,
    CoinHistoryModule,
  ],
  controllers: [ThresholdSettingsController],
  providers: [ThresholdSettingsService, ThresholdSettingsRepository],
  exports: [ThresholdSettingsService],
})
export class ThresholdSettingsModule {}
