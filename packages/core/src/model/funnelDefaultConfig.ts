export interface FunnelChartConfig {
  /** dataType='g2' 时跳过 highcharts→G2 数据转换 */
  dataType?: 'g2' | string;
  colors?: unknown;
  legend?: Record<string, unknown> | boolean;
  tooltip?: Record<string, unknown> | boolean;
  /** 漏斗形状：column（默认）/ pyramid */
  shape?: 'column' | 'pyramid';
  /** 数据标签 */
  label?: boolean | Record<string, unknown>;
  customConfig?: Record<string, unknown>;
  [key: string]: unknown;
}

export function getFunnelDefaultConfig(): FunnelChartConfig {
  return {
    legend: { visible: true, position: 'bottom' },
    tooltip: true,
    shape: 'column',
    label: true,
  };
}
