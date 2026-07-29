import { createRadarModel, type RadarChartConfig, type RadarSeries } from '@alicloud/cloud-charts-core';
import { createModelChart, type ModelChartProps } from '../createModelChart';

export const Radar = createModelChart<RadarSeries[], RadarChartConfig>('Radar', createRadarModel);
export type RadarProps = ModelChartProps<RadarSeries[], RadarChartConfig>;
