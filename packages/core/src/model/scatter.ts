import type { ChartDataRecord, ChartPrimitiveValue } from '../types/spec';

export interface ScatterSeries {
  name: string;
  /** [x, y] 或 [x, y, size]（带气泡尺寸） */
  data: Array<[ChartPrimitiveValue, ChartPrimitiveValue, ChartPrimitiveValue?]>;
  visible?: boolean;
}

export interface ScatterSpecConfig {
  legend?: Record<string, unknown> | boolean;
  tooltip?: Record<string, unknown> | boolean;
  xAxis?: Record<string, unknown> | false;
  yAxis?: Record<string, unknown> | false;
  /** 抖动散点（避免重叠） */
  jitter?: boolean;
  /** 显示数据点形状 */
  shape?: string;
}

/** size 可选；用 `ChartPrimitiveValue | undefined` 但允许 missing key */
export interface NormalizedScatterRecord {
  x: ChartPrimitiveValue;
  y: ChartPrimitiveValue;
  size?: ChartPrimitiveValue;
  type: string;
  [key: string]: ChartPrimitiveValue | undefined;
}

export function normalizeScatterData(seriesList: ScatterSeries[]): NormalizedScatterRecord[] {
  return seriesList.reduce<NormalizedScatterRecord[]>((records, series) => {
    series.data.forEach(([x, y, size]) => {
      const rec: NormalizedScatterRecord = { x, y, type: series.name };
      if (size !== undefined) rec.size = size;
      records.push(rec);
    });
    return records;
  }, []);
}
