export interface ICoinHistoryDocument {
  metadata: ICoinHistoryMetadataDocument;
  date: Date;
}

export interface ICoinHistoryMetadataDocument {
  symbol: string;
  price: number;
  updatedAt: Date;
}

export interface ICoinListing {
  symbol: string;
  price: number;
  updatedAt: string;
}

export interface IAggregatedCoinLastListing {
  _id: string;
  price: number;
}

export interface ICoinListingChange {
  symbol: string;
  price: number;
  oldPrice: number;
  hourPeriod: number;
}

export interface ICoinListingPercentageChange {
  price: number;
  percentChange24h: number;
  percentChange7d: number;
}

export interface ICoinListingChangeReport extends ICoinListingPercentageChange {
  symbol: string;
}

export interface IVariationSettings {
  hours: number;
  percentage: number;
}
