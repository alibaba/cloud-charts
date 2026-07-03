export interface CandlestickChartConfig {
  dataType?: 'g2' | string;
  /** 涨跌颜色：[rise, fall]，默认 ['#ef5350', '#26a69a'] */
  colors?: [string, string] | unknown;
  legend?: Record<string, unknown> | boolean;
  tooltip?: Record<string, unknown> | boolean;
  xAxis?: Record<string, unknown> | false;
  yAxis?: Record<string, unknown> | false;
  customConfig?: Record<string, unknown>;
  [key: string]: unknown;
}

export function getCandlestickDefaultConfig(): CandlestickChartConfig {
  return {
    legend: false,
    tooltip: true,
    xAxis: {},
    yAxis: {},
    colors: ['#ef5350', '#26a69a'],
  };
}
