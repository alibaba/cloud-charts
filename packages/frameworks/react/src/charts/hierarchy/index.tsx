import { createHierarchyModel, type HierarchyChartConfig, type HierarchyData } from '@alicloud/cloud-charts-core';
import { createModelChart, type ModelChartProps } from '../createModelChart';

export const Hierarchy = createModelChart<HierarchyData[], HierarchyChartConfig>('Hierarchy', createHierarchyModel);
export type HierarchyProps = ModelChartProps<HierarchyData[], HierarchyChartConfig>;
