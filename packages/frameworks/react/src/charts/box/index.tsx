import {
  createBoxModel,
  type BoxChartConfig,
  type BoxSeries,
} from '@alicloud/cloud-charts-core';
import { createModelChart, type ModelChartProps } from '../createModelChart';

export const Box = createModelChart<BoxSeries[], BoxChartConfig>('Box', createBoxModel);
export type BoxProps = ModelChartProps<BoxSeries[], BoxChartConfig>;
