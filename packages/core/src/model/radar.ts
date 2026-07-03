import type { ChartDataRecord, ChartPrimitiveValue } from '../types/spec';

export interface RadarSeries {
  name: string;
  /** [维度, 值] */
  data: Array<[ChartPrimitiveValue, ChartPrimitiveValue]>;
  visible?: boolean;
}

export interface RadarSpecConfig {
  legend?: Record<string, unknown> | boolean;
  tooltip?: Record<string, unknown> | boolean;
  area?: boolean;
}

export interface NormalizedRadarRecord extends ChartDataRecord {
  x: ChartPrimitiveValue;
  y: ChartPrimitiveValue;
  type: string;
}

export function normalizeRadarData(seriesList: RadarSeries[]): NormalizedRadarRecord[] {
  return seriesList.reduce<NormalizedRadarRecord[]>((records, series) => {
    const next = series.data.map(([x, y]) => ({ x, y, type: series.name }));
    records.push(...next);
    return records;
  }, []);
}
