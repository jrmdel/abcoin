import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SubscriptionSettings } from 'src/subscription-settings/schemas/subscription-settings.schema';

@Injectable()
export class SubscriptionSettingsRepository {
  constructor(@InjectModel(SubscriptionSettings.name) private readonly model: Model<SubscriptionSettings>) {}
}
