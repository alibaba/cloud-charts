export interface TreemapChartConfig {
  dataType?: 'g2' | string;
  colors?: unknown;
  legend?: Record<string, unknown> | boolean;
  tooltip?: Record<string, unknown> | boolean;
  /** 极坐标 treemap */
  polar?: boolean;
  /** 数据标签 */
  label?: boolean | Record<string, unknown>;
  customConfig?: Record<string, unknown>;
  [key: string]: unknown;
}

export function getTreemapDefaultConfig(): TreemapChartConfig {
  return {
    legend: false,
    tooltip: true,
    polar: false,
    label: true,
  };
}
