import type { ChartPrimitiveValue } from '../types/spec';

/** Hierarchy 数据：单根树（partition / icicle-style 层次图） */
export interface HierarchyNode {
  name: string;
  value?: number;
  children?: HierarchyNode[];
  [key: string]: unknown;
}

export type HierarchyData = HierarchyNode;

export interface HierarchySpecConfig {
  legend?: Record<string, unknown> | boolean;
  tooltip?: Record<string, unknown> | boolean;
  polar?: boolean;
}

export interface NormalizedHierarchyRecord {
  name: ChartPrimitiveValue;
  value: ChartPrimitiveValue;
  path: string;
  depth: number;
  [key: string]: unknown;
}

/**
 * 把 Tree 摊平。G2 v5 'icicle' mark 自动 partition 适合层次相邻图。
 * 旧版用 @antv/data-set hierarchy.partition；G2 v5 内置 icicle/sunburst mark。
 */
export function normalizeHierarchyData(data: HierarchyData): NormalizedHierarchyRecord[] {
  if (!data) return [];
  const records: NormalizedHierarchyRecord[] = [];
  const walk = (node: HierarchyNode, path: string[], depth: number) => {
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
      (node.children as HierarchyNode[]).forEach((child) => walk(child, nextPath, depth + 1));
    }
  };
  walk(data, [], 0);
  return records;
}
