import { createScatterModel, type ScatterChartConfig, type ScatterSeries } from '@alicloud/cloud-charts-core';
import { createModelChart, type ModelChartProps } from '../createModelChart';

export const Scatter = createModelChart<ScatterSeries[], ScatterChartConfig>('Scatter', createScatterModel);
export type ScatterProps = ModelChartProps<ScatterSeries[], ScatterChartConfig>;
