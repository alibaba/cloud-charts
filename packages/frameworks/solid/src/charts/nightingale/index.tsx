import {
  createNightingaleModel,
  type NightingaleChartConfig,
  type NightingaleSeries,
} from '@alicloud/cloud-charts-core';
import { createModelChart, type ModelChartProps } from '../createModelChart';

export type NightingaleProps = ModelChartProps<NightingaleSeries[], NightingaleChartConfig>;
export const Nightingale = createModelChart<NightingaleSeries[], NightingaleChartConfig>('Nightingale', createNightingaleModel);
