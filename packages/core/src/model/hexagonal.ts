import type { ChartDataRecord, ChartPrimitiveValue } from '../types/spec';

/** 六边形分箱图数据：二维散点 [x, y] */
export interface HexagonalSeries {
  name: string;
  data: Array<[number, number]>;
  visible?: boolean;
}

export interface HexagonalSpecConfig {
  legend?: Record<string, unknown> | boolean;
  tooltip?: Record<string, unknown> | boolean;
  xAxis?: Record<string, unknown> | false;
  yAxis?: Record<string, unknown> | false;
}

export interface NormalizedHexagonalRecord extends ChartDataRecord {
  x: ChartPrimitiveValue;
  y: ChartPrimitiveValue;
  type: string;
}

export function normalizeHexagonalData(seriesList: HexagonalSeries[]): NormalizedHexagonalRecord[] {
  return seriesList.reduce<NormalizedHexagonalRecord[]>((records, series) => {
    series.data.forEach(([x, y]) => records.push({ x, y, type: series.name }));
    return records;
  }, []);
}
