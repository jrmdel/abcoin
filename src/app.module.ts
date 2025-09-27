import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from 'src/app.controller';
import { CoinHistoryModule } from 'src/coin-history/coin-history.module';
import { NotificationModule } from 'src/notification/notification.module';
import { ProvidersModule } from 'src/providers/providers.module';
import { ReportSubscriptionModule } from 'src/report-subscription/report-subscription.module';
import { TasksModule } from 'src/tasks/tasks.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('DB_CONNECTION_STRING'),
      }),
      inject: [ConfigService],
    }),
    ScheduleModule.forRoot(),
    NotificationModule,
    ProvidersModule,
    CoinHistoryModule,
    ReportSubscriptionModule,
    TasksModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
