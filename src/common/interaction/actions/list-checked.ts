
import { G2Dependents } from '../../types';
import ListUnchecked from '@antv/g2/esm/interaction/action/component/list-unchecked';

// 图例正选 Action
export class ListChecked extends ListUnchecked {
    toggle() {
      // 获取原始事件
      const originEvent = this.context.event.event;
      const { item, list } = this.getTriggerListInfo() || {};
      if (!item || !!item.dodge) {
        return;
      }
      // 是否按Control
      const hasControl = originEvent.ctrlKey || originEvent.metaKey;
      // 当前选中状态 false-选中，true-未选
      const currentEnable = this.hasState(list, item);
      const listItems = list.getItems();
      // 是否点击唯一选中的一个
      let checkedNums = 0;
      let isSameItem = false;
      listItems.forEach((listItem: G2Dependents.ListItem) => {
        if (!this.hasState(list, listItem)) {
          checkedNums += 1;
          isSameItem = listItem === item;
        }
      });
      const isOneChecked = checkedNums === 1 && isSameItem;
      if (!hasControl) {
        // 非Control时采用默认单选模式
        listItems.forEach((listItem: G2Dependents.ListItem) => {
          if (listItem !== item) {
            this.setItemState(list, listItem, !isOneChecked);
          } else {
            this.setItemState(list, listItem, false);
          }
        });
      } else {
        // Control时反选
        this.setItemState(list, item, !currentEnable);
      }
    }
  }