'use strict';

import { Chart, Types } from "./types";
import { getRawData, merge } from './common';

// 排序函数
const sortFun = {
  // 升序
  asce(a: any, b: any) {
    return a.value - b.value;
  },
  // 降序
  desc(a: any, b: any) {
    return b.value - a.value;
  },
};

export interface TooltipConfig {
  visible?: boolean;
  sort?: 'asce' | 'desc' | Function;
  showTitle?: boolean;
  position?: 'top' | 'bottom' | 'left' | 'right';
  offset?: number;
  customConfig?: Types.TooltipCfg;
  titleFormatter?: Function;
  nameFormatter?: Function;
  valueFormatter?: Function;
}

/**
 * rectTooltip 直角坐标系的tooltip配置
 *
 * @param {Chart} chart 图表实例
 * @param {Object} config 配置项
 * @param {Object} componentConfig 组件的自定义配置
 * @param {Function} onTooltipChange 自定义 tooltip:change 事件
 * */
export default function(
  chart: Chart,
  config: { tooltip: TooltipConfig },
  componentConfig?: Types.TooltipCfg,
  onTooltipChange?: Function
) {
  if (config.tooltip === false || (config.tooltip && config.tooltip.visible === false)) {
    chart.tooltip(false);
  } else {
    const {
      sort,
      showTitle = true,
      // showColon = true,
      position = null,
      offset,
      // inPlot = true,
      titleFormatter,
      nameFormatter,
      valueFormatter,
      customConfig,
    } = config.tooltip || {};

    const tooltipConfig: Types.TooltipCfg = {
      showTitle,
      // crosshairs 空对象不可省略，否则在混合图表中会没有crosshairs line
      crosshairs: {},
      position,
      // inPlot,
      // itemTpl: `<li data-index={index}>
      //   <svg viewBox="0 0 6 6" class="g2-tooltip-marker"></svg>
      //   <span class="g2-tooltip-item-name">{name}</span>${
      //     showColon ? ':' : ''
      //   }<span class="g2-tooltip-item-value">{value}</span>
      // </li>`,
    };

    if (offset !== undefined) {
      tooltipConfig.offset = offset;
    }

    if (componentConfig) {
      Object.assign(tooltipConfig, componentConfig);
    }

    if (customConfig) {
      merge(tooltipConfig, customConfig);
    }

    chart.tooltip(tooltipConfig);

    if (sort || titleFormatter || nameFormatter || valueFormatter) {
      if (onTooltipChange) {
        chart.on('tooltip:change', onTooltipChange);
      } else {
        chart.on('tooltip:change', ev => {
          // 如果设置了合法的排序关键字，则开始排序
          if (typeof sort === 'function') {
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
    }
  }
}
