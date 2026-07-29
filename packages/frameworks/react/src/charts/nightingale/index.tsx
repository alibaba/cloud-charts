import { createNightingaleModel, type NightingaleChartConfig, type NightingaleSeries } from '@alicloud/cloud-charts-core';
import { createModelChart, type ModelChartProps } from '../createModelChart';

export const Nightingale = createModelChart<NightingaleSeries[], NightingaleChartConfig>('Nightingale', createNightingaleModel);
export type NightingaleProps = ModelChartProps<NightingaleSeries[], NightingaleChartConfig>;
