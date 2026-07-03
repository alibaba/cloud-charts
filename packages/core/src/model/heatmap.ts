import type { ChartDataRecord, ChartPrimitiveValue } from '../types/spec';

export interface HeatmapSeries {
  name: string;
  /** [x, y, value] */
  data: Array<[ChartPrimitiveValue, ChartPrimitiveValue, number]>;
  visible?: boolean;
}

export interface HeatmapSpecConfig {
  legend?: Record<string, unknown> | boolean;
  tooltip?: Record<string, unknown> | boolean;
  xAxis?: Record<string, unknown> | false;
  yAxis?: Record<string, unknown> | false;
}

export interface NormalizedHeatmapRecord extends ChartDataRecord {
  x: ChartPrimitiveValue;
  y: ChartPrimitiveValue;
  value: ChartPrimitiveValue;
  type: string;
}

export function normalizeHeatmapData(seriesList: HeatmapSeries[]): NormalizedHeatmapRecord[] {
  return seriesList.reduce<NormalizedHeatmapRecord[]>((records, series) => {
    series.data.forEach(([x, y, value]) => {
      records.push({ x, y, value, type: series.name });
    });
    return records;
  }, []);
}
