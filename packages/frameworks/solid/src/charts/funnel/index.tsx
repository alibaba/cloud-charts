import {
  createFunnelModel,
  type FunnelChartConfig,
  type FunnelSeries,
} from '@alicloud/cloud-charts-core';
import { createModelChart, type ModelChartProps } from '../createModelChart';

export type FunnelProps = ModelChartProps<FunnelSeries[], FunnelChartConfig>;
export const Funnel = createModelChart<FunnelSeries[], FunnelChartConfig>('Funnel', createFunnelModel);
