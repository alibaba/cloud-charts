import { Types } from '../types';
import themes from '../../themes/index';
import { calcLinearColor } from '../common';

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

export function transformNodes(dv: any) {
  const source: Types.Data = [];

  dv.getAllNodes().forEach((node: any) => {
    let color = node?.data?.color;
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
        node.color = themes.category_20[subNodeIdx % 20];
        color = themes.category_20[subNodeIdx % 20];
      } else {
        const colorList = calcLinearColor(
          parentNode.color,
          themes['widgets-color-background'],
          parentNode.children.length,
        );
        node.color = colorList[subNodeIdx];
        color = colorList[subNodeIdx];
      }
    }

    // var obj = {};
    // obj.name = node.data.name;
    // obj.rawValue = node.data.value;
    // obj.value = node.value;
    // obj.x = node.x;
    // obj.y = node.y;
    source.push({
      name: node.data.name,
      value: node.value,
      rawValue: node.data.value,
      depth: node.depth,
      parent: parentNodeList,
      x: node.x,
      y: node.y,
      color,
      children: node.children,
    });
  });

  return source;
}
