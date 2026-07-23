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

export type NormalizedSunburstRecord = SunburstNode;

/**
 * G2 v5 极坐标 'partition' mark 需要树结构（PartitionNode[]），内部自行 partition 布局，
 * 不接受预摊平的 path 记录。此处把单根树包装成数组 [root] 原样返回。
 * 旧版用 @antv/data-set hierarchy.partition + 极坐标 polygon geom。
 */
export function normalizeSunburstData(data: SunburstData): NormalizedSunburstRecord[] {
  if (!data) return [];
  return [data];
}
