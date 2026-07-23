import {
  createHistogramModel,
  type HistogramChartConfig,
  type HistogramSeries,
} from '@alicloud/cloud-charts-core';
import { createModelChart, type ModelChartProps } from '../createModelChart';

export type HistogramProps = ModelChartProps<HistogramSeries[], HistogramChartConfig>;
export const Histogram = createModelChart<HistogramSeries[], HistogramChartConfig>('Histogram', createHistogramModel);
