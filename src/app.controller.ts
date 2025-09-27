import { Controller, Get } from '@nestjs/common';

@Controller({ version: '1', path: '' })
export class AppController {
  @Get('health')
  public health(): { status: 'OK' } {
    return { status: 'OK' };
  }
}
