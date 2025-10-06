import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { CoinHistoryRepository } from 'src/coin-history/coin-history.repository';
import { CoinHistoryService } from 'src/coin-history/coin-history.service';
import { NotificationService } from 'src/notification/notification.service';
import { CmcProviderService } from 'src/providers/cmc/cmc-provider.service';
import { extractAmountFromListing } from 'src/functions/crypto/crypto.tools';
import { cmcListingsFixture } from 'test/fixtures/providers.fixtures';
import { coinListingBtcFixture, coinListingEthFixture } from 'test/fixtures/coin.fixtures';
import { CacheService } from 'src/cache/cache.service';

jest.mock('src/functions/crypto/crypto.tools');
const extractAmountMock = extractAmountFromListing as jest.MockedFunction<typeof extractAmountFromListing>;

describe('CoinHistoryService', () => {
  let coinHistoryService: CoinHistoryService;
  let coinHistoryRepository: CoinHistoryRepository;
  let cmcProviderService: CmcProviderService;
  let notificationService: NotificationService;
  let cacheService: CacheService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        CoinHistoryService,
        {
          provide: CoinHistoryRepository,
          useValue: createMock<CoinHistoryRepository>(),
        },
        {
          provide: CmcProviderService,
          useValue: createMock<CmcProviderService>(),
        },
        {
          provide: NotificationService,
          useValue: createMock<NotificationService>(),
        },
        {
          provide: CacheService,
          useValue: createMock<CacheService>(),
        },
      ],
    }).compile();

    coinHistoryService = app.get<CoinHistoryService>(CoinHistoryService);
    coinHistoryRepository = app.get<CoinHistoryRepository>(CoinHistoryRepository);
    cmcProviderService = app.get<CmcProviderService>(CmcProviderService);
    notificationService = app.get<NotificationService>(NotificationService);
    cacheService = app.get<CacheService>(CacheService);
  });

  describe('saveCurrentListings', () => {
    it('should not throw if no listings are returned', async () => {
      jest.spyOn(cmcProviderService, 'getCryptocurrencyListings').mockResolvedValue([]);

      await coinHistoryService.saveCurrentListings();

      expect(coinHistoryRepository.saveListings).toHaveBeenCalledWith([]);
    });

    it('should process and save listings correctly', async () => {
      jest.spyOn(cmcProviderService, 'getCryptocurrencyListings').mockResolvedValueOnce(cmcListingsFixture);
      extractAmountMock.mockReturnValueOnce(coinListingBtcFixture).mockReturnValueOnce(coinListingEthFixture);

      const result = await coinHistoryService.saveCurrentListings();

      expect(result).toEqual([coinListingBtcFixture, coinListingEthFixture]);
      expect(extractAmountFromListing).toHaveBeenCalledTimes(2);
      expect(coinHistoryRepository.saveListings).toHaveBeenCalledWith([coinListingBtcFixture, coinListingEthFixture]);
    });
  });

  describe('cacheListings', () => {
    it('should cache all listings successfully', async () => {
      jest.spyOn(cacheService, 'set').mockResolvedValueOnce().mockResolvedValueOnce();

      await coinHistoryService.cacheListings([coinListingBtcFixture, coinListingEthFixture]);

      expect(cacheService.set).toHaveBeenCalledTimes(2);
      expect(cacheService.set).toHaveBeenCalledWith('BTC', 50000);
      expect(cacheService.set).toHaveBeenCalledWith('ETH', 4000);
    });

    it('should warn if caching fails for some listings', async () => {
      const consoleWarnSpy = jest.spyOn(console, 'warn');
      const error = new Error('Cache error');
      jest.spyOn(cacheService, 'set').mockResolvedValueOnce().mockRejectedValueOnce(error);

      await coinHistoryService.cacheListings([coinListingBtcFixture, coinListingEthFixture]);

      expect(cacheService.set).toHaveBeenCalledTimes(2);
      expect(consoleWarnSpy).toHaveBeenCalledTimes(1);
      expect(consoleWarnSpy).toHaveBeenCalledWith('Caching values failed for ETH', error);
    });
  });

  describe('generateLiveAlert', () => {
    it('should get listings and send notification', async () => {
      jest.spyOn(coinHistoryRepository, 'getLastListings').mockResolvedValueOnce([]);
      jest.spyOn(notificationService, 'sendLiveAlertNotificationIfNeeded').mockResolvedValueOnce();

      const result = await coinHistoryService.generateLiveAlert();

      expect(result).toBeUndefined();
    });

    it('should handle errors from notification service gracefully', async () => {
      const error = new Error('Notification error');
      const consoleErrorSpy = jest.spyOn(console, 'error');
      jest.spyOn(coinHistoryRepository, 'getLastListings').mockResolvedValueOnce([]);
      jest.spyOn(notificationService, 'sendLiveAlertNotificationIfNeeded').mockRejectedValueOnce(error);

      await coinHistoryService.generateLiveAlert();

      expect(consoleErrorSpy).toHaveBeenCalledWith('Error sending live alert notification:', error);
    });
  });
});
