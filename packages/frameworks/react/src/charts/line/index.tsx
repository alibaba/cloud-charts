import {
  createLineModel,
  type LineChartConfig,
  type LineSeries,
} from '@alicloud/cloud-charts-core';
import { createModelChart, type ModelChartProps } from '../createModelChart';

export const Line = createModelChart<LineSeries[], LineChartConfig>('Line', createLineModel, {
  markerType: 'hyphen',
});
export type LineProps = ModelChartProps<LineSeries[], LineChartConfig>;
