import "dotenv/config";
import { CmcProviderService } from "./providers/cmc-provider.service.js";

async function main() {
  const cmcProvider = new CmcProviderService();
  const data = await cmcProvider.getCryptocurrencyListings();
  console.log(data);
}

main();
