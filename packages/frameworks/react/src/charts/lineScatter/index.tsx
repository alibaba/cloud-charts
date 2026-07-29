import { createLineScatterModel, type LineScatterChartConfig, type LineScatterSeries } from '@alicloud/cloud-charts-core';
import { createModelChart, type ModelChartProps } from '../createModelChart';

export const LineScatter = createModelChart<LineScatterSeries[], LineScatterChartConfig>('LineScatter', createLineScatterModel);
export type LineScatterProps = ModelChartProps<LineScatterSeries[], LineScatterChartConfig>;
