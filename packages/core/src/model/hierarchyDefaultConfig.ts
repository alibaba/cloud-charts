export interface HierarchyChartConfig {
  dataType?: 'g2' | string;
  colors?: unknown;
  legend?: Record<string, unknown> | boolean;
  tooltip?: Record<string, unknown> | boolean;
  /** 极坐标层次图（旭日图风格） */
  polar?: boolean;
  label?: boolean | Record<string, unknown>;
  customConfig?: Record<string, unknown>;
  [key: string]: unknown;
}

export function getHierarchyDefaultConfig(): HierarchyChartConfig {
  return {
    legend: false,
    tooltip: true,
    polar: false,
    label: true,
  };
}
