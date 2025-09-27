import {
  computeHasThresholdReached,
  getDirectionFromRange,
  valuesInRange,
} from 'src/functions/threshold/threshold.tools';
import { aggregatedCoinLastTwoListings } from 'test/fixtures/coin.fixtures';
import { aggregatedThresholdsFixture, thresholdReachedFixture } from 'test/fixtures/threshold.fixtures';

describe('threshold.tools', () => {
  describe('computeHasThresholdReached', () => {
    it('should compute thresholds reached correctly', () => {
      const result = computeHasThresholdReached(aggregatedThresholdsFixture, aggregatedCoinLastTwoListings);

      expect(result).toEqual(thresholdReachedFixture);
    });

    it('should return an empty array if symbol not found in history', () => {
      const result = computeHasThresholdReached(aggregatedThresholdsFixture, []);

      expect(result).toEqual([]);
    });
  });

  describe('valuesInRange', () => {
    it('should return values within the specified ascending range', () => {
      const values = [10, 20, 30, 40, 50];
      const range = [30, 45];

      const result = valuesInRange(values, range);

      expect(result).toEqual([30, 40]);
    });

    it('should return values within the specified descending range', () => {
      const values = [10, 20, 30, 40, 50];
      const range = [45, 30];

      const result = valuesInRange(values, range);

      expect(result).toEqual([30, 40]);
    });

    it('should return an empty array if no values are within the range', () => {
      const values = [10, 20, 30];
      const range = [40, 50];

      const result = valuesInRange(values, range);

      expect(result).toEqual([]);
    });
  });

  describe('getDirectionFromRange', () => {
    it('should return UPWARD for an increasing range', () => {
      const range = [10, 20];

      const result = getDirectionFromRange(range);

      expect(result).toBe('UPWARD');
    });

    it('should return DOWNWARD for a decreasing range', () => {
      const range = [20, 10];

      const result = getDirectionFromRange(range);

      expect(result).toBe('DOWNWARD');
    });
  });
});
