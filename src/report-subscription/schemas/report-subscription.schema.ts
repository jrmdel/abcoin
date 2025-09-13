import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true, collection: 'report_subscriptions' })
export class ReportSubscription {
  @Prop({ type: [String], required: true })
  symbols: string[];
}

export const ReportSubscriptionSchema = SchemaFactory.createForClass(ReportSubscription);
