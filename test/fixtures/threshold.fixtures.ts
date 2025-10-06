import {
  IAggregatedThreshold,
  IFilterThreshold,
  IThresholdReached,
  IThresholdSettings,
} from 'src/threshold-settings/threshold-settings.interface';

export const aggregatedThresholdsFixture: IAggregatedThreshold[] = [
  { symbol: 'BTC', values: [60000, 100000] },
  { symbol: 'ETH', values: [1000, 2500, 1500, 4000] },
];

export const thresholdReachedFixture: IThresholdReached[] = [
  { symbol: 'BTC', threshold: 60000, direction: 'UPWARD' },
  { symbol: 'ETH', threshold: 1000, direction: 'DOWNWARD' },
  { symbol: 'ETH', threshold: 1500, direction: 'DOWNWARD' },
];

export const thresholdBtcDownwardReachedFixture: IThresholdReached = {
  symbol: 'BTC',
  threshold: 60000,
  direction: 'DOWNWARD',
};

export const thresholdBtcDocumentFixture: IThresholdSettings = {
  _id: '1',
  symbol: 'BTC',
  value: 60000,
  createdAt: new Date('2023-01-01T00:00:00.000Z'),
  updatedAt: new Date('2023-01-01T00:00:00.000Z'),
};

export const filterBtcThresholdFixture: IFilterThreshold = {
  symbol: 'BTC',
};
