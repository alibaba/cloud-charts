import { createSankeyModel, type SankeyChartConfig, type SankeyData } from '@alicloud/cloud-charts-core';
import { createModelChart, type ModelChartProps } from '../createModelChart';

export const Sankey = createModelChart<SankeyData[], SankeyChartConfig>('Sankey', createSankeyModel);
export type SankeyProps = ModelChartProps<SankeyData[], SankeyChartConfig>;
