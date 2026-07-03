import type { ChartDataRecord, ChartPrimitiveValue } from '../types/spec';

/**
 * 折线箱型双坐标系图（Origin 数据结构）：
 * - line series：[x, y]
 * - box series：[x, low, q1, median, q3, high]
 */
export type LineboxLineData = Array<[ChartPrimitiveValue, ChartPrimitiveValue]>;
export type LineboxBoxData = Array<[ChartPrimitiveValue, number, number, number, number, number]>;

export interface LineboxSeries {
  name: string;
  data: LineboxLineData | LineboxBoxData;
  geomType?: 'line' | 'box';
  yAxis?: 0 | 1;
  visible?: boolean;
}

export interface LineboxSpecConfig {
  legend?: Record<string, unknown> | boolean;
  tooltip?: Record<string, unknown> | boolean;
  xAxis?: Record<string, unknown> | false;
  yAxis?: Array<Record<string, unknown>> | Record<string, unknown> | false;
}

export interface NormalizedLineboxRecord extends ChartDataRecord {
  x: ChartPrimitiveValue;
  /** line 时为单值；box 时为 JSON 字符串 [low,q1,median,q3,high] */
  y: ChartPrimitiveValue;
  type: string;
  geomType: 'line' | 'box';
  yAxis: number;
}

export function normalizeLineboxData(seriesList: LineboxSeries[]): NormalizedLineboxRecord[] {
  return seriesList.reduce<NormalizedLineboxRecord[]>((records, series) => {
    const geomType = series.geomType ?? 'line';
    const yAxis = series.yAxis ?? 0;
    if (geomType === 'box') {
      (series.data as LineboxBoxData).forEach(([x, low, q1, median, q3, high]) => {
        records.push({
          x,
          y: JSON.stringify([low, q1, median, q3, high]),
          type: series.name,
          geomType,
          yAxis,
        });
      });
    } else {
      (series.data as LineboxLineData).forEach(([x, y]) => {
        records.push({ x, y, type: series.name, geomType, yAxis });
      });
    }
    return records;
  }, []);
}
