import { registerAction, registerInteraction, View } from '@antv/g2/esm/core';
import { get, isArray } from '@antv/util';
import { DrillDownAction } from './actions/drill-down';

export function drillDown(view: View, onClick?: any) {
  view.interaction('drill-down', {
    start: [
      {
        trigger: 'element:click',
        isEnable(context: any) {
          return isParentNode(context);
        },
        action: ['drill-down-action:click'],
      },
      {
        trigger: 'afterchangesize',
        action: ['drill-down-action:resetPosition'],
      },
      {
        trigger: 'click',
        isEnable: (context: any) => {
          onClick(context, inCenter(context));
          return inCenter(context);
        },
        action: ['drill-down-action:back'],
      },
    ],
  });
}

/**
 * 判断是否为父节点
 */
export function isParentNode(context: any) {
  const data = get(context, ['event', 'data', 'data'], {});
  return isArray(data.children) && data.children.length > 0;
}

/**
 * 判断是否在中心
 */
function inCenter(context: any) {
  const coordinate = context.view.getCoordinate();
  const { innerRadius } = coordinate;
  if (innerRadius) {
    const { x, y } = context.event;
    const { x: centerX, y: centerY } = coordinate.center;
    const r = coordinate.getRadius() * innerRadius;
    const distance = Math.sqrt((centerX - x) ** 2 + (centerY - y) ** 2);
    return distance < r;
  }
  return false;
}

registerAction('drill-down-action', DrillDownAction);
registerInteraction('drill-down', {
  showEnable: [
    { trigger: 'element:mouseenter', action: 'cursor:pointer', isEnable: isParentNode },
    { trigger: 'element:mouseleave', action: 'cursor:default' },
    // 中心处，肯定会触发 element:mouseleave 操作
    { trigger: 'element:mouseleave', action: 'cursor:pointer', isEnable: inCenter },
  ],
  start: [
    {
      trigger: 'element:click',
      isEnable: isParentNode,
      action: ['drill-down-action:click'],
    },
    {
      trigger: 'afterchangesize',
      action: ['drill-down-action:resetPosition'],
    },
    {
      // 点击中心，返回上一层
      trigger: 'click',
      isEnable: inCenter,
      action: ['drill-down-action:back'],
    },
  ],
});