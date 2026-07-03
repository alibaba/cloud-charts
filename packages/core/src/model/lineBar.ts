import type { ChartDataRecord, ChartPrimitiveValue } from '../types/spec';

/**
 * LineBar 系列：Origin 数据结构（包含 yAxis 索引指定柱/线），与 LineScatter / Linebox 一致。
 * yAxis=0 默认；type='bar' / 'line'。
 */
export interface LineBarSeries {
  name: string;
  /** [x, y] */
  data: Array<[ChartPrimitiveValue, ChartPrimitiveValue]>;
  /** 'bar' 或 'line'；缺省按系列顺序前一半 bar 后一半 line */
  geomType?: 'bar' | 'line';
  /** 挂到第几个 Y 轴（0 / 1） */
  yAxis?: 0 | 1;
  visible?: boolean;
}

export interface LineBarSpecConfig {
  legend?: Record<string, unknown> | boolean;
  tooltip?: Record<string, unknown> | boolean;
  xAxis?: Record<string, unknown> | false;
  yAxis?: Array<Record<string, unknown>> | Record<string, unknown> | false;
  stack?: boolean;
  area?: boolean;
}

export interface NormalizedLineBarRecord extends ChartDataRecord {
  x: ChartPrimitiveValue;
  y: ChartPrimitiveValue;
  type: string;
  geomType: 'bar' | 'line';
  yAxis: number;
}

export function normalizeLineBarData(seriesList: LineBarSeries[]): NormalizedLineBarRecord[] {
  return seriesList.reduce<NormalizedLineBarRecord[]>((records, series) => {
    const geomType = series.geomType ?? 'bar';
    const yAxis = series.yAxis ?? 0;
    const next = series.data.map(([x, y]) => ({
      x,
      y,
      type: series.name,
      geomType,
      yAxis,
    }));
    records.push(...next);
    return records;
  }, []);
}
