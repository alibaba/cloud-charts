import {
  createLineScatterModel,
  type LineScatterChartConfig,
  type LineScatterSeries,
} from '@alicloud/cloud-charts-core';
import { createModelChart, type ModelChartProps } from '../createModelChart';

export type LineScatterProps = ModelChartProps<LineScatterSeries[], LineScatterChartConfig>;
export const LineScatter = createModelChart<LineScatterSeries[], LineScatterChartConfig>('LineScatter', createLineScatterModel);
