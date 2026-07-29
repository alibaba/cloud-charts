import { createMultiCircleModel, type MultiCircleChartConfig, type MultiCircleSeries } from '@alicloud/cloud-charts-core';
import { createModelChart, type ModelChartProps } from '../createModelChart';

export const MultiCircle = createModelChart<MultiCircleSeries[], MultiCircleChartConfig>('MultiCircle', createMultiCircleModel);
export type MultiCircleProps = ModelChartProps<MultiCircleSeries[], MultiCircleChartConfig>;
