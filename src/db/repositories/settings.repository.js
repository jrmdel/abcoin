import { dbConnector } from "../connector";

export class SettingsRepository {
  constructor() {
    const db = dbConnector.getDb();
    this.collection = db.collection("settings");
  }

  getSettings() {
    return this.collection.find({}, { limit: 100 }).toArray();
  }
}
