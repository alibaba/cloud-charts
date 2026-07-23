import {
  createRadarModel,
  type RadarChartConfig,
  type RadarSeries,
} from '@alicloud/cloud-charts-core';
import { createModelChart, type ModelChartProps } from '../createModelChart';

export type RadarProps = ModelChartProps<RadarSeries[], RadarChartConfig>;
export const Radar = createModelChart<RadarSeries[], RadarChartConfig>('Radar', createRadarModel);
