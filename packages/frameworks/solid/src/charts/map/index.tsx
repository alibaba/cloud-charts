import {
  createMapModel,
  type MapChartConfig,
  type MapSeries,
} from '@alicloud/cloud-charts-core';
import { createModelChart, type ModelChartProps } from '../createModelChart';

export type MapProps = ModelChartProps<MapSeries[], MapChartConfig>;
export const Map = createModelChart<MapSeries[], MapChartConfig>('Map', createMapModel);
