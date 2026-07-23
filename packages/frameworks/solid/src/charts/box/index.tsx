import {
  createBoxModel,
  type BoxChartConfig,
  type BoxSeries,
} from '@alicloud/cloud-charts-core';
import { createModelChart, type ModelChartProps } from '../createModelChart';

export type BoxProps = ModelChartProps<BoxSeries[], BoxChartConfig>;
export const Box = createModelChart<BoxSeries[], BoxChartConfig>('Box', createBoxModel);
