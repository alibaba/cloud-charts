import { createHexagonalModel, type HexagonalChartConfig, type HexagonalSeries } from '@alicloud/cloud-charts-core';
import { createModelChart, type ModelChartProps } from '../createModelChart';

export const Hexagonal = createModelChart<HexagonalSeries[], HexagonalChartConfig>('Hexagonal', createHexagonalModel);
export type HexagonalProps = ModelChartProps<HexagonalSeries[], HexagonalChartConfig>;
