export interface LineBarChartConfig {
  /** dataType='g2' 时跳过 highcharts→G2 数据转换 */
  dataType?: 'g2' | string;
  colors?: unknown;
  legend?: Record<string, unknown> | boolean;
  tooltip?: Record<string, unknown> | boolean;
  xAxis?: Record<string, unknown> | false;
  yAxis?: Array<Record<string, unknown>> | Record<string, unknown> | false;
  /** 柱状是否堆叠 */
  stack?: boolean;
  /** 折线是否显示面积 */
  area?: boolean;
  /** 分组堆叠柱状 */
  dodgeStack?: boolean;
  /** 折线/柱状数据标签 */
  lineLabel?: boolean | Record<string, unknown>;
  barLabel?: boolean | Record<string, unknown>;
  customConfig?: Record<string, unknown>;
  [key: string]: unknown;
}

export function getLineBarDefaultConfig(): LineBarChartConfig {
  return {
    legend: { visible: true, position: 'bottom' },
    tooltip: true,
    xAxis: {},
    yAxis: [{}, {}],
    stack: false,
    area: false,
  };
}
