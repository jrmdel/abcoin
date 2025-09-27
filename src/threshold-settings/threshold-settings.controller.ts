import { Body, Controller, Delete, Param, Post } from '@nestjs/common';
import { CreateThresholdDto } from 'src/threshold-settings/threshold-settings.dto';
import { IThresholdSettings } from 'src/threshold-settings/threshold-settings.interface';
import { ThresholdSettingsService } from 'src/threshold-settings/threshold-settings.service';

@Controller({ version: '1', path: 'threshold' })
export class ThresholdSettingsController {
  constructor(private readonly thresholdService: ThresholdSettingsService) {}

  @Post()
  public createThreshold(@Body() body: CreateThresholdDto): Promise<IThresholdSettings> {
    const { symbol, value } = body;
    return this.thresholdService.create(symbol, value);
  }

  @Delete(':id')
  public deleteThreshold(@Param('id') id: string): Promise<void> {
    return this.thresholdService.deleteThreshold(id);
  }
}
