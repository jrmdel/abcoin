import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CustomCacheModule } from 'src/cache/cache.module';
import { CoinHistoryController } from 'src/coin-history/coin-history.controller';
import { CoinHistoryRepository } from 'src/coin-history/coin-history.repository';
import { CoinHistoryService } from 'src/coin-history/coin-history.service';
import { CoinHistory, CoinHistorySchema } from 'src/coin-history/schemas/coin-history.schema';
import { NotificationModule } from 'src/notification/notification.module';
import { ProvidersModule } from 'src/providers/providers.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: CoinHistory.name, schema: CoinHistorySchema }]),
    ProvidersModule,
    NotificationModule,
    CustomCacheModule,
  ],
  controllers: [CoinHistoryController],
  providers: [CoinHistoryRepository, CoinHistoryService],
  exports: [CoinHistoryRepository, CoinHistoryService],
})
export class CoinHistoryModule {}
