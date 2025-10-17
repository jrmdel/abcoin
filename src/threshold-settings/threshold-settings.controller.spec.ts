import { Test, TestingModule } from '@nestjs/testing';
import { createMock } from '@golevelup/ts-jest';
import { ThresholdSettingsController } from 'src/threshold-settings/threshold-settings.controller';
import { ThresholdSettingsService } from 'src/threshold-settings/threshold-settings.service';
import { thresholdBtcDocumentFixture } from 'test/fixtures/threshold.fixtures';

describe('ThresholdSettingsController', () => {
  let controller: ThresholdSettingsController;
  let service: ThresholdSettingsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ThresholdSettingsController],
      providers: [
        {
          provide: ThresholdSettingsService,
          useValue: createMock<ThresholdSettingsService>(),
        },
      ],
    }).compile();

    controller = module.get<ThresholdSettingsController>(ThresholdSettingsController);
    service = module.get<ThresholdSettingsService>(ThresholdSettingsService);
  });

  describe('createThreshold', () => {
    it('should call service.create with correct parameters', async () => {
      jest.spyOn(service, 'create').mockResolvedValueOnce(thresholdBtcDocumentFixture);

      const result = await controller.createThreshold({ symbol: 'BTC', value: 60000 });

      expect(result).toEqual(thresholdBtcDocumentFixture);
      expect(service.create).toHaveBeenCalledWith('BTC', 60000);
    });

    it('should throw an error if service.create fails', async () => {
      const error = new Error('Creation failed');
      jest.spyOn(service, 'create').mockRejectedValueOnce(error);

      const call = controller.createThreshold({ symbol: 'BTC', value: 60000 });

      await expect(call).rejects.toThrow(error);
    });
  });

  describe('listThresholds', () => {
    it('should call service.findByQuery with correct parameters', async () => {
      jest.spyOn(service, 'findByQuery').mockResolvedValueOnce([thresholdBtcDocumentFixture]);

      const result = await controller.listThresholds({ symbol: 'BTC' });

      expect(service.findByQuery).toHaveBeenCalledWith({ symbol: 'BTC' });
      expect(result).toEqual([thresholdBtcDocumentFixture]);
    });

    it('should throw an error if service.findByQuery fails', async () => {
      const error = new Error('Query failed');
      jest.spyOn(service, 'findByQuery').mockRejectedValueOnce(error);

      const call = controller.listThresholds({ symbol: 'BTC' });

      await expect(call).rejects.toThrow(error);
    });
  });

  describe('deleteThreshold', () => {
    it('should call service.deleteThreshold with correct id', async () => {
      jest.spyOn(service, 'deleteThreshold').mockResolvedValueOnce();

      await controller.deleteThreshold('id');

      expect(service.deleteThreshold).toHaveBeenCalledWith('id');
    });

    it('should throw an error if service.deleteThreshold fails', async () => {
      const error = new Error('Deletion failed');
      jest.spyOn(service, 'deleteThreshold').mockRejectedValueOnce(error);

      const call = controller.deleteThreshold('id');

      await expect(call).rejects.toThrow(error);
    });
  });

  describe('updateThreshold', () => {
    it('should call service.updateThreshold with correct parameters', async () => {
      jest.spyOn(service, 'updateThreshold').mockResolvedValueOnce(true);

      const result = await controller.updateThreshold('id', { value: 60000 });

      expect(result).toBe(true);
      expect(service.updateThreshold).toHaveBeenCalledWith('id', 60000);
    });

    it('should throw an error if service.updateThreshold fails', async () => {
      const error = new Error('Update failed');
      jest.spyOn(service, 'updateThreshold').mockRejectedValueOnce(error);

      const call = controller.updateThreshold('id', { value: 60000 });

      await expect(call).rejects.toThrow(error);
    });
  });
});
