import { createLineboxModel, type LineboxChartConfig, type LineboxSeries } from '@alicloud/cloud-charts-core';
import { createModelChart, type ModelChartProps } from '../createModelChart';

export const Linebox = createModelChart<LineboxSeries[], LineboxChartConfig>('Linebox', createLineboxModel);
export type LineboxProps = ModelChartProps<LineboxSeries[], LineboxChartConfig>;
