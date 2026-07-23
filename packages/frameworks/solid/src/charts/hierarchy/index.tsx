import {
  createHierarchyModel,
  type HierarchyChartConfig,
  type HierarchyData,
} from '@alicloud/cloud-charts-core';
import { createModelChart, type ModelChartProps } from '../createModelChart';

export type HierarchyProps = ModelChartProps<HierarchyData, HierarchyChartConfig>;
export const Hierarchy = createModelChart<HierarchyData, HierarchyChartConfig>('Hierarchy', createHierarchyModel);
