export interface LineScatterChartConfig {
  dataType?: 'g2' | string;
  colors?: unknown;
  legend?: Record<string, unknown> | boolean;
  tooltip?: Record<string, unknown> | boolean;
  xAxis?: Record<string, unknown> | false;
  yAxis?: Array<Record<string, unknown>> | Record<string, unknown> | false;
  area?: boolean;
  lineLabel?: boolean | Record<string, unknown>;
  scatterLabel?: boolean | Record<string, unknown>;
  customConfig?: Record<string, unknown>;
  [key: string]: unknown;
}

export function getLineScatterDefaultConfig(): LineScatterChartConfig {
  return {
    legend: { visible: true, position: 'bottom' },
    tooltip: true,
    xAxis: {},
    yAxis: [{}, {}],
    area: false,
  };
}
