import { createSunburstModel, type SunburstChartConfig, type SunburstData } from '@alicloud/cloud-charts-core';
import { createModelChart, type ModelChartProps } from '../createModelChart';

export const Sunburst = createModelChart<SunburstData[], SunburstChartConfig>('Sunburst', createSunburstModel);
export type SunburstProps = ModelChartProps<SunburstData[], SunburstChartConfig>;
