export interface NightingaleChartConfig {
  dataType?: 'g2' | string;
  colors?: unknown;
  legend?: Record<string, unknown> | boolean;
  tooltip?: Record<string, unknown> | boolean;
  cycle?: boolean;
  innerRadius?: number;
  /** 数据标签 */
  label?: boolean | Record<string, unknown>;
  customConfig?: Record<string, unknown>;
  [key: string]: unknown;
}

export function getNightingaleDefaultConfig(): NightingaleChartConfig {
  return {
    legend: { visible: true, position: 'bottom' },
    tooltip: true,
    cycle: false,
    label: false,
  };
}
