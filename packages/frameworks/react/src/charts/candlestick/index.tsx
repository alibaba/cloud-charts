import {
  createCandlestickModel,
  type CandlestickChartConfig,
  type CandlestickSeries,
} from '@alicloud/cloud-charts-core';
import { createModelChart, type ModelChartProps } from '../createModelChart';

export const Candlestick = createModelChart<CandlestickSeries[], CandlestickChartConfig>('Candlestick', createCandlestickModel);
export type CandlestickProps = ModelChartProps<CandlestickSeries[], CandlestickChartConfig>;
