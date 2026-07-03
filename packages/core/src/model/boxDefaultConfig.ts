export interface BoxChartConfig {
  /** dataType='g2' 时跳过 highcharts→G2 数据转换 */
  dataType?: 'g2' | string;
  colors?: unknown;
  legend?: Record<string, unknown> | boolean;
  tooltip?: Record<string, unknown> | boolean;
  xAxis?: Record<string, unknown> | false;
  yAxis?: Record<string, unknown> | false;
  /** 是否分组（多系列时并排）*/
  dodge?: boolean;
  /** 显示网格线 */
  grid?: boolean;
  customConfig?: Record<string, unknown>;
  [key: string]: unknown;
}

export function getBoxDefaultConfig(): BoxChartConfig {
  return {
    legend: { visible: true, position: 'bottom' },
    tooltip: true,
    xAxis: {},
    yAxis: {},
    dodge: true,
  };
}
