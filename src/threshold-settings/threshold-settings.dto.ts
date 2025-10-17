import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { IFilterThreshold, IThresholdSettingsDocument } from 'src/threshold-settings/threshold-settings.interface';

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

export class FindThresholdDto implements IFilterThreshold {
  @ApiPropertyOptional({
    name: 'symbol',
    description: 'The symbol of the coin to filter by (e.g., BTC, ETH)',
    type: String,
    example: 'BTC',
  })
  @IsString()
  @IsOptional()
  symbol?: string;

  @ApiPropertyOptional({
    name: 'min',
    description: 'The minimum threshold value to filter by',
    type: Number,
    example: 1000,
  })
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  @IsOptional()
  min?: number;

  @ApiPropertyOptional({
    name: 'max',
    description: 'The maximum threshold value to filter by',
    type: Number,
    example: 50000,
  })
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  @IsOptional()
  max?: number;
}

export class PatchThresholdDto implements Pick<IThresholdSettingsDocument, 'value'> {
  @ApiProperty({
    name: 'value',
    description: 'The new threshold value for the coin',
    type: Number,
    example: 45000,
  })
  @IsNumber()
  @Min(0)
  value: number;
}
