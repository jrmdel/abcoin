import { Module } from '@nestjs/common';
import { CoinHistoryModule } from 'src/coin-history/coin-history.module';
import { ReportSubscriptionModule } from 'src/report-subscription/report-subscription.module';
import { TasksService } from 'src/tasks/tasks.service';

@Module({
  imports: [CoinHistoryModule, ReportSubscriptionModule],
  controllers: [],
  providers: [TasksService],
})
export class TasksModule {}
