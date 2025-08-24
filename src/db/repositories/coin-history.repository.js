export class CoinHistoryRepository {
  constructor(db) {
    this.collection = db.collection("coin_history");
  }

  async saveListings(listings) {
    if (!Array.isArray(listings) || listings.length === 0) {
      throw new Error("Listings should be a non-empty array");
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
      console.error("Error saving listings to the database:", error);
      throw error;
    }
  }

  async getNPreviousListingsMeanPrice(n, symbol) {
    try {
      const pipeline = [
        { $match: { "metadata.symbol": symbol } },
        { $sort: { date: -1 } },
        { $limit: n },
        {
          $group: {
            _id: "$metadata.symbol",
            averagePrice: { $avg: "$metadata.price" },
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
