import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, Min } from 'class-validator';
import { IThresholdSettingsDocument } from 'src/threshold-settings/threshold-settings.interface';

export class CreateThresholdDto implements IThresholdSettingsDocument {
  @ApiProperty({
    name: 'symbol',
    description: 'The symbol of the coin (e.g., BTC, ETH)',
    type: String,
    example: 'BTC',
  })
  @IsString()
  symbol: string;

  @ApiProperty({
    name: 'value',
    description: 'The threshold value for the coin',
    type: Number,
    example: 50000,
  })
  @IsNumber()
  @Min(0)
  value: number;
}
