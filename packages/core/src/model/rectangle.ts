import type { ChartDataRecord, ChartPrimitiveValue } from '../types/spec';

/** 矩形分箱图：[x, y, value]（密度/热力风格但用矩形 mark） */
export interface RectangleSeries {
  name: string;
  data: Array<[ChartPrimitiveValue, ChartPrimitiveValue, number]>;
  visible?: boolean;
}

export interface RectangleSpecConfig {
  legend?: Record<string, unknown> | boolean;
  tooltip?: Record<string, unknown> | boolean;
  xAxis?: Record<string, unknown> | false;
  yAxis?: Record<string, unknown> | false;
}

export interface NormalizedRectangleRecord extends ChartDataRecord {
  x: ChartPrimitiveValue;
  y: ChartPrimitiveValue;
  value: ChartPrimitiveValue;
  type: string;
}

export function normalizeRectangleData(seriesList: RectangleSeries[]): NormalizedRectangleRecord[] {
  return seriesList.reduce<NormalizedRectangleRecord[]>((records, series) => {
    series.data.forEach(([x, y, value]) => {
      records.push({ x, y, value, type: series.name });
    });
    return records;
  }, []);
}
