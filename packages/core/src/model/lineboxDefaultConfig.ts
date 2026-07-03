export interface LineboxChartConfig {
  dataType?: 'g2' | string;
  colors?: unknown;
  legend?: Record<string, unknown> | boolean;
  tooltip?: Record<string, unknown> | boolean;
  xAxis?: Record<string, unknown> | false;
  yAxis?: Array<Record<string, unknown>> | Record<string, unknown> | false;
  customConfig?: Record<string, unknown>;
  [key: string]: unknown;
}

export function getLineboxDefaultConfig(): LineboxChartConfig {
  return {
    legend: { visible: true, position: 'bottom' },
    tooltip: true,
    xAxis: {},
    yAxis: [{}, {}],
  };
}
