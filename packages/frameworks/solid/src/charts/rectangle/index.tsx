import {
  createRectangleModel,
  type RectangleChartConfig,
  type RectangleSeries,
} from '@alicloud/cloud-charts-core';
import { createModelChart, type ModelChartProps } from '../createModelChart';

export type RectangleProps = ModelChartProps<RectangleSeries[], RectangleChartConfig>;
export const Rectangle = createModelChart<RectangleSeries[], RectangleChartConfig>('Rectangle', createRectangleModel);
