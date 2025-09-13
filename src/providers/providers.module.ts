import { Module } from '@nestjs/common';
import { CmcProviderModule } from 'src/providers/cmc/cmc-provider.module';

@Module({
  imports: [CmcProviderModule],
  exports: [CmcProviderModule],
})
export class ProvidersModule {}
