import { createTreemapModel, type TreemapChartConfig, type TreemapData } from '@alicloud/cloud-charts-core';
import { createModelChart, type ModelChartProps } from '../createModelChart';

export const Treemap = createModelChart<TreemapData[], TreemapChartConfig>('Treemap', createTreemapModel);
export type TreemapProps = ModelChartProps<TreemapData[], TreemapChartConfig>;
