import { IThresholdSettings } from 'src/coin-history/coin-history.interface';

export const FOLLOWED_SYMBOLS = ['ADA', 'AVAX', 'BNB', 'BTC', 'ETH', 'SOL', 'XTZ'];

export const THRESHOLD_SETTINGS: IThresholdSettings[] = [
  { hours: 1, percentage: 3 },
  { hours: 12, percentage: 8 },
];
