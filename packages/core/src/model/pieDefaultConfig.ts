export interface PieChartConfig {
  /** 旁路标记：'g2' 时跳过 highcharts→G2 数据转换，直接把 data 当作 G2 平铺数组使用。 */
  dataType?: 'g2' | string;
  colors?: unknown;
  legend?: Record<string, unknown> | boolean;
  tooltip?: Record<string, unknown> | boolean;
  autoSort?: boolean;
  cycle?: boolean;
  innerRadius?: number;
  outerRadius?: number;
  startAngle?: number;
  endAngle?: number;
  label?: boolean | Record<string, unknown>;
  filterNegativeNumbers?: boolean;
  [key: string]: unknown;
}

/** Wpie 饼图默认配置，对齐旧 src/Wpie/index.tsx 的 getDefaultConfig。 */
export function getPieDefaultConfig(): PieChartConfig {
  return {
    legend: {
      visible: true,
      position: 'right',
      align: '',
      showData: true,
      nameFormatter: undefined,
      valueFormatter: undefined,
    },
    tooltip: {
      nameFormatter: undefined,
      valueFormatter: undefined,
    },
    autoSort: true,
    cycle: false,
    innerRadius: 0.8,
    outerRadius: 0.8,
    label: false,
    filterNegativeNumbers: true,
  };
}
