import {
  createSunburstModel,
  type SunburstChartConfig,
  type SunburstData,
} from '@alicloud/cloud-charts-core';
import { createModelChart, type ModelChartProps } from '../createModelChart';

export type SunburstProps = ModelChartProps<SunburstData, SunburstChartConfig>;
export const Sunburst = createModelChart<SunburstData, SunburstChartConfig>('Sunburst', createSunburstModel);
