export interface SunburstChartConfig {
  dataType?: 'g2' | string;
  colors?: unknown;
  legend?: Record<string, unknown> | boolean;
  tooltip?: Record<string, unknown> | boolean;
  cycle?: boolean;
  innerRadius?: number;
  customConfig?: Record<string, unknown>;
  [key: string]: unknown;
}

export function getSunburstDefaultConfig(): SunburstChartConfig {
  return {
    legend: { visible: true, position: 'bottom' },
    tooltip: true,
    cycle: false,
  };
}
