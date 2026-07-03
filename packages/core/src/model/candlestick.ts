import type { ChartDataRecord, ChartPrimitiveValue } from '../types/spec';

/** K 线图数据：[x, open, close, low, high]（G2 v5 标准 OHLC 排序）*/
export interface CandlestickSeries {
  name: string;
  data: Array<[ChartPrimitiveValue, number, number, number, number]>;
  visible?: boolean;
}

export interface CandlestickSpecConfig {
  legend?: Record<string, unknown> | boolean;
  tooltip?: Record<string, unknown> | boolean;
  xAxis?: Record<string, unknown> | false;
  yAxis?: Record<string, unknown> | false;
}

export interface NormalizedCandlestickRecord extends ChartDataRecord {
  x: ChartPrimitiveValue;
  open: ChartPrimitiveValue;
  close: ChartPrimitiveValue;
  low: ChartPrimitiveValue;
  high: ChartPrimitiveValue;
  type: string;
}

export function normalizeCandlestickData(seriesList: CandlestickSeries[]): NormalizedCandlestickRecord[] {
  return seriesList.reduce<NormalizedCandlestickRecord[]>((records, series) => {
    series.data.forEach(([x, open, close, low, high]) => {
      records.push({ x, open, close, low, high, type: series.name });
    });
    return records;
  }, []);
}
