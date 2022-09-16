'use strict';

import { Chart, Types } from "./types";
import { customFormatter, customFormatterConfig, getRawData, merge, pxToNumber } from './common';
import { ReactElement } from 'react';
import { render } from 'react-dom';
import themes from '../themes';

// import TooltipController from '@antv/g2/esm/chart/controller/tooltip';
// import { registerComponentController } from '@antv/g2/esm/chart/controller';
// // 自定义 TooltipController 来处理 titleFormatter 的问题
// class WidgetsTooltipController extends TooltipController {
//   getTooltipItems(point: Types.Point) {
//     const rawItems = super.getTooltipItems(point);
//     const view = this.view;
//     const option = view.getOptions().tooltip;
//     // @ts-ignore
//     if (rawItems.length > 0 && typeof option !== 'boolean' && option.customTitle) {
//       // @ts-ignore
//       rawItems[0].title = option.customTitle(rawItems[0].title || rawItems[0].name, rawItems);
//     }
//     return rawItems;
//   }
// }
// registerComponentController('tooltip', WidgetsTooltipController);

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

export interface TooltipConfig extends customFormatterConfig {
  visible?: boolean;
  sort?: 'asce' | 'desc' | ((a: any, b: any) => number);
  showTitle?: boolean;
  showColon?: boolean;
  position?: 'top' | 'bottom' | 'left' | 'right';
  offset?: number;
  customConfig?: Types.TooltipCfg;
  titleFormatter?: (title: string, datum: Types.Datum) => string;
  nameFormatter?: (name: any, datum: Types.Datum, index: number, items: any[]) => string | number;
  valueFormatter?: (value: any, datum: Types.Datum, index: number, items: any[]) => string | number;
  /** Html 自定义内容块 */
  customContent?: (title: string, data: any[]) => string | HTMLElement;
  reactContent?: (title: string, data: any[]) => ReactElement;
  /** 内容分列展示 */
  columns?: number | false;
}

/**
 * rectTooltip 直角坐标系的tooltip配置
 *
 * @param {this} ctx 组件实例 this 指针
 * @param {Chart} chart 图表实例
 * @param {Object} config 配置项
 * @param {Object} defaultConfig 组件的自定义配置
 * @param {Function} onTooltipChange 自定义 tooltip:change 事件
 * @param {Object} componentConfig
 * */
export default function<T>(
  ctx: T,
  chart: Chart,
  config: { tooltip?: TooltipConfig | boolean; },
  defaultConfig?: Types.TooltipCfg,
  onTooltipChange?: Function,
  componentConfig?: Types.TooltipCfg
) {
  if (config.tooltip === false || (config.tooltip && typeof config.tooltip !== 'boolean' && config.tooltip.visible === false)) {
    chart.tooltip(false);
  } else {
    const {
      sort,
      showTitle = true,
      showColon = true,
      position,
      offset,
      // inPlot = true,
      titleFormatter,
      nameFormatter,
      valueFormatter,
      customContent,
      reactContent,
      customConfig,
      columns,
      unit,
      decimal,
      grouping,
    } = (config.tooltip === true ? {} : (config.tooltip || {})) as TooltipConfig;

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
      itemTpl: `<li class="g2-tooltip-list-item" data-index={index}><span class="g2-tooltip-marker" style="background:{color}"></span><span class="g2-tooltip-name">{name}</span>${showColon ? ': ' : ' '}<span class="g2-tooltip-value">{value}</span></li>`,
      // 尝试自定义title，可以达到效果，但是重绘次数过多，性能差
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
      customContent,
    };

    if (titleFormatter) {
      // 下面这段是 TooltipCfg.title 不为 function 的逻辑
      // tooltipConfig.title = '_customTitle_';

      // 下面这段是 TooltipCfg.title 为 function 的逻辑
      tooltipConfig.title = function (title, item) {
        return titleFormatter(title, item);
      };

      // 下面这行是配合自定义 TooltipController
      // // @ts-ignore
      // tooltipConfig.customTitle = titleFormatter;
    }

    // react tooltip 渲染模式
    if (reactContent) {
      const reactContentDom = document.createElement('div');
      reactContentDom.classList.add('g2-tooltip');
      reactContentDom.style.width = 'auto';
      reactContentDom.style.height = 'auto';

      tooltipConfig.customContent = function (title, data) {
        render(reactContent(title, data), reactContentDom);
        return reactContentDom;
      }
    }

    // 多列设置无法和自定义内容同时使用
    if (columns !== false && !reactContent && !customContent) {
      const tooltipListStyle: Types.LooseObject = {};
      if (columns > 1) {
        tooltipListStyle['column-count'] = columns;
      }
      merge(tooltipConfig, {
        domStyles: {
          'g2-tooltip-list': tooltipListStyle,
        },
      });
      const fontSize1 = themes['widgets-font-size-1'];
      const baseFontSizeNum = pxToNumber(themes['widgets-font-size-1']);

      // 在 tooltip 展示前，根据 items 个数更新
      chart.on('tooltip:show', (ev: any) => {
        if (ev.view) {
          const chartHeight = ev.view.height;
          // 图表高度最多能容纳的 tooltip 项个数
          const maxLen = Math.floor((chartHeight - (3 * baseFontSizeNum)) / (2 * baseFontSizeNum));
          const { items } = ev.data;
          // 计算最终分列数，自动计算最多分 3 列，最少 1 列
          const computeColumns = columns || Math.min(3, Math.max(1, Math.ceil(items.length / maxLen)));

          const tooltipOptions = ev.view.getOptions().tooltip;

          tooltipOptions.domStyles['g2-tooltip-list']['column-count'] = computeColumns;

          if (items.length % computeColumns !== 0) {
            tooltipOptions.domStyles['g2-tooltip-list'].margin = `0 0 ${fontSize1} 0`;
          } else {
            tooltipOptions.domStyles['g2-tooltip-list'].margin = 0;
          }
        }
      });
    }

    if (componentConfig) {
      Object.assign(tooltipConfig, componentConfig);
    }

    if (customConfig) {
      merge(tooltipConfig, customConfig);
    }

    chart.tooltip(tooltipConfig);

    if (
      sort || titleFormatter || nameFormatter || valueFormatter ||
      unit || (decimal !== undefined && decimal !== null) || grouping
    ) {
      if (onTooltipChange) {
        chart.on('tooltip:change', onTooltipChange);
      } else {
        const customValueFormatter = customFormatter(config.tooltip === true ? {} : (config.tooltip || {}));

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

          // 格式化标题，下面这段是 TooltipCfg.title 不为 function 的逻辑
          // if (titleFormatter && !items[0].data.hasCustomTitle) {
          //   // ev.title = titleFormatter(ev.title, ev.items);
          //   // items[0].title = titleFormatter(items[0].title, items);
          //   items[0].data._customTitle_ = titleFormatter(items[0].data.x, items);
          //   items[0].data.hasCustomTitle = true;
          // }
          // console.log(ev);

          // 对每一项格式化 名字 和 值
          items.forEach((item: any, index: number) => {
            // @ts-ignore
            const raw = getRawData(config, ctx.rawData, item);

            if (valueFormatter) {
              item.value = valueFormatter(item.value, raw, index, items);
            } else if (customValueFormatter) {
              item.value = customValueFormatter(item.value);
            }
            if (nameFormatter) {
              item.name = nameFormatter(item.name, raw, index, items);
            }
          });
        });
      }
    }
  }
}
