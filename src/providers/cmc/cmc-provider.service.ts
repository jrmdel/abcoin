import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { CMC_LISTINGS_ENDPOINT, CMC_LISTINGS_PARAMS } from 'src/providers/cmc/cmc-provider.constants';
import { ICmcListing, ICmcListingResponse } from 'src/providers/cmc/cmc-provider.interface';

@Injectable()
export class CmcProviderService {
  constructor(private readonly httpClient: HttpService) {}

  public async getCryptocurrencyListings(): Promise<ICmcListing[]> {
    try {
      const params = CMC_LISTINGS_PARAMS;
      const response = await lastValueFrom(this.httpClient.get<ICmcListingResponse>(CMC_LISTINGS_ENDPOINT, { params }));
      return response.data.data;
    } catch (error) {
      console.error('Error fetching cryptocurrency listings:', error);
      throw error;
    }
  }
}
