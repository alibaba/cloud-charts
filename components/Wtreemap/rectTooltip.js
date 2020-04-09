'use strict';

import { getRawData } from '../common/common';
import merge from '../common/merge';

/*
 * 常见直角坐标系的tooltip，包含title、name、value
 * */
export default function (chart, config) {
  if (config.tooltip === false || (config.tooltip && config.tooltip.visible === false)) {
    chart.tooltip(false);
  } else {
    const {
      showColon = true,
      inPlot = true,
      titleFormatter,
      nameFormatter,
      valueFormatter,
      customConfig,
    } = config.tooltip || {};

    const tooltipConfig = {
      showTitle: false,
      crosshairs: false,
      inPlot,
      itemTpl: `<li data-index={index}>
        <svg viewBox="0 0 6 6" class="g2-tooltip-marker"></svg>
        <span class="g2-tooltip-item-name">{name}</span>${
          showColon ? ':' : ''
        }<span class="g2-tooltip-item-value">{count}</span>
      </li>`,
    };

    if (customConfig) {
      merge(tooltipConfig, customConfig);
    }

    chart.tooltip(tooltipConfig);

    if (titleFormatter || nameFormatter || valueFormatter) {
      chart.on('tooltip:change', (ev) => {
        // 格式化标题
        if (titleFormatter) {
          ev.items[0].title = titleFormatter(ev.items[0].title, ev.items);
        }

        // 对每一项格式化 名字 和 值
        ev.items.forEach((item, index) => {
          const raw = getRawData(config, this.rawData, item);

          if (valueFormatter) {
            item.count = valueFormatter(item.count, raw, index, ev.items);
          }
          if (nameFormatter) {
            item.name = nameFormatter(item.name, raw, index, ev.items);
          }
        });
      });
    }
  }
}
