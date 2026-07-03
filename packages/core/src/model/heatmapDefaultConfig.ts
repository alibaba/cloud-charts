export interface HeatmapChartConfig {
  /** dataType='g2' 时跳过 highcharts→G2 数据转换 */
  dataType?: 'g2' | string;
  colors?: unknown;
  legend?: Record<string, unknown> | boolean;
  tooltip?: Record<string, unknown> | boolean;
  xAxis?: Record<string, unknown> | false;
  yAxis?: Record<string, unknown> | false;
  customConfig?: Record<string, unknown>;
  [key: string]: unknown;
}

export function getHeatmapDefaultConfig(): HeatmapChartConfig {
  return {
    legend: { visible: true, position: 'bottom' },
    tooltip: true,
    xAxis: {},
    yAxis: {},
  };
}
