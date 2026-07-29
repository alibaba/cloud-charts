import {
  createPieModel,
  type PieChartConfig,
  type PieSeries,
} from '@alicloud/cloud-charts-core';
import { createModelChart, type ModelChartProps } from '../createModelChart';

export const Pie = createModelChart<PieSeries[], PieChartConfig>('Pie', createPieModel, {
  markerType: 'circle',
});
export type PieProps = ModelChartProps<PieSeries[], PieChartConfig>;
