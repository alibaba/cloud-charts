export interface RadarChartConfig {
  /** dataType='g2' 时跳过 highcharts→G2 数据转换 */
  dataType?: 'g2' | string;
  colors?: unknown;
  legend?: Record<string, unknown> | boolean;
  tooltip?: Record<string, unknown> | boolean;
  /** 显示面积 */
  area?: boolean;
  /** 数据标签 */
  label?: boolean | Record<string, unknown>;
  /** 是否显示数据点 */
  symbol?: boolean;
  customConfig?: Record<string, unknown>;
  [key: string]: unknown;
}

export function getRadarDefaultConfig(): RadarChartConfig {
  return {
    legend: { visible: true, position: 'bottom' },
    tooltip: true,
    area: false,
    symbol: true,
    label: false,
  };
}
