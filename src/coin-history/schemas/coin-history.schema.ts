import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ICoinHistoryDocument, ICoinHistoryMetadataDocument } from 'src/coin-history/coin-history.interface';

@Schema({ _id: false })
class Metadata implements ICoinHistoryMetadataDocument {
  @Prop({ type: Number, required: true })
  price: number;

  @Prop({ type: String, required: true })
  symbol: string;

  @Prop({ type: Date, required: true })
  updatedAt: Date;
}

@Schema({
  timestamps: false,
  collection: 'coin-history',
  timeseries: { timeField: 'date', metaField: 'metadata', granularity: 'hours' },
  versionKey: false,
})
export class CoinHistory implements ICoinHistoryDocument {
  @Prop({ type: Date, required: true })
  date: Date;

  @Prop({ type: Metadata, required: true })
  metadata: Metadata;
}

export const CoinHistorySchema = SchemaFactory.createForClass(CoinHistory);
