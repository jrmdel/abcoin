import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { CoinHistoryController } from 'src/coin-history/coin-history.controller';
import { CoinHistoryRepository } from 'src/coin-history/coin-history.repository';

describe('CoinHistoryController', () => {
  let coinHistoryController: CoinHistoryController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [CoinHistoryController],
      providers: [
        {
          provide: CoinHistoryRepository,
          useValue: createMock<CoinHistoryRepository>(),
        },
      ],
    }).compile();

    coinHistoryController = app.get<CoinHistoryController>(
      CoinHistoryController,
    );
  });

  describe('findHistory', () => {
    it('should return success true', () => {
      const result = coinHistoryController.findHistory();

      expect(result).toEqual({ success: true });
    });
  });
});
