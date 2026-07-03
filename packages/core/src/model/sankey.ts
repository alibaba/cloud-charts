/** Sankey 数据：nodes + edges 经典图结构 */
export interface SankeyNode extends Record<string, unknown> {
  name: string;
  value?: number;
}

export interface SankeyEdge extends Record<string, unknown> {
  source: string;
  target: string;
  value: number;
}

export interface SankeyData {
  nodes: SankeyNode[];
  links?: SankeyEdge[];
  edges?: SankeyEdge[];
}

export interface SankeySpecConfig {
  legend?: Record<string, unknown> | boolean;
  tooltip?: Record<string, unknown> | boolean;
}

export interface NormalizedSankeyRecord {
  source: string;
  target: string;
  value: number;
  type: string;
  [key: string]: unknown;
}

/**
 * 把 Sankey {nodes, links} 拆成扁平 edges 数组（G2 v5 sankey mark 需要的 data 形式）。
 * 旧版用 @antv/data-set/graph/sankey；G2 v5 内置 sankey mark + 自动计算节点位置。
 */
export function normalizeSankeyData(data: SankeyData | SankeyData[]): NormalizedSankeyRecord[] {
  // 兼容两种入参：单一对象 / 单元素数组
  const graph = Array.isArray(data) ? data[0] : data;
  if (!graph) return [];
  const edges = graph.links ?? graph.edges ?? [];
  return edges.map((edge) => ({
    source: String(edge.source),
    target: String(edge.target),
    value: Number(edge.value ?? 1),
    type: String(edge.source),
  }));
}
