import type { ChartDataRecord, ChartPrimitiveValue } from '../types/spec';

/**
 * 折线散点双坐标系图（Origin 数据结构）：
 * 每个 series 指定 geomType（line / scatter），可双 Y 轴。
 */
export interface LineScatterSeries {
  name: string;
  data: Array<[ChartPrimitiveValue, ChartPrimitiveValue]>;
  geomType?: 'line' | 'scatter';
  yAxis?: 0 | 1;
  visible?: boolean;
}

export interface LineScatterSpecConfig {
  legend?: Record<string, unknown> | boolean;
  tooltip?: Record<string, unknown> | boolean;
  xAxis?: Record<string, unknown> | false;
  yAxis?: Array<Record<string, unknown>> | Record<string, unknown> | false;
  area?: boolean;
}

export interface NormalizedLineScatterRecord extends ChartDataRecord {
  x: ChartPrimitiveValue;
  y: ChartPrimitiveValue;
  type: string;
  geomType: 'line' | 'scatter';
  yAxis: number;
}

export function normalizeLineScatterData(seriesList: LineScatterSeries[]): NormalizedLineScatterRecord[] {
  return seriesList.reduce<NormalizedLineScatterRecord[]>((records, series) => {
    const geomType = series.geomType ?? 'line';
    const yAxis = series.yAxis ?? 0;
    series.data.forEach(([x, y]) => records.push({ x, y, type: series.name, geomType, yAxis }));
    return records;
  }, []);
}
