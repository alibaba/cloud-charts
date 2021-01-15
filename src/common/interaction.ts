import { registerAction, registerInteraction } from '@antv/g2/esm/core';
import { G2Dependents, Types } from './types';
import ListUnchecked from '@antv/g2/esm/interaction/action/component/list-unchecked';

// 图例单选 Action
class ListChecked extends ListUnchecked {
  toggle() {
    // 获取原始事件
    const originEvent = this.context.event.event;
    const { item, list } = this.getTriggerListInfo() || {};
    if (!item) {
      return;
    }
    // 是否按Control
    const hasControl = originEvent.ctrlKey || originEvent.metaKey;
    // 当前选中状态 false-选中，true-未选
    const currentEnable = this.hasState(list, item);
    if (hasControl) {
      // Control进入单选默认
      const listItems = list.getItems();
      const isOneChecked =
        listItems.reduce((pre: number, cur: G2Dependents.ListItem) => {
          return pre + (this.hasState(list, cur) ? 0 : 1);
        }, 0) === 1;
      listItems.forEach((listItem: G2Dependents.ListItem) => {
        const enable = this.hasState(list, listItem);
        const otherEnable = !currentEnable && isOneChecked ? !enable : true;
        if (listItem !== item) {
          this.setItemState(list, listItem, otherEnable);
        } else {
          this.setItemState(list, listItem, false);
        }
      });
    } else {
      // 非Control时保持默认反选
      this.setItemState(list, item, !currentEnable);
    }
  }
}

registerAction('list-checked', ListChecked);

// 图例单选模式封装交互
registerInteraction('legend-custom-filter', {
  showEnable: [
    { trigger: 'legend-item:mouseenter', action: 'cursor:pointer' },
    { trigger: 'legend-item:mouseleave', action: 'cursor:default' },
  ],
  start: [
    { trigger: 'legend-item:click', action: ['list-checked:toggle', 'data-filter:filter'] }
  ],
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
    { trigger: 'legend-item:click', action: ['list-checked:toggle', 'data-filter:filter'], isEnable: notLastLegend }
  ],
});
