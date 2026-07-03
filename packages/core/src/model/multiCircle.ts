import type { ChartDataRecord, ChartPrimitiveValue } from '../types/spec';

/** 多重圆环：每个 series 一个环，各自 value + name */
export interface MultiCircleSeries {
  name: string;
  value: number;
  /** 圆环颜色（可选，走 theme） */
  color?: string;
  /** 最大值（百分比环时需要） */
  max?: number;
}

export interface MultiCircleSpecConfig {
  legend?: Record<string, unknown> | boolean;
  tooltip?: Record<string, unknown> | boolean;
}

export interface NormalizedMultiCircleRecord extends ChartDataRecord {
  x: ChartPrimitiveValue;
  y: ChartPrimitiveValue;
  type: string;
}

export function normalizeMultiCircleData(seriesList: MultiCircleSeries[]): NormalizedMultiCircleRecord[] {
  return seriesList.map((series) => ({
    x: series.name,
    y: series.max ? series.value / series.max : series.value,
    type: series.name,
  }));
}
