import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { ICmcListing, ICmcListingResponse } from 'src/providers/cmc/cmc-provider.interface';

@Injectable()
export class CmcProviderService {
  constructor(private readonly httpClient: HttpService) {}

  async getCryptocurrencyListings(): Promise<ICmcListing[]> {
    try {
      const params = { start: 1, limit: 20 };
      const response = await lastValueFrom(
        this.httpClient.get<ICmcListingResponse>('/cryptocurrency/listings/latest', { params }),
      );
      return response.data.data;
    } catch (error) {
      console.error('Error fetching cryptocurrency listings:', error);
      throw error;
    }
  }
}
