import type { ChartDataRecord, ChartPrimitiveValue } from '../types/spec';

export interface BoxSeries {
  name: string;
  /** [x, low, q1, median, q3, high] 或 已规范化对象 */
  data: Array<[ChartPrimitiveValue, number, number, number, number, number]>;
  visible?: boolean;
}

export interface BoxSpecConfig {
  legend?: Record<string, unknown> | boolean;
  tooltip?: Record<string, unknown> | boolean;
  xAxis?: Record<string, unknown> | false;
  yAxis?: Record<string, unknown> | false;
  dodge?: boolean;
}

export interface NormalizedBoxRecord extends ChartDataRecord {
  x: ChartPrimitiveValue;
  /** 五分位数组：[low, q1, median, q3, high] —— G2 v5 box mark 要求 */
  y: ChartPrimitiveValue;
  type: string;
  [key: string]: ChartPrimitiveValue;
}

/** 旧版用 box mark + schema/box geom。G2 v5 用 type: 'box'，data y 字段是 [low, q1, median, q3, high] 数组。 */
export function normalizeBoxData(seriesList: BoxSeries[]): NormalizedBoxRecord[] {
  return seriesList.reduce<NormalizedBoxRecord[]>((records, series) => {
    series.data.forEach(([x, low, q1, median, q3, high]) => {
      records.push({
        x,
        // 序列化为 JSON 字符串以满足 ChartPrimitiveValue 约束；G2 v5 box mark
        // 会自动 parse y 数组（caller 也可显式传 y0/y1/y2/y3/y4 字段绕过限制）
        y: JSON.stringify([low, q1, median, q3, high]),
        type: series.name,
      });
    });
    return records;
  }, []);
}
