'use strict';

import G2 from '@antv/g2';
import { getRawData } from './common';
import merge from './merge';

// 排序函数
const sortFun = {
  // 升序
  asce(a, b) {
    return a.value - b.value;
  },
  // 降序
  desc(a, b) {
    return b.value - a.value;
  },
};

/*
* 常见直角坐标系的tooltip，包含title、name、value
* */
export default function (chart, config, componentConfig) {
  if (config.tooltip !== false) {
    const { sort, showTitle = true, showColon = true, titleFormatter, nameFormatter, valueFormatter, customConfig } = config.tooltip || {};

    const tooltipConfig = {
      showTitle,
      // crosshairs 空对象不可省略，否则在混合图表中会没有crosshairs line
      crosshairs: {},
      itemTpl: '<li data-index={index}>'
        + '<span style="background-color:{color};" class="g2-tooltip-marker"></span>'
        + `<span class="g2-tooltip-item-name">{name}</span>${showColon ? ':' : ''}<span class="g2-tooltip-item-value">{value}</span></li>`,
    };

    if (componentConfig) {
      Object.assign(tooltipConfig, componentConfig);
    }

    if (customConfig) {
      merge(tooltipConfig, customConfig);
    }

    chart.tooltip(tooltipConfig);

    if (sort || titleFormatter || nameFormatter || valueFormatter) {
      chart.on('tooltip:change', (ev) => {
        // 如果设置了合法的排序关键字，则开始排序
        if (G2.Util.isFunction(sort)) {
          ev.items.sort(sort);
        } else if (sortFun[sort]) {
          ev.items.sort(sortFun[sort]);
        }

        // 格式化标题
        if (titleFormatter) {
          ev.items[0].title = titleFormatter(ev.items[0].title, ev.items);
        }

        // 对每一项格式化 名字 和 值
        ev.items.forEach((item, index) => {
          const raw = getRawData(config, this.rawData, item);

          if (valueFormatter) {
            item.value = valueFormatter(item.value, raw, index, ev.items);
          }
          if (nameFormatter) {
            item.name = nameFormatter(item.name, raw, index, ev.items);
          }
        });
      });
    }
  } else {
    chart.tooltip(false);
  }
}
