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
