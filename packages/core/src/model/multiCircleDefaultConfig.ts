export interface MultiCircleChartConfig {
  dataType?: 'g2' | string;
  colors?: unknown;
  legend?: Record<string, unknown> | boolean;
  tooltip?: Record<string, unknown> | boolean;
  /** 内圈半径 */
  innerRadius?: number;
  customConfig?: Record<string, unknown>;
  [key: string]: unknown;
}

export function getMultiCircleDefaultConfig(): MultiCircleChartConfig {
  return {
    legend: { visible: true, position: 'bottom' },
    tooltip: true,
    innerRadius: 0.6,
  };
}
