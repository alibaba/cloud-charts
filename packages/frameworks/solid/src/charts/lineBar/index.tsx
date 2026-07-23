import {
  createLineBarModel,
  type LineBarChartConfig,
  type LineBarSeries,
} from '@alicloud/cloud-charts-core';
import { createModelChart, type ModelChartProps } from '../createModelChart';

export type LineBarProps = ModelChartProps<LineBarSeries[], LineBarChartConfig>;
export const LineBar = createModelChart<LineBarSeries[], LineBarChartConfig>('LineBar', createLineBarModel);
