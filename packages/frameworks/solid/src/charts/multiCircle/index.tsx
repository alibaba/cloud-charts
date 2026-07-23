import {
  createMultiCircleModel,
  type MultiCircleChartConfig,
  type MultiCircleSeries,
} from '@alicloud/cloud-charts-core';
import { createModelChart, type ModelChartProps } from '../createModelChart';

export type MultiCircleProps = ModelChartProps<MultiCircleSeries[], MultiCircleChartConfig>;
export const MultiCircle = createModelChart<MultiCircleSeries[], MultiCircleChartConfig>('MultiCircle', createMultiCircleModel);
