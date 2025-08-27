import { dbConnector } from "../connector.js";

export class ReportSubscriptionRepository {
  constructor() {
    const db = dbConnector.getDb();
    this.collection = db.collection("report_subscriptions");
  }

  getSubscriptions() {
    return this.collection.find({}, { limit: 100 }).toArray();
  }
}
