import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { CacheService } from 'src/cache/cache.service';
import { CoinHistoryRepository } from 'src/coin-history/coin-history.repository';
import { NotificationService } from 'src/notification/notification.service';
import { ThresholdSettingsRepository } from 'src/threshold-settings/threshold-settings.repository';
import { ThresholdSettingsService } from 'src/threshold-settings/threshold-settings.service';
import { aggregatedCoinLastTwoListings, coinListingBtcFixture } from 'test/fixtures/coin.fixtures';
import {
  aggregatedThresholdsFixture,
  filterBtcThresholdFixture,
  thresholdBtcDocumentFixture,
  thresholdBtcDownwardReachedFixture,
  thresholdReachedFixture,
} from 'test/fixtures/threshold.fixtures';

describe('ThresholdSettingsService', () => {
  let service: ThresholdSettingsService;
  let repository: ThresholdSettingsRepository;
  let coinHistoryRepository: CoinHistoryRepository;
  let notificationService: NotificationService;
  let cacheService: CacheService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        ThresholdSettingsService,
        {
          provide: ThresholdSettingsRepository,
          useValue: createMock<ThresholdSettingsRepository>(),
        },
        {
          provide: CoinHistoryRepository,
          useValue: createMock<CoinHistoryRepository>(),
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

    service = app.get<ThresholdSettingsService>(ThresholdSettingsService);
    repository = app.get<ThresholdSettingsRepository>(ThresholdSettingsRepository);
    coinHistoryRepository = app.get<CoinHistoryRepository>(CoinHistoryRepository);
    notificationService = app.get<NotificationService>(NotificationService);
    cacheService = app.get<CacheService>(CacheService);
  });

  describe('create', () => {
    it('should call repository.create with correct parameters', async () => {
      jest.spyOn(repository, 'create').mockResolvedValueOnce(thresholdBtcDocumentFixture);

      const result = await service.create('BTC', 60000);

      expect(repository.create).toHaveBeenCalledWith('BTC', 60000);
      expect(result).toEqual(thresholdBtcDocumentFixture);
    });
  });

  describe('findByQuery', () => {
    it('should call repository.findByQuery with correct parameters', async () => {
      jest.spyOn(repository, 'findByQuery').mockResolvedValueOnce([thresholdBtcDocumentFixture]);

      const result = await service.findByQuery(filterBtcThresholdFixture);

      expect(repository.findByQuery).toHaveBeenCalledWith(filterBtcThresholdFixture);
      expect(result).toEqual([thresholdBtcDocumentFixture]);
    });
  });

  describe('deleteThreshold', () => {
    it('should call repository.delete with correct id', async () => {
      jest.spyOn(repository, 'delete').mockResolvedValueOnce();

      await service.deleteThreshold('threshold-id-123');

      expect(repository.delete).toHaveBeenCalledWith('threshold-id-123');
    });
  });

  describe('checkIfThresholdsHaveBeenReached', () => {
    it('should get last N listings from repository if no current listings are provided', async () => {
      jest.spyOn(repository, 'findAggregateThresholds').mockResolvedValueOnce(aggregatedThresholdsFixture);
      jest.spyOn(coinHistoryRepository, 'getLastNListings').mockResolvedValueOnce(aggregatedCoinLastTwoListings);

      const result = await service.checkIfThresholdsHaveBeenReached();

      expect(result).toEqual(aggregatedCoinLastTwoListings);
      expect(repository.findAggregateThresholds).toHaveBeenCalled();
      expect(coinHistoryRepository.getLastNListings).toHaveBeenCalledWith(['BTC', 'ETH'], 2);
      expect(cacheService.get).not.toHaveBeenCalled();
      expect(notificationService.sendThresholdNotificationIfNeeded).toHaveBeenCalledWith(thresholdReachedFixture);
    });

    it('should get price ranges using cache and current listings if provided', async () => {
      jest.spyOn(repository, 'findAggregateThresholds').mockResolvedValueOnce(aggregatedThresholdsFixture);
      jest.spyOn(cacheService, 'get').mockResolvedValueOnce(70000).mockResolvedValueOnce(1600);

      const result = await service.checkIfThresholdsHaveBeenReached([coinListingBtcFixture]);

      expect(result).toEqual([{ _id: 'BTC', prices: [70000, 50000] }]);
      expect(repository.findAggregateThresholds).toHaveBeenCalled();
      expect(coinHistoryRepository.getLastNListings).not.toHaveBeenCalled();
      expect(cacheService.get).toHaveBeenCalledWith('BTC');
      expect(notificationService.sendThresholdNotificationIfNeeded).toHaveBeenCalledWith([
        thresholdBtcDownwardReachedFixture,
      ]);
    });
  });
});
