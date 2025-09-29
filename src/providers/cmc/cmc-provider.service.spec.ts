import { createMock } from '@golevelup/ts-jest';
import { HttpService } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { throwError } from 'rxjs';
import { CMC_LISTINGS_ENDPOINT, CMC_LISTINGS_PARAMS } from 'src/providers/cmc/cmc-provider.constants';
import { CmcProviderService } from 'src/providers/cmc/cmc-provider.service';
import { cmcListingsApiResponseFixture, cmcListingsFixture } from 'test/fixtures/providers.fixtures';

describe('CmcProviderService', () => {
  let service: CmcProviderService;
  let httpService: HttpService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        CmcProviderService,
        {
          provide: HttpService,
          useValue: createMock<HttpService>(),
        },
      ],
    }).compile();

    service = app.get<CmcProviderService>(CmcProviderService);
    httpService = app.get<HttpService>(HttpService);
  });

  describe('getCryptocurrencyListings', () => {
    it('should retrieve data from provider endpoint', async () => {
      jest.spyOn(httpService, 'get').mockReturnValueOnce(cmcListingsApiResponseFixture);

      const result = await service.getCryptocurrencyListings();

      expect(result).toEqual(cmcListingsFixture);
      expect(httpService.get).toHaveBeenCalledWith(CMC_LISTINGS_ENDPOINT, { params: CMC_LISTINGS_PARAMS });
    });

    it('should throw if call fails', async () => {
      const error = new Error('Network error');
      jest.spyOn(httpService, 'get').mockReturnValueOnce(throwError(() => error));

      const call = service.getCryptocurrencyListings();

      await expect(call).rejects.toThrow(error);
    });
  });
});
