import type { ChartDataRecord, ChartPrimitiveValue } from '../types/spec';

export interface HistogramSeries {
  name: string;
  /** 原始数值数组（待 binning），或已 binning 后的 [x, count] */
  data: number[] | Array<[ChartPrimitiveValue, number]>;
  visible?: boolean;
}

export interface HistogramSpecConfig {
  legend?: Record<string, unknown> | boolean;
  tooltip?: Record<string, unknown> | boolean;
  xAxis?: Record<string, unknown> | false;
  yAxis?: Record<string, unknown> | false;
  /** 分箱配置：{ binWidth?: number, bins?: number, offset?: number } */
  bin?: { binWidth?: number; bins?: number; offset?: number };
}

export interface NormalizedHistogramRecord extends ChartDataRecord {
  /** 原始数值（用于 G2 v5 binX transform 计算分箱）*/
  value: number;
  type: string;
}

export function normalizeHistogramData(seriesList: HistogramSeries[]): NormalizedHistogramRecord[] {
  return seriesList.reduce<NormalizedHistogramRecord[]>((records, series) => {
    series.data.forEach((item) => {
      // 原始数值数组：每项当作单个数值
      // 已 binned [x, count]：保留为 value=x，重复 count 次让 G2 binX 重新统计
      if (typeof item === 'number') {
        records.push({ value: item, type: series.name });
      } else if (Array.isArray(item)) {
        const [x, count] = item;
        const xNum = typeof x === 'number' ? x : Number(x);
        const repeats = Math.max(1, Math.floor(count));
        for (let i = 0; i < repeats; i++) {
          records.push({ value: xNum, type: series.name });
        }
      }
    });
    return records;
  }, []);
}
