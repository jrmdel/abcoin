import { Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true, collection: 'report_subscriptions' })
export class SubscriptionSettings {}

export const SubscriptionSettingsSchema = SchemaFactory.createForClass(SubscriptionSettings);
