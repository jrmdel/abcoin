export interface ICmcListing {
  id: number;
  name: string; // ex: 'Bitcoin';
  symbol: string; // ex: 'BTC';
  quote: {
    USD: {
      price: number; // ex: 99888.77;
      percent_change_1h: number; // ex: -0.152774;
      percent_change_24h: number; // ex: 0.518894;
      percent_change_7d: number; // ex: 0.986573;
      last_updated: string; // ex: '2018-08-09T22:53:32.000Z';
    };
  };
}

export interface ICmcListingResponse {
  data: ICmcListing[];
  status: {
    timestamp: string; // ex: '2018-06-02T22:51:28.209Z';
    error_code: number; // ex: 0;
    error_message: string; // ex: '';
    elapsed: number; // ex: 10;
    credit_count: number; // ex: 1;
  };
}
