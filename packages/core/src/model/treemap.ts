import type { ChartPrimitiveValue } from '../types/spec';

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

export interface NormalizedTreemapRecord {
  name: ChartPrimitiveValue;
  value: ChartPrimitiveValue;
  path: string;
  depth: number;
  [key: string]: unknown;
}

/**
 * 把 Tree 摊平成 path 数组。G2 v5 'treemap' mark 自动 partition。
 * 旧版用 @antv/data-set hierarchy.treemap；G2 v5 内置 treemap mark。
 */
export function normalizeTreemapData(data: TreemapData): NormalizedTreemapRecord[] {
  if (!data) return [];
  const records: NormalizedTreemapRecord[] = [];
  const walk = (node: TreemapNode, path: string[], depth: number) => {
    const nextPath = [...path, node.name];
    const hasChildren = Array.isArray(node.children) && node.children.length > 0;
    if (!hasChildren) {
      records.push({
        name: node.name,
        value: typeof node.value === 'number' ? node.value : 1,
        path: nextPath.join('/'),
        depth,
      });
    } else {
      (node.children as TreemapNode[]).forEach((child) => walk(child, nextPath, depth + 1));
    }
  };
  walk(data, [], 0);
  return records;
}
