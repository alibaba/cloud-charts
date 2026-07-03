export interface BarChartConfig {
  /** 旁路标记：'g2' 时跳过 highcharts→G2 数据转换，直接把 data 当作 G2 平铺数组使用。 */
  dataType?: 'g2' | string;
  /** 横向/纵向滚动条；boolean 启用默认配置，对象可定制 type/categorySize 等。 */
  scrollbar?:
    | boolean
    | {
        type?: 'horizontal' | 'vertical';
        categorySize?: number;
        ratio?: number;
        value?: number;
        [key: string]: unknown;
      };
  colors?: unknown;
  xAxis?: Record<string, unknown> | false;
  yAxis?: Record<string, unknown> | false;
  legend?: Record<string, unknown> | boolean;
  tooltip?: Record<string, unknown> | boolean;
  stack?: boolean;
  dodge?: boolean;
  percentage?: boolean;
  showStackSum?: boolean;
  grid?: boolean;
  zoom?: boolean;
  slider?: boolean | Record<string, unknown>;
  label?: boolean | Record<string, unknown>;
  guide?: Record<string, unknown>;
  marginRatio?: number;
  columnWidthRatio?: number;
  [key: string]: unknown;
}

/** Wbar 柱状图默认配置，对齐旧 src/Wbar/index.tsx 的 getDefaultConfig。 */
export function getBarDefaultConfig(): BarChartConfig {
  return {
    xAxis: {
      type: 'band',
      mask: 'auto',
    },
    yAxis: {
      labelFormatter: undefined,
      max: undefined,
      min: undefined,
    },
    legend: {
      visible: true,
      align: 'left',
      nameFormatter: undefined,
    },
    tooltip: {
      titleFormatter: undefined,
      nameFormatter: undefined,
      valueFormatter: undefined,
    },
    stack: false,
    dodge: true,
    percentage: false,
    grid: false,
    zoom: false,
    label: false,
  };
}
