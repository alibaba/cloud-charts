import { DataStructure, type RuleData, type RuleTreeNode, type RuleGraphData } from './types';

/** 根据数据结构类型与数据计算数据量，复现旧 rule/data.ts 的 calcDataSize。 */
export function calcDataSize(type: DataStructure, data: RuleData): number {
  if (!data) {
    return 0;
  }

  if (type === DataStructure.Common) {
    if (!Array.isArray(data)) return 0;
    const uniqueXValues = new Set(data.map((item) => item.x));
    return uniqueXValues.size;
  }

  if (type === DataStructure.Origin) {
    if (!Array.isArray(data) || data.length === 0) return 0;
    const nestedMax = Math.max(
      ...data.map((item) => {
        const inner = (item as { data?: unknown[] }).data;
        return Array.isArray(inner) ? inner.length : 0;
      }),
    );
    // 兼容新版 pipeline：normalize 后的数据已是扁平记录数组（无 .data 嵌套），
    // 此时回退到数组长度本身表示点数，避免被误判为空数据。
    if (nestedMax === 0) return data.length;
    return nestedMax;
  }

  if (type === DataStructure.Tree) {
    // 新版 pipeline 会先 normalizeData 再进 runRules，传入的是数组形态：
    //  - 相邻/旭日：[treeRoot]（单元素数组，元素含 children）
    //  - 矩阵树图：扁平 path 记录数组（元素无 children）
    // 兼容旧版直接传 tree root 对象的情况。
    let root = data as RuleTreeNode;
    if (Array.isArray(data)) {
      if (data.length === 0) return 0;
      const first = data[0] as RuleTreeNode | undefined;
      // 扁平记录数组（无 children）：以记录数表示数据量
      if (!first || !first.children || !first.children.length) return data.length;
      root = first;
    }
    // 层次遍历，取每层节点数的最大值（旧 src/rule/data.ts:33-53）
    if (!root.children || !root.children.length) return 0;
    let maxNum = 0;
    let queue: RuleTreeNode[] = [root];
    while (queue.length) {
      maxNum = Math.max(maxNum, queue.length);
      const next: RuleTreeNode[] = [];
      queue.forEach((node) => {
        if (node?.children?.length) next.push(...node.children);
      });
      queue = next;
    }
    return maxNum;
  }

  if (type === DataStructure.Graph) {
    // 图数据可能只是空对象不带 nodes 字段，需兜底
    const graph = data as RuleGraphData;
    if (Array.isArray(graph)) return 0;
    return graph?.nodes?.length ?? 0;
  }

  // 未识别类型：尽力返回数组长度，否则 0
  return Array.isArray(data) ? data.length : 0;
}

/** 根据数据量判断是否是空数据。 */
export function isEmptyData(dataSize: number): boolean {
  return dataSize === 0;
}
