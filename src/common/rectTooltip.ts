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
 * @param {Object} defaultConfig 组件的自定义配置
 * @param {Function} onTooltipChange 自定义 tooltip:change 事件
 * */
export default function(
  chart: Chart,
  config: { tooltip?: TooltipConfig },
  defaultConfig?: Types.TooltipCfg,
  onTooltipChange?: Function,
  componentConfig?: Types.TooltipCfg
) {
  if (config.tooltip === false || (config.tooltip && config.tooltip.visible === false)) {
    chart.tooltip(false);
  } else {
    const {
      sort,
      showTitle = true,
      // showColon = true,
      position,
      offset,
      // inPlot = true,
      titleFormatter,
      nameFormatter,
      valueFormatter,
      customConfig,
    } = config.tooltip || {};

    const tooltipConfig: Types.TooltipCfg = {
      ...defaultConfig,
      showTitle,
      // title: '_customTitle_',
      showCrosshairs: true,
      // crosshairs 空对象不可省略，否则在混合图表中会没有crosshairs line
      crosshairs: {
        type: 'x',
      },
      position,
      offset,
      shared: true,
      // inPlot,
      // itemTpl: `<li data-index={index}>
      //   <svg viewBox="0 0 6 6" class="g2-tooltip-marker"></svg>
      //   <span class="g2-tooltip-item-name">{name}</span>${
      //     showColon ? ':' : ''
      //   }<span class="g2-tooltip-item-value">{value}</span>
      // </li>`,
      // customContent(title, data) {
      //   console.log(title, data);
      //   return `<div class="g2-tooltip-title">${title}</div>
      //     <ul class="g2-tooltip-list">
      //       ${
      //         data.map((d, i) => {
      //           return `<li class="g2-tooltip-list-item" data-index="${i}">
      //             <span class="g2-tooltip-marker" style="background:${d.color}"></span>
      //             <span class="g2-tooltip-name">${d.name}</span>:<span class="g2-tooltip-value">${d.value}</span>
      //           </li>`;
      //         }).join('')
      //       }
      //     </ul>
      //   `;
      // },
    };

    if (titleFormatter) {
      tooltipConfig.title = '_customTitle_';
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
        chart.on('tooltip:change', (ev: any) => {
          // x: 当前鼠标的 x 坐标,
          // y: 当前鼠标的 y 坐标,
          // items: 数组对象，当前 tooltip 显示的每条内容
          // title: tooltip 标题
          const { items } = ev.data;
          // console.log(ev);
          // 如果设置了合法的排序关键字，则开始排序
          if (typeof sort === 'function') {
            items.sort(sort);
          } else if (sortFun[sort]) {
            items.sort(sortFun[sort]);
          }

          // 格式化标题
          if (titleFormatter && !items[0].data.hasCustomTitle) {
            // ev.title = titleFormatter(ev.title, ev.items);
            // items[0].title = titleFormatter(items[0].title, items);
            items[0].data._customTitle_ = titleFormatter(items[0].data.x, items);
            items[0].data.hasCustomTitle = true;
          }
          // console.log(ev);

          // 对每一项格式化 名字 和 值
          items.forEach((item: any, index: number) => {
            // @ts-ignore
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
