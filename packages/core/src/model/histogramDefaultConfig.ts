export interface HistogramChartConfig {
  dataType?: 'g2' | string;
  colors?: unknown;
  legend?: Record<string, unknown> | boolean;
  tooltip?: Record<string, unknown> | boolean;
  xAxis?: Record<string, unknown> | false;
  yAxis?: Record<string, unknown> | false;
  /** 分箱配置 */
  bin?: { binWidth?: number; bins?: number; offset?: number };
  /** 百分比归一化 */
  percentage?: boolean;
  /** 极坐标直方图 */
  polar?: boolean;
  customConfig?: Record<string, unknown>;
  [key: string]: unknown;
}

export function getHistogramDefaultConfig(): HistogramChartConfig {
  return {
    legend: { visible: true, position: 'bottom' },
    tooltip: true,
    xAxis: {},
    yAxis: {},
    bin: { binWidth: 1 },
  };
}
