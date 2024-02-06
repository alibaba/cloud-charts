/** 数据结构 */
export enum DataStructure {
  // 常规数据结构（g2中通用)
  Common,
  // 树形结构
  Tree,
  // 原始数据结构（widgets中的数据结构，未转换为g2中的数据结构）
  Origin,
  // 图形结构
  Graph,
}

/** 数据结构检测,true表示正确，false表示错误 */
export function checkData(type: DataStructure, data: any) {
  if (type === DataStructure.Common) {
    return (
      !data || (Array.isArray(data) && data?.every((item: any) => (item.x || item.x === 0) && (item.y || item.y === 0)))
    );
  } else if (type === DataStructure.Tree) {
    return !data || !data.children || Array.isArray(data.children);
  } else if (type === DataStructure.Origin) {
    return !data || (Array.isArray(data) && data.every((item: any) => !item.data || Array.isArray(item.data)));
  } else {
    return !data || !data.nodes || Array.isArray(data.nodes);
  }
}

/** 根据数据结构类型与数据计算数据量 */
export function calcDataSize(type: DataStructure, data: any) {
  if (type === DataStructure.Common) {
    // x种类个数
    return Array.from(new Set(data?.map((item: any) => item.x)))?.length ?? 0;
  } else if (type === DataStructure.Tree) {
    // 层次遍历，取每层节点数的最大值
    if (!data || !data?.children?.length) {
      return 0;
    }

    let maxNum = 0;
    let queue: any[] = [data];
    while (queue.length) {
      const n = queue.length;
      maxNum = Math.max(maxNum, n);
      let newQueue: any[] = [];
      queue.forEach((node: any) => {
        if (node?.children?.length) {
          newQueue = [...newQueue, ...node?.children];
        }
      });
      queue = newQueue;
    }

    return maxNum;
  } else if (type === DataStructure.Origin) {
    // data数组长度中最大值
    return data?.length > 0 ? Math.max(...data?.map((item: any) => item?.data?.length ?? 0)) : 0;
  } else {
    // nodes数组长度
    // 图数据可能只是一个空对象，不一定有nodes字段，不加兜底会返回undefined导致数据异常和图形一起显示
    return data?.nodes?.length ?? 0;
  }
}
