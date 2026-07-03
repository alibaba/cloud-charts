import type { ChartDataRecord, ChartPrimitiveValue } from '../types/spec';

export interface NightingaleSeries {
  name: string;
  data: Array<[ChartPrimitiveValue, number]>;
  visible?: boolean;
}

export interface NightingaleSpecConfig {
  legend?: Record<string, unknown> | boolean;
  tooltip?: Record<string, unknown> | boolean;
  cycle?: boolean;
}

export interface NormalizedNightingaleRecord extends ChartDataRecord {
  x: ChartPrimitiveValue;
  y: ChartPrimitiveValue;
  type: string;
}

export function normalizeNightingaleData(seriesList: NightingaleSeries[]): NormalizedNightingaleRecord[] {
  return seriesList.reduce<NormalizedNightingaleRecord[]>((records, series) => {
    series.data.forEach(([x, y]) => records.push({ x, y, type: series.name }));
    return records;
  }, []);
}
