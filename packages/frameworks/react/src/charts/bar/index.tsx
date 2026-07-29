import {
  createBarModel,
  type BarChartConfig,
  type BarSeries,
} from '@alicloud/cloud-charts-core';
import { createModelChart, type ModelChartProps } from '../createModelChart';

export const Bar = createModelChart<BarSeries[], BarChartConfig>('Bar', createBarModel, {
  markerType: 'square',
});
export type BarProps = ModelChartProps<BarSeries[], BarChartConfig>;
