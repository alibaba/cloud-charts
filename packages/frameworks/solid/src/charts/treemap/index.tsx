import {
  createTreemapModel,
  type TreemapChartConfig,
  type TreemapData,
} from '@alicloud/cloud-charts-core';
import { createModelChart, type ModelChartProps } from '../createModelChart';

export type TreemapProps = ModelChartProps<TreemapData, TreemapChartConfig>;
export const Treemap = createModelChart<TreemapData, TreemapChartConfig>('Treemap', createTreemapModel);
