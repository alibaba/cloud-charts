export interface LineChartConfig {
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
  areaColors?: unknown;
  xAxis?: Record<string, unknown> | false;
  yAxis?: Record<string, unknown> | Array<Record<string, unknown>> | false;
  legend?: Record<string, unknown> | boolean;
  tooltip?: Record<string, unknown> | boolean;
  area?: boolean;
  stack?: boolean;
  spline?: boolean;
  grid?: boolean;
  symbol?: boolean | Record<string, unknown>;
  zoom?: boolean;
  slider?: boolean | Record<string, unknown>;
  label?: boolean | Record<string, unknown>;
  step?: string | boolean | null;
  guide?: Record<string, unknown>;
  force?: boolean | Record<string, boolean>;
  lineWidth?: number;
  [key: string]: unknown;
}

/** Wline 折线图默认配置，复现旧 src/Wline/index.tsx 的 getDefaultConfig。 */
export function getLineDefaultConfig(): LineChartConfig {
  return {
    areaColors: [],
    xAxis: {
      type: 'time',
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
      lockable: false,
    },
    area: false,
    stack: false,
    spline: false,
    grid: false,
    symbol: false,
    zoom: false,
    label: false,
    step: null,
  };
}
