import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { IThresholdSettingsDocument } from 'src/threshold-settings/threshold-settings.interface';

@Schema({ timestamps: true, collection: 'threshold_settings' })
export class ThresholdSettings extends Document<string> implements IThresholdSettingsDocument {
  @Prop({ type: String, required: true })
  symbol: string;

  @Prop({ type: Number, required: true })
  value: number;
}

export const ThresholdSettingsSchema = SchemaFactory.createForClass(ThresholdSettings);
ThresholdSettingsSchema.index({ symbol: 1, value: 1 });
