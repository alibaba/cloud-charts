export interface MinilineChartConfig {
  dataType?: 'g2' | string;
  colors?: unknown;
  /** 迷你图默认不显示 axis / legend / tooltip */
  xAxis?: Record<string, unknown> | false;
  yAxis?: Record<string, unknown> | false;
  legend?: Record<string, unknown> | boolean;
  tooltip?: Record<string, unknown> | boolean;
  area?: boolean;
  spline?: boolean;
  customConfig?: Record<string, unknown>;
  [key: string]: unknown;
}

export function getMinilineDefaultConfig(): MinilineChartConfig {
  return {
    xAxis: false,
    yAxis: false,
    legend: false,
    tooltip: false,
    area: false,
    spline: true,
  };
}
