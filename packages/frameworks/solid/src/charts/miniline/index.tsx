import {
  createMinilineModel,
  type MinilineChartConfig,
  type LineSeries,
} from '@alicloud/cloud-charts-core';
import { createModelChart, type ModelChartProps } from '../createModelChart';

export type MinilineProps = ModelChartProps<LineSeries[], MinilineChartConfig>;
export const Miniline = createModelChart<LineSeries[], MinilineChartConfig>('Miniline', createMinilineModel);
