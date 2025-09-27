import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true, collection: 'report_subscriptions' })
export class SubscriptionSettings extends Document<string> {}

export const SubscriptionSettingsSchema = SchemaFactory.createForClass(SubscriptionSettings);
