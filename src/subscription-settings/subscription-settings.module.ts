import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  SubscriptionSettings,
  SubscriptionSettingsSchema,
} from 'src/subscription-settings/schemas/subscription-settings.schema';
import { SubscriptionSettingsRepository } from 'src/subscription-settings/subscription-settings.repository';

@Module({
  imports: [MongooseModule.forFeature([{ name: SubscriptionSettings.name, schema: SubscriptionSettingsSchema }])],
  controllers: [],
  providers: [SubscriptionSettingsRepository],
})
export class SubscriptionSettingsModule {}
