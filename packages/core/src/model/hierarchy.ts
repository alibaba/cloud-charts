/** Hierarchy 数据：单根树（partition 层次图） */
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

export type NormalizedHierarchyRecord = HierarchyNode;

/**
 * G2 v5 'partition' mark 需要树结构（PartitionNode[]），内部自行 partition 布局，
 * 不接受预摊平的 path 记录。此处把单根树包装成数组 [root] 原样返回。
 * 旧版用 @antv/data-set hierarchy.partition + polygon geom。
 */
export function normalizeHierarchyData(data: HierarchyData): NormalizedHierarchyRecord[] {
  if (!data) return [];
  return [data];
}
