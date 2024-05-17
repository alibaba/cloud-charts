import { registerInteraction } from '@antv/g2/esm/core';
import { Types } from '../types';

// 图例单选模式封装交互
registerInteraction('legend-custom-filter', {
  showEnable: [
    { trigger: 'legend-item:mouseenter', action: 'cursor:pointer' },
    { trigger: 'legend-item:mouseleave', action: 'cursor:default' },
  ],
  start: [{ trigger: 'legend-item:click', action: ['list-checked:toggle', 'data-filter:filter'] }],
});

function notLastLegend(context: Types.IInteractionContext) {
  // @ts-ignore
  const { item, list } = context.getAction('list-checked').getTriggerListInfo() || {};
  if (!item) {
    return true;
  }
  const items = list.getItems();
  const stateItems = list.getItemsByState('unchecked');
  // 当前选中项状态
  const currentEnable = list.hasState(item, 'unchecked');
  // 获取原始事件
  const originEvent = context.event.event;
  // 是否按Control
  const hasControl = originEvent.ctrlKey || originEvent.metaKey;
  // 按Control进入单选模式则一直可用，或者：当前是要 unchecked，且只剩下一个 非unchecked 的 item，则返回 false
  return hasControl || !(!currentEnable && stateItems.length === items.length - 1);
}

registerInteraction('legend-custom-filter-last', {
  showEnable: [
    { trigger: 'legend-item:mouseenter', action: 'cursor:pointer', isEnable: notLastLegend },
    { trigger: 'legend-item:mouseleave', action: 'cursor:default' },
  ],
  start: [
    {
      trigger: 'legend-item:click',
      action: ['list-checked:toggle', 'data-filter:filter', 'element-highlight:clear'],
      isEnable: notLastLegend,
    },
  ],
});

function notLastCheckedLegend(context: Types.IInteractionContext) {
    // @ts-ignore
    const { item, list } = context.getAction('list-checked').getTriggerListInfo() || {};
    if (!item) {
      return true;
    }
    const items = list.getItems();
    const stateItems = list.getItemsByState('unchecked');
    // 当前选中项状态
    const currentEnable = list.hasState(item, 'unchecked');
    // 获取原始事件
    const originEvent = context.event.event;
    // 是否按Control
    const hasControl = originEvent.ctrlKey || originEvent.metaKey;
    // 单选情况下，非Control时一直可用，control时不能消除最后一个legend
    return !hasControl || !(!currentEnable && stateItems.length === items.length - 1);
  }
  
  // 正选时的交互
  registerInteraction('legend-singlechecked-filter-last', {
    showEnable: [
      { trigger: 'legend-item:mouseenter', action: 'cursor:pointer', isEnable: notLastCheckedLegend },
      { trigger: 'legend-item:mouseleave', action: 'cursor:default' },
    ],
    start: [
      {
        trigger: 'legend-item:click',
        action: ['list-checked:toggle', 'data-filter:filter', 'element-highlight:clear'],
        isEnable: notLastCheckedLegend,
      },
    ],
  });