import KeyvRedis from '@keyv/redis';
import { CacheModule } from '@nestjs/cache-manager';
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
import { ThresholdSettingsModule } from 'src/threshold-settings/threshold-settings.module';

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
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const host = configService.get<string>('REDIS_HOST');
        const port = configService.get<string>('REDIS_PORT');
        const password = configService.get<string>('REDIS_PASSWORD');
        return {
          stores: [new KeyvRedis(`redis://:${password}@${host}:${port}`)],
        };
      },
      inject: [ConfigService],
    }),
    ScheduleModule.forRoot(),
    NotificationModule,
    ProvidersModule,
    CoinHistoryModule,
    ReportSubscriptionModule,
    ThresholdSettingsModule,
    TasksModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
