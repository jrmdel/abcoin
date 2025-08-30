import { MongoClient } from 'mongodb';
import 'dotenv/config';

class DatabaseConnector {
  static #instance = null;
  #client = null;
  #db = null;

  constructor() {}

  static getInstance() {
    if (!DatabaseConnector.#instance) {
      DatabaseConnector.#instance = new DatabaseConnector();
    }
    return DatabaseConnector.#instance;
  }

  async connect() {
    try {
      const uri = process.env.DB_CONNECTION_STRING;

      if (!uri) {
        throw new Error('Database connection string is not defined in environment variables');
      }

      this.#client = new MongoClient(uri);
      await this.#client.connect();
      this.#db = this.#client.db(); // Uses the database specified in the connection string

      console.log(`[${new Date().toISOString()}] Successfully connected to MongoDB.`);
    } catch (error) {
      console.error('Error connecting to MongoDB:', error);
      throw error;
    }
  }

  getDb() {
    if (!this.#db) {
      throw new Error('Database not connected. Call connect() first.');
    }
    return this.#db;
  }

  async disconnect() {
    try {
      if (this.#client) {
        await this.#client.close();
        this.#client = null;
        this.#db = null;
        console.log(`[${new Date().toISOString()}] Successfully disconnected from MongoDB.`);
      }
    } catch (error) {
      console.error('Error disconnecting from MongoDB:', error);
      throw error;
    }
  }
}

// Export a singleton instance
export const dbConnector = DatabaseConnector.getInstance();
