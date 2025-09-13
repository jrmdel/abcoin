import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CmcProviderService } from 'src/providers/cmc/cmc-provider.service';

@Module({
  imports: [
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        baseURL: configService.get<string>('CMC_BASE_URL'),
        headers: {
          'X-CMC_PRO_API_KEY': configService.get<string>('CMC_API_KEY'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [CmcProviderService],
  exports: [CmcProviderService],
})
export class CmcProviderModule {}
