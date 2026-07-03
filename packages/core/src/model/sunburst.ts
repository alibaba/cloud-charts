import type { ChartPrimitiveValue } from '../types/spec';

/** Sunburst 数据：单根树（与 RuleTreeNode 兼容）*/
export interface SunburstNode {
  name: string;
  value?: number;
  children?: SunburstNode[];
  [key: string]: unknown;
}

export type SunburstData = SunburstNode;

export interface SunburstSpecConfig {
  legend?: Record<string, unknown> | boolean;
  tooltip?: Record<string, unknown> | boolean;
  /** 是否环形（中心镂空）*/
  cycle?: boolean;
  /** 内圈半径占比（0-1），cycle 时有效 */
  innerRadius?: number;
}

export interface NormalizedSunburstRecord {
  name: ChartPrimitiveValue;
  value: ChartPrimitiveValue;
  /** path string：A/B/C 表示根→A→B→C */
  path: string;
  depth: number;
  [key: string]: unknown;
}

/**
 * 把 Tree 摊平成 path 数组（G2 v5 sunburst mark 需要 path 形式）。
 * 旧版用 @antv/data-set hierarchy.partition；G2 v5 内置 sunburst mark + partition transform。
 */
export function normalizeSunburstData(data: SunburstData): NormalizedSunburstRecord[] {
  if (!data) return [];
  const records: NormalizedSunburstRecord[] = [];
  const walk = (node: SunburstNode, path: string[], depth: number) => {
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
      (node.children as SunburstNode[]).forEach((child) => walk(child, nextPath, depth + 1));
    }
  };
  walk(data, [], 0);
  return records;
}
