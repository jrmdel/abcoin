import { dbConnector } from '../connector.js';

export class CoinHistoryRepository {
  constructor() {
    const db = dbConnector.getDb();
    this.collection = db.collection('coin_history');
  }

  async saveListings(listings) {
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
      const result = await this.collection.bulkWrite(operations);
      console.log(`Inserted ${result.insertedCount} documents.`);
    } catch (error) {
      console.error('Error saving listings to the database:', error);
      throw error;
    }
  }

  async getHistoricalPrice(symbol, hours) {
    try {
      const sinceDate = new Date(Date.now() - hours * 60 * 60 * 1000);
      const result = await this.collection.findOne(
        {
          'metadata.symbol': symbol,
          date: { $gte: sinceDate },
        },
        {
          sort: { date: 1 },
          projection: { 'metadata.price': 1, _id: 0 },
        }
      );
      return result?.metadata.price || null;
    } catch (error) {
      console.error(`Error retrieving historical price for symbol ${symbol}:`, error);
      throw error;
    }
  }

  async getLastListings(symbols) {
    try {
      const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
      const oneDayAgo = new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString();

      const oneWeekAgoListings = await this.collection
        .aggregate([
          { $match: { 'metadata.symbol': { $in: symbols }, date: { $gte: new Date(oneWeekAgo) } } },
          { $sort: { date: 1 } },
          { $group: { _id: '$metadata.symbol', price: { $first: '$metadata.price' } } },
        ])
        .toArray();

      const oneDayAgoListings = await this.collection
        .aggregate([
          { $match: { 'metadata.symbol': { $in: symbols }, date: { $gte: new Date(oneDayAgo) } } },
          { $sort: { date: 1 } },
          { $group: { _id: '$metadata.symbol', price: { $first: '$metadata.price' } } },
        ])
        .toArray();

      const lastListings = await this.collection
        .aggregate([
          { $match: { 'metadata.symbol': { $in: symbols }, date: { $gte: new Date(oneDayAgo) } } },
          { $sort: { date: -1 } },
          { $group: { _id: '$metadata.symbol', price: { $first: '$metadata.price' } } },
        ])
        .toArray();

      const listingsMap = {};
      lastListings.forEach((listing) => {
        listingsMap[listing._id] = { price: listing.price };
      });
      oneDayAgoListings.forEach((listing) => {
        if (listingsMap[listing._id]) {
          const percentChange24h =
            ((listingsMap[listing._id].price - listing.price) / listing.price) * 100;
          listingsMap[listing._id].percentChange24h = percentChange24h;
        }
      });
      oneWeekAgoListings.forEach((listing) => {
        if (listingsMap[listing._id]) {
          const percentChange7d =
            ((listingsMap[listing._id].price - listing.price) / listing.price) * 100;
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

  async getNPreviousListingsMeanPrice(n, symbol) {
    try {
      const pipeline = [
        { $match: { 'metadata.symbol': symbol } },
        { $sort: { date: -1 } },
        { $limit: n },
        {
          $group: {
            _id: '$metadata.symbol',
            averagePrice: { $avg: '$metadata.price' },
          },
        },
      ];
      const result = await this.collection.aggregate(pipeline).toArray();
      return result.length > 0 ? result[0].averagePrice : null;
    } catch (error) {
      console.error(`Error retrieving the last ${n} listings for symbol ${symbol}:`, error);
      throw error;
    }
  }
}
