
import { G2Dependents } from '../../types';
import ListUnchecked from '@antv/g2/esm/interaction/action/component/list-unchecked';

// 图例反选 Action 默认行为
export class ListReverseChecked extends ListUnchecked {
    toggle() {
      // 获取原始事件
      const originEvent = this.context.event.event;
      const { item, list } = this.getTriggerListInfo() || {};
      // 用于显示分组的items不触发交互
      if (!item || !!item.dodge) {
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