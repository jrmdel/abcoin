import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ReportSubscription } from 'src/report-subscription/schemas/report-subscription.schema';

@Injectable()
export class ReportSubscriptionRepository {
  constructor(@InjectModel(ReportSubscription.name) private readonly model: Model<ReportSubscription>) {}

  public getSubscriptions(): Promise<{ symbols: string[] }[]> {
    return this.model.find({}).skip(0).limit(100).lean().exec();
  }
}
