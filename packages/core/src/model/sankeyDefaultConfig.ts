export interface SankeyChartConfig {
  dataType?: 'g2' | string;
  colors?: unknown;
  legend?: Record<string, unknown> | boolean;
  tooltip?: Record<string, unknown> | boolean;
  /** 节点对齐方式：'left' | 'right' | 'center' | 'justify' */
  nodeAlign?: 'left' | 'right' | 'center' | 'justify';
  /** 节点宽度（占总宽比例 0-1） */
  nodeWidth?: number;
  /** 节点间垂直间距 */
  nodePadding?: number;
  customConfig?: Record<string, unknown>;
  [key: string]: unknown;
}

export function getSankeyDefaultConfig(): SankeyChartConfig {
  return {
    legend: false,
    tooltip: true,
    nodeAlign: 'justify',
    nodeWidth: 0.005,
    nodePadding: 0.03,
  };
}
