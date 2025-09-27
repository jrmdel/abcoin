import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  IAggregatedCoinLastListing,
  ICoinListing,
  ICoinListingPercentageChange,
  ICoinListingChangeReport,
  IAggregatedCoinLastNListings,
} from 'src/coin-history/coin-history.interface';
import { CoinHistory } from 'src/coin-history/schemas/coin-history.schema';

@Injectable()
export class CoinHistoryRepository {
  constructor(@InjectModel(CoinHistory.name) private readonly model: Model<CoinHistory>) {}

  public async saveListings(listings: ICoinListing[]): Promise<void> {
    if (!Array.isArray(listings) || listings.length === 0) {
      throw new Error('Listings should be a non-empty array');
    }

    const operations = listings.map((listing) => ({
      insertOne: {
        document: {
          date: new Date(),
          metadata: {
            symbol: listing.symbol,
            price: listing.price,
            updatedAt: listing.updatedAt,
          },
        },
      },
    }));

    try {
      await this.model.bulkWrite(operations);
    } catch (error) {
      console.error('Error saving listings to the database:', error);
      throw error;
    }
  }

  public async getHistoricalPrice(symbol: string, hours: number): Promise<number | null> {
    try {
      const sinceDate = new Date(Date.now() - hours * 60 * 60 * 1000);
      const result = await this.model
        .findOne({ 'metadata.symbol': symbol, date: { $gte: sinceDate } }, { 'metadata.price': 1, _id: 0 })
        .sort({ date: 1 })
        .lean()
        .exec();
      return result?.metadata.price || null;
    } catch (error) {
      console.error(`Error retrieving historical price for symbol ${symbol}:`, error);
      throw error;
    }
  }

  public async getDifferences(symbols: string[]): Promise<ICoinListingChangeReport[]> {
    try {
      const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
      const oneDayAgo = new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString();

      const oneWeekAgoListings = await this.model.aggregate<IAggregatedCoinLastListing>([
        {
          $match: { 'metadata.symbol': { $in: symbols }, date: { $gte: new Date(oneWeekAgo) } },
        },
        { $sort: { date: 1 } },
        {
          $group: { _id: '$metadata.symbol', price: { $first: '$metadata.price' } },
        },
      ]);

      const oneDayAgoListings = await this.model.aggregate<IAggregatedCoinLastListing>([
        {
          $match: { 'metadata.symbol': { $in: symbols }, date: { $gte: new Date(oneDayAgo) } },
        },
        { $sort: { date: 1 } },
        {
          $group: { _id: '$metadata.symbol', price: { $first: '$metadata.price' } },
        },
      ]);

      const lastListings = await this.getLastListings(symbols);

      const listingsMap: Record<string, ICoinListingPercentageChange> = {};
      lastListings.forEach((listing) => {
        listingsMap[listing._id] = {
          price: listing.price,
          percentChange24h: 0,
          percentChange7d: 0,
        };
      });
      oneDayAgoListings.forEach((listing) => {
        if (listingsMap[listing._id]) {
          const percentChange24h = ((listingsMap[listing._id].price - listing.price) / listing.price) * 100;
          listingsMap[listing._id].percentChange24h = percentChange24h;
        }
      });
      oneWeekAgoListings.forEach((listing) => {
        if (listingsMap[listing._id]) {
          const percentChange7d = ((listingsMap[listing._id].price - listing.price) / listing.price) * 100;
          listingsMap[listing._id].percentChange7d = percentChange7d;
        }
      });
      return Object.entries(listingsMap)
        .map(([symbol, data]) => ({ symbol, ...data }))
        .sort((a, b) => a.symbol.localeCompare(b.symbol));
    } catch (error) {
      console.error('Error retrieving the last listings:', error);
      throw error;
    }
  }

  public async getLastListings(symbols: string[]): Promise<IAggregatedCoinLastListing[]> {
    const oneHourAgo = new Date(Date.now() - 3600000);
    return await this.model.aggregate<IAggregatedCoinLastListing>([
      {
        $match: { 'metadata.symbol': { $in: symbols }, date: { $gte: oneHourAgo } },
      },
      { $sort: { date: -1 } },
      {
        $group: { _id: '$metadata.symbol', price: { $first: '$metadata.price' } },
      },
    ]);
  }

  public getLastNListings(symbols: string[], n: number): Promise<IAggregatedCoinLastNListings[]> | never[] {
    if (!symbols.length) {
      return [];
    }
    return this.model
      .aggregate<IAggregatedCoinLastNListings>([
        // Match only the relevant symbols
        { $match: { 'metadata.symbol': { $in: symbols } } },
        // Sort by symbol and date in descending order
        { $sort: { 'metadata.symbol': 1, date: -1 } },
        // Use a facet to process each symbol independently
        {
          $facet: symbols.reduce((facets, symbol) => {
            facets[symbol] = [
              { $match: { 'metadata.symbol': symbol } },
              { $sort: { date: -1 } },
              { $limit: n },
              { $project: { _id: 0, price: '$metadata.price' } },
            ];
            return facets;
          }, {}),
        },
        // Transform the facet results into the desired output format
        {
          $project: {
            results: {
              $map: {
                input: { $objectToArray: '$$ROOT' },
                as: 'facet',
                in: {
                  _id: '$$facet.k',
                  prices: { $map: { input: '$$facet.v', as: 'entry', in: '$$entry.price' } },
                },
              },
            },
          },
        },
        { $unwind: '$results' },
        { $replaceRoot: { newRoot: '$results' } },
      ])
      .exec();
  }
}
