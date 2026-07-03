export interface HexagonalChartConfig {
  dataType?: 'g2' | string;
  colors?: unknown;
  legend?: Record<string, unknown> | boolean;
  tooltip?: Record<string, unknown> | boolean;
  xAxis?: Record<string, unknown> | false;
  yAxis?: Record<string, unknown> | false;
  /** 分箱大小（六边形边长） */
  binSize?: number;
  customConfig?: Record<string, unknown>;
  [key: string]: unknown;
}

export function getHexagonalDefaultConfig(): HexagonalChartConfig {
  return {
    legend: { visible: true, position: 'bottom' },
    tooltip: true,
    xAxis: {},
    yAxis: {},
    binSize: 20,
  };
}
