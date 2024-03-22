'use strict';

import { Chart, Types, G2Dependents } from './types';
import themes from '../themes';
import { merge, customFormatter, customFormatterConfig } from './common';
import ellipsisLabel from './ellipsisLabel';
import { IElement, IGroup } from '@antv/g-base';

declare type avoidCallback = (isVertical: boolean, labelGroup: IGroup, limitLength?: number) => boolean;
export interface XAxisConfig extends customFormatterConfig {
  visible?: boolean;
  alias?: boolean;
  autoRotate?: boolean;
  rotate?: number;
  autoHide?:
    | boolean
    | avoidCallback
    | string
    | {
        type: string;
        cfg?: {
          /** 最小间距配置 */
          minGap?: number;
        };
      };
  autoEllipsis?: boolean | 'head' | 'middle' | 'tail';
  label?: Types.AxisCfg['label'];
  labelFormatter?: NonNullable<Types.AxisCfg['label']>['formatter'];
  tickLine?: boolean | G2Dependents.AxisTickLineCfg;
  customConfig?: Types.AxisCfg;
  // 数据项中使用
  categories?: number[] | string[];
}

/**
 * rectXAxis 直角坐标系的X轴配置
 *
 * @param {this} ctx 组件实例 this 指针
 * @param {Chart} chart 图表实例
 * @param {Object} config 配置项
 * @param {Object} defaultConfig 组件的自定义配置
 * */
export default function <T>(
  ctx: T,
  chart: Chart,
  config: { grid?: boolean; xAxis?: (Types.ScaleOption & XAxisConfig) | false },
  defaultConfig?: Types.AxisCfg,
) {
  if (config.xAxis === false || (config.xAxis && config.xAxis.visible === false)) {
    chart.axis('x', false);
  } else {
    const {
      alias,
      autoRotate = false,
      rotate,
      // 如果是时间轴，则默认开启轴标签的自动采样,最小值为20
      // 如果是分类，则默认关闭
      autoHide = config.xAxis?.type?.includes('time')
        ? {
            cfg: {
              // 自动采样最小间距为20
              minGap: 20,
            },
          }
        : config.xAxis.autoHide || false,
      autoEllipsis,
      label,
      labelFormatter,
      tickLine = true,
      customConfig,
    } = config.xAxis || {};
    let myTickLine = null;
    if (typeof tickLine === 'boolean' && tickLine) {
      myTickLine = {};
    }

    const xAxisConfig: Types.AxisCfg = {
      ...defaultConfig,
      title: null, // 默认不展示坐标轴的标题
      tickLine: myTickLine,
      label:
        label === undefined
          ? {
              autoRotate,
              rotate,
              autoHide,
              autoEllipsis: transformEllipsis(autoEllipsis),
              formatter: labelFormatter || customFormatter(config.xAxis || {}),
              style: (item: any, index: number, items: any[]) => {
                const chart_ctx = chart.canvas.cfg.context;
                const { width } = chart_ctx?.measureText(item);

                // 需要额外判断刻度之间的距离
                // 目前至少会有2个刻度点, 但怕用户自定义
                // 且第一个刻度和最后一个刻度必须是在画布的两端 - 这个无法判断所以不能全量开放
                if (items.length === 2 || items.length === 3) {
                  if (index === 0) {
                    const currentX = items[index].point.x;
                    const nextX = items[index + 1].point.x;
                    const dis = nextX - (currentX + width);
                    // console.log(nextX - currentX, width, dis)
                    return {
                      textAlign: dis < 80 ? 'center' : 'start'
                    }
                  } else if (index === items.length - 1) {
                    const currentX = items[index].point.x;
                    const preX = items[index - 1].point.x;
                    const dis = currentX - (preX + width);
                    return {
                      textAlign: dis < 80 ? 'center' : 'end'
                    }
                  }
                }
              }
            }
          : label,
    };

    // if (rotate) {
    //   xAxisConfig.label.style = {
    //     textAlign: 'start',
    //     rotate,
    //   };
    // }

    // 网格线
    if (config.grid) {
      xAxisConfig.grid = {
        line: {
          style: {
            stroke: themes['widgets-axis-grid'],
            lineWidth: 1,
          },
        },
        // lineStyle: {
        //   stroke: themes['widgets-axis-grid'],
        //   lineWidth: 1,
        //   // lineDash: null
        // },
        // // hideFirstLine: true
      };
    }

    // 开启坐标轴标题
    if (alias) {
      xAxisConfig.title = {
        // position: 'center',
        // offset: 38,
        // textStyle: {
        //   rotate: 0,
        // },
      };
    }

    // if (componentConfig) {
    //   Object.assign(xAxisConfig, componentConfig);
    // }

    if (customConfig) {
      merge(xAxisConfig, customConfig);
    }

    chart.axis('x', xAxisConfig);
  }
}

/** 自动省略函数，支持head/middle/tail */
function transformEllipsis(autoEllipsis: boolean | 'head' | 'middle' | 'tail') {
  if (!autoEllipsis) {
    return false;
  }
  const type = autoEllipsis === true ? 'tail' : autoEllipsis;

  return (isVertical: boolean, labelGroup: IGroup, limitLength: number) => {
    const children = labelGroup.getChildren();
    children.forEach((label: IElement) => {
      const text = label.attr('text') ?? '';
      const { fontSize, fontFamily, fontWeight, fontStyle, fontVariant } = label.attr() ?? {};
      const font = {
        fontSize,
        fontFamily,
        fontWeight,
        fontStyle,
        fontVariant,
      };
      const ellipsisText = ellipsisLabel(text, limitLength, font, '...', type);
      label.attr('text', ellipsisText);
      label.set('tip', text);
    });
    return true;
  };
}
