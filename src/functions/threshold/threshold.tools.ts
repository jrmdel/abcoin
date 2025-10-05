import { IAggregatedCoinLastNListings } from 'src/coin-history/coin-history.interface';
import {
  EThresholdDirection,
  IAggregatedThreshold,
  IThresholdReached,
  ThresholdDirection,
} from 'src/threshold-settings/threshold-settings.interface';

export function computeHasThresholdReached(
  thresholdList: IAggregatedThreshold[],
  history: IAggregatedCoinLastNListings[],
): IThresholdReached[] {
  const result: IThresholdReached[] = [];
  for (const { symbol, values } of thresholdList) {
    const lastPrices = history.find((h) => h._id === symbol)?.prices;
    if (!lastPrices || !hasValidPrices(lastPrices)) {
      continue;
    }
    const thresholdsReached = valuesInRange(values, lastPrices);
    const direction = getDirectionFromRange(lastPrices);
    result.push(...thresholdsReached.map((v) => buildThresholdReachedObject(symbol, v, direction)));
  }
  return result;
}

function hasValidPrices(prices: (number | undefined)[]): prices is number[] {
  return prices.every((price) => typeof price === 'number');
}

export function valuesInRange(values: number[], range: number[]): number[] {
  return values.filter((v) => v >= Math.min(...range) && v <= Math.max(...range));
}

export function getDirectionFromRange(range: number[]): ThresholdDirection {
  return range[0] < range[1] ? EThresholdDirection.UPWARD : EThresholdDirection.DOWNWARD;
}

function buildThresholdReachedObject(
  symbol: string,
  threshold: number,
  direction: ThresholdDirection,
): IThresholdReached {
  return { symbol, threshold, direction };
}
