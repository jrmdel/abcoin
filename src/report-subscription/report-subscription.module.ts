import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CoinHistoryModule } from 'src/coin-history/coin-history.module';
import { NotificationModule } from 'src/notification/notification.module';
import { ReportSubscriptionRepository } from 'src/report-subscription/report-subscription.repository';
import { ReportSubscriptionService } from 'src/report-subscription/report-subscription.service';
import {
  ReportSubscription,
  ReportSubscriptionSchema,
} from 'src/report-subscription/schemas/report-subscription.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: ReportSubscription.name, schema: ReportSubscriptionSchema }]),
    CoinHistoryModule,
    NotificationModule,
  ],
  controllers: [],
  providers: [ReportSubscriptionService, ReportSubscriptionRepository],
  exports: [ReportSubscriptionService],
})
export class ReportSubscriptionModule {}
