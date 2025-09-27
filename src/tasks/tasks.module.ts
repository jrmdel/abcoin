import { Module } from '@nestjs/common';
import { CoinHistoryModule } from 'src/coin-history/coin-history.module';
import { ReportSubscriptionModule } from 'src/report-subscription/report-subscription.module';
import { TasksService } from 'src/tasks/tasks.service';
import { ThresholdSettingsModule } from 'src/threshold-settings/threshold-settings.module';

@Module({
  imports: [CoinHistoryModule, ReportSubscriptionModule, ThresholdSettingsModule],
  controllers: [],
  providers: [TasksService],
})
export class TasksModule {}
