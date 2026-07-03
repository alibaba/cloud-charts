import type { ChartDataRecord, ChartPrimitiveValue } from '../types/spec';

export interface FunnelSeries {
  name: string;
  data: Array<[ChartPrimitiveValue, ChartPrimitiveValue]>;
  visible?: boolean;
}

export interface FunnelSpecConfig {
  legend?: Record<string, unknown> | boolean;
  tooltip?: Record<string, unknown> | boolean;
  /** 'column' 漏斗（默认） / 'pyramid' 金字塔 */
  shape?: 'column' | 'pyramid';
}

export interface NormalizedFunnelRecord extends ChartDataRecord {
  x: ChartPrimitiveValue;
  y: ChartPrimitiveValue;
  type: string;
}

export function normalizeFunnelData(seriesList: FunnelSeries[]): NormalizedFunnelRecord[] {
  return seriesList.reduce<NormalizedFunnelRecord[]>((records, series) => {
    const next = series.data.map(([x, y]) => ({ x, y, type: series.name }));
    records.push(...next);
    return records;
  }, []);
}
