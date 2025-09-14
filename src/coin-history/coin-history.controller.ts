import { Controller, Get } from '@nestjs/common';

@Controller({ version: '1', path: 'coin-history' })
export class CoinHistoryController {
  @Get()
  public findHistory(): { success: boolean } {
    return { success: true };
  }
}
