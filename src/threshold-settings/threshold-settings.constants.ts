import { PipelineStage } from 'mongoose';

export const AGGREGATED_THRESHOLD_PIPELINE: PipelineStage[] = [
  { $group: { _id: '$symbol', values: { $push: '$value' } } },
  { $project: { _id: 0, symbol: '$_id', values: 1 } },
  { $sort: { symbol: 1 } },
];
