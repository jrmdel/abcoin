import { IVariationSettings } from 'src/coin-history/coin-history.interface';

export const FOLLOWED_SYMBOLS = [
  'ADA',
  'ATOM',
  'AVAX',
  'BNB',
  'BTC',
  'ETH',
  'LINK',
  'LTC',
  'NEAR',
  'ONDO',
  'SOL',
  'XTZ',
];

export const VARIATION_SETTINGS: IVariationSettings[] = [
  { hours: 1, percentage: 3 },
  { hours: 12, percentage: 8 },
];
