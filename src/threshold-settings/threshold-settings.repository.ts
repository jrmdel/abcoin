import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { ThresholdSettings } from 'src/threshold-settings/schemas/threshold-settings.schema';
import { AGGREGATED_THRESHOLD_PIPELINE } from 'src/threshold-settings/threshold-settings.constants';
import {
  IAggregatedThreshold,
  IFilterThreshold,
  IThresholdSettings,
  IThresholdSettingsDocument,
} from 'src/threshold-settings/threshold-settings.interface';

@Injectable()
export class ThresholdSettingsRepository {
  constructor(@InjectModel(ThresholdSettings.name) private readonly model: Model<ThresholdSettings>) {}

  public create(symbol: string, value: number): Promise<IThresholdSettings> {
    return this.model.create({ symbol, value });
  }

  public findAggregateThresholds(): Promise<IAggregatedThreshold[]> {
    return this.model.aggregate<IAggregatedThreshold>(AGGREGATED_THRESHOLD_PIPELINE).exec();
  }

  public findByQuery(query: IFilterThreshold): Promise<IThresholdSettings[]> {
    const hasValueFilter = query.min != null || query.max != null;
    const filter: FilterQuery<IThresholdSettingsDocument> = {
      ...(query.symbol && { symbol: query.symbol }),
      ...(hasValueFilter && {
        value: {
          ...(query.min != null && { $gte: query.min }),
          ...(query.max != null && { $lte: query.max }),
        },
      }),
    };
    return this.model.find(filter).lean().exec();
  }

  public findBySymbol(symbol: string): Promise<ThresholdSettings[]> {
    return this.model.find({ symbol }).sort({ value: 1 }).lean().exec();
  }

  public findBySymbolAndRange(symbol: string, min?: number, max?: number): Promise<ThresholdSettings[]> {
    const range: FilterQuery<ThresholdSettings>['value'] = {
      ...(min !== null || min !== undefined ? { $gte: min } : {}),
      ...(max !== null || max !== undefined ? { $lte: max } : {}),
    };
    return this.model.find({ symbol, value: range }).sort({ value: 1 }).lean().exec();
  }

  public async update(id: string, value: number): Promise<void> {
    await this.model.findByIdAndUpdate(id, { value }).exec();
  }

  public async delete(id: string): Promise<void> {
    await this.model.findByIdAndDelete(id).exec();
  }
}
