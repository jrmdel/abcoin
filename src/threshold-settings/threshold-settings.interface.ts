export interface IThresholdSettingsDocument {
  symbol: string;
  value: number;
}

export interface IThresholdSettings extends IThresholdSettingsDocument {
  _id: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IAggregatedThreshold {
  symbol: string;
  values: number[];
}

export enum EThresholdDirection {
  UPWARD = 'UPWARD',
  DOWNWARD = 'DOWNWARD',
}
export type ThresholdDirection = keyof typeof EThresholdDirection;

export interface IThresholdReached {
  symbol: string;
  threshold: number;
  direction: ThresholdDirection;
}
