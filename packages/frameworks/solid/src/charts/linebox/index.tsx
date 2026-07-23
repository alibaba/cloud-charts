import {
  createLineboxModel,
  type LineboxChartConfig,
  type LineboxSeries,
} from '@alicloud/cloud-charts-core';
import { createModelChart, type ModelChartProps } from '../createModelChart';

export type LineboxProps = ModelChartProps<LineboxSeries[], LineboxChartConfig>;
export const Linebox = createModelChart<LineboxSeries[], LineboxChartConfig>('Linebox', createLineboxModel);
