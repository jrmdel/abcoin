import { of } from 'rxjs';
import { ICmcListing } from 'src/providers/cmc/cmc-provider.interface';

const cmcListingFixture: ICmcListing = {
  id: 1,
  name: 'Bitcoin',
  symbol: 'BTC',
  quote: {
    USD: {
      last_updated: '2023-01-01T00:00:00.000Z',
      price: 50000,
      percent_change_1h: 0.5,
      percent_change_24h: 2,
      percent_change_7d: 5,
    },
  },
};

const cmcListingEthFixture: ICmcListing = {
  id: 1027,
  name: 'Ethereum',
  symbol: 'ETH',
  quote: {
    USD: {
      last_updated: '2023-01-01T00:00:00.000Z',
      price: 4000,
      percent_change_1h: -0.2,
      percent_change_24h: -1.5,
      percent_change_7d: 3.4,
    },
  },
};

export const cmcListingsFixture: ICmcListing[] = [cmcListingFixture, cmcListingEthFixture];

export const cmcListingsApiResponseFixture = of({
  status: 200,
  statusText: '',
  headers: {},
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  config: {} as any,
  data: {
    status: {
      timestamp: '2018-06-02T22:51:28.209Z',
      error_code: 0,
      error_message: '',
      elapsed: 10,
      credit_count: 1,
    },
    data: structuredClone(cmcListingsFixture),
  },
});
