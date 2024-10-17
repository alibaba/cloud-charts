import { View as DataView } from '@antv/data-set/lib/view';
import { DataSet } from '@antv/data-set/lib/data-set';
import '@antv/data-set/lib/api/hierarchy';
import '@antv/data-set/lib/connector/hierarchy';
import * as d3Hierarchy from 'd3-hierarchy';
import { Types } from '../types';
import themes from '../../themes/index';
import { calcLinearColor, isInvalidNumber } from '../common';

/** export 一些字段常量 */
/** 在同层级，同一父节点下的节点索引顺序 */
export const NODE_INDEX_FIELD = 'nodeIndex';
/** child 节点数量 */
export const CHILD_NODE_COUNT = 'childNodeCount';
/** 节点的祖先节点 */
export const NODE_ANCESTORS_FIELD = 'nodeAncestor';

// G2 partition不支持排序，自定义层次布局
DataSet.registerTransform('d3-hierarchy.partition', (dataView: DataView, options: any) => {
  const { autoSort, reverse, size } = options;
  const newRoot = dataView.root;
  const partitionLayout = d3Hierarchy.partition();

  newRoot.sum((d: any) => {
    // 计算总数的时候只算子节点的大小
    if (d.children) {
      return 0;
    }
    return d.value;
  });

  if (autoSort) {
    newRoot.sort((a: any, b: any) => {
      if (reverse) return a.value - b.value;
      return b.value - a.value;
    });
  }

  partitionLayout.size(size);
  // .padding(0.1)
  partitionLayout(newRoot);

  newRoot.each((node: any) => {
    node['x'] = [node.x0, node.x1, node.x1, node.x0];
    node['y'] = [node.y1, node.y1, node.y0, node.y0];
    ['x0', 'x1', 'y0', 'y1'].forEach((prop) => {
      if (['x', 'y'].indexOf(prop) === -1) {
        delete node[prop];
      }
    });
  });
});

function getAllNodes(root: any) {
  const nodes: any[] = [];
  if (root && root.each) {
    // d3-hierarchy
    root.each((node: any) => {
      nodes.push(node);
    });
  } else if (root && root.eachNode) {
    // @antv/hierarchy
    root.eachNode((node: any) => {
      nodes.push(node);
    });
  }
  return nodes;
}

export function computeData(data: any, config?: any, ctx?: any) {
  let dv = null;
  if (ctx?.dataView) {
    dv = ctx.dataView;
    dv.source(data, {
      type: 'hierarchy',
    });
  } else {
    dv = new DataView();
    if (ctx) {      
      ctx.dataView = dv;
    }

    dv.source(data, {
      type: 'hierarchy',
    }).transform({
      type: 'd3-hierarchy.partition',
      autoSort: config?.autoSort ?? true,
      reverse: !!config?.reverse,
      size: [1, 1],
    });
  }

  const source: Types.Data = transformNodes(getAllNodes(dv.root));

  // source.forEach((node: any) => {
  //   let path = node.name;
  //   let ancestorNode = { ...node };
    
  //   // 当前节点的祖先节点为其所有父节点的最后一项
  //   const parentNode = node.parent[node.parent.length - 1];
  
  //   while (ancestorNode.depth > 1) {
  //     path = `${ancestorNode.parent.data?.name} / ${path}`;
  //     ancestorNode = ancestorNode.parent;
  //   }
  // });
  // 挂载转换后的数据
  if (ctx) {
    ctx.data = source;
  }

  return {
    source,
    total: dv?.root?.value ?? 0,
  };
}

function getParentList(node: Types.LooseObject, target: Types.LooseObject[] = []): Types.LooseObject[] {
  const parentNode = node.parent;
  // 需要存储根节点，所以一直到 parentNode===null（此时在根节点上）
  if (!parentNode) {
    return target;
  }

  target.unshift({
    name: parentNode.data.name,
    value: parentNode.value,
    rawValue: parentNode.data.value,
    depth: parentNode.depth,
    color: parentNode.color ?? undefined, // root没有颜色
    children: parentNode.children,
  });

  return getParentList(parentNode, target);
}

export function transformNodes(nodes: any) {
  const source: Types.Data = [];

  nodes?.forEach((node: any) => {
    let color = node?.color ?? node?.data?.color ?? node?.data?.data?.color;
    const parentNodeList = getParentList(node);
    // 因为父节点是向上找的，所以当前节点的直接父节点是数组的最后一个
    const parentNode = parentNodeList[parentNodeList.length - 1];

    if (node.depth === 0) {
      // 父节点不展示
      return;
    }

    if (!color) {
      const subNodeIdx = parentNode?.children?.findIndex((subNode: any) => subNode.data.name === node.data.name);

      if (node.depth === 1) {
        if (node?.data?.empty) {
          node.color = themes['widgets-color-layout-background'];
          color = themes['widgets-color-layout-background']
        } else {
          node.color = themes.category_20[subNodeIdx % 20];
          color = themes.category_20[subNodeIdx % 20];
        }
      } else {
        // 图例颜色取值
        const colorList = calcLinearColor(
          parentNode.color,
          themes['widgets-color-background'],
          parentNode.children.length,
          '',
          true
        );
        node.color = colorList[subNodeIdx];
        color = colorList[subNodeIdx];
      }
    }

    source.push({
      name: node?.data?.name ?? node?.data?.data?.name ?? node?.data?.data?.data?.name,
      value: node.value,
      rawValue: node.data.value,
      depth: node.depth,
      parentList: parentNodeList,
      parent: parentNode,
      x: node.x,
      y: node.y,
      color,
      children: node.children,
      percent: isInvalidNumber(node.value / nodes?.[0]?.value) ? 0 : node.value / nodes?.[0]?.value,
    });
  });

  return source;
}
