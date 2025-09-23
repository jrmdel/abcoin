import { ICoinListing } from 'src/coin-history/coin-history.interface';

export const coinListingBtcFixture: ICoinListing = {
  price: 50000,
  symbol: 'BTC',
  updatedAt: '2023-01-01T00:00:00.000Z',
};

export const coinListingEthFixture: ICoinListing = {
  price: 4000,
  symbol: 'ETH',
  updatedAt: '2023-01-01T00:00:00.000Z',
};
