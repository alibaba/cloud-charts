import { createHistogramModel, type HistogramChartConfig, type HistogramSeries } from '@alicloud/cloud-charts-core';
import { createModelChart, type ModelChartProps } from '../createModelChart';

export const Histogram = createModelChart<HistogramSeries[], HistogramChartConfig>('Histogram', createHistogramModel);
export type HistogramProps = ModelChartProps<HistogramSeries[], HistogramChartConfig>;
