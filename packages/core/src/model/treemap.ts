/** Treemap 数据：单根树（与 RuleTreeNode 兼容） */
export interface TreemapNode {
  name: string;
  value?: number;
  children?: TreemapNode[];
  [key: string]: unknown;
}

export type TreemapData = TreemapNode;

export interface TreemapSpecConfig {
  legend?: Record<string, unknown> | boolean;
  tooltip?: Record<string, unknown> | boolean;
  polar?: boolean;
}

export type NormalizedTreemapRecord = TreemapNode;

/**
 * G2 v5 'treemap' composite mark 内部用 d3 hierarchy(data) 重建树并自做 layout，
 * 需要树对象（或带 id/parentId 的扁平数组），不接受预摊平的 path 记录。
 * 此处把单根树包装成数组 [root] 原样返回，模型层取 [0] 喂给 mark。
 * 旧版用 @antv/data-set hierarchy.treemap。
 */
export function normalizeTreemapData(data: TreemapData): NormalizedTreemapRecord[] {
  if (!data) return [];
  return [data];
}
