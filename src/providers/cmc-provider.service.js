import axios from "axios";

export class CmcProviderService {
  httpClient;

  constructor() {
    const apiKey = process.env.CMC_API_KEY;
    if (!apiKey) {
      throw new Error("CMC API key is not set in environment variables");
    }
    this.httpClient = axios.create({
      baseURL: "https://pro-api.coinmarketcap.com/v1",
      headers: {
        "X-CMC_PRO_API_KEY": apiKey,
      },
    });
  }

  async getCryptocurrencyListings() {
    try {
      const response = await this.httpClient.get(
        "https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest",
        {
          params: {
            start: 1,
            limit: 100,
          },
        }
      );
      return response.data.data;
    } catch (error) {
      console.error("Error fetching cryptocurrency listings:", error);
      throw error;
    }
  }
}
