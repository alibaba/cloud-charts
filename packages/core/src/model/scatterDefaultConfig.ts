export interface ScatterChartConfig {
  /** dataType='g2' 时跳过 highcharts→G2 数据转换 */
  dataType?: 'g2' | string;
  colors?: unknown;
  legend?: Record<string, unknown> | boolean;
  tooltip?: Record<string, unknown> | boolean;
  xAxis?: Record<string, unknown> | false;
  yAxis?: Record<string, unknown> | false;
  /** 是否抖动散点（重叠时打散）。开启后跳过 appendPadding */
  jitter?: boolean;
  /** 显示数据点形状（圆 / 方等） */
  shape?: string;
  /** 数据标签 */
  label?: boolean | Record<string, unknown>;
  /** 显示数据点（默认 true） */
  symbol?: boolean;
  /** 客户自定义配置 */
  customConfig?: Record<string, unknown>;
  [key: string]: unknown;
}

export function getScatterDefaultConfig(): ScatterChartConfig {
  return {
    legend: { visible: true, position: 'bottom' },
    tooltip: true,
    label: false,
    symbol: true,
    jitter: false,
  };
}
