import { createHeatmapModel, type HeatmapChartConfig, type HeatmapSeries } from '@alicloud/cloud-charts-core';
import { createModelChart, type ModelChartProps } from '../createModelChart';

export const Heatmap = createModelChart<HeatmapSeries[], HeatmapChartConfig>('Heatmap', createHeatmapModel);
export type HeatmapProps = ModelChartProps<HeatmapSeries[], HeatmapChartConfig>;
