'use strict';

import { IElement, IGroup } from '@antv/g-base';
import { Chart, Types, G2Dependents } from './types';
import { merge, customFormatter, customFormatterConfig, pxToNumber, containsChinese } from './common';
import ellipsisLabel, { isOverlap, getMatrixByAngle } from './ellipsisLabel';
import themes from '../themes';

declare type avoidCallback = (isVertical: boolean, labelGroup: IGroup, limitLength?: number) => boolean;
export interface XAxisConfig extends customFormatterConfig {
  visible?: boolean;
  alias?: boolean;
  autoRotate?: boolean | avoidCallback;
  rotate?: number;
  autoHide?:
    | boolean
    | avoidCallback
    | string
    | {
        type?: string;
        cfg?: {
          /** 最小间距配置 */
          minGap?: number;
        };
      };
  autoEllipsis?: boolean | 'head' | 'middle' | 'tail';
  label?: Types.AxisCfg['label'];
  labelFormatter?: NonNullable<Types.AxisCfg['label']>['formatter'];
  tickLine?: boolean | G2Dependents.AxisTickLineCfg;
  overlapOrder?: string[];
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
      overlapOrder = ['autoEllipsis', 'autoHide', 'autoRotate'],
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
        : false,
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
      overlapOrder,
      label:
        label === undefined
          ? {
              autoRotate,
              rotate,
              autoHide,
              autoEllipsis: ellipsisLabels(autoEllipsis, config?.xAxis?.type, config, chart),
              formatter: labelFormatter || customFormatter(config.xAxis || {}),
              style: (item: any, index: number, items: any[]) => {
                const width = pxToNumber(themes['widgets-font-size-1']) * item.length * 0.6;
                const canvasWidth = chart.coordinateBBox.x + chart.coordinateBBox.width;

                // 需要额外判断刻度之间的距离
                // 目前至少会有2个刻度点, 但怕用户自定义
                // 且第一个刻度和最后一个刻度必须是在画布的两端 - 这个无法判断所以不能全量开放
                // 直角坐标系 且 没有转置的时候
                if (chart.coordinateInstance.isRect && !chart.coordinateInstance.isTransposed) {
                  if (items.length === 2 || items.length === 3) {
                    if (index === 0) {
                      const currentX = items[index].point.x;
                      const nextX = items[index + 1].point.x;
                      const dis = nextX - (currentX + width);
                      return {
                        textAlign: dis < 80 || currentX > width / 2 ? 'center' : 'start',
                      };
                    } else if (index === items.length - 1) {
                      const currentX = items[index].point.x;
                      const preX = items[index - 1].point.x;
                      const dis = currentX - (preX + width);
                      const disCanvas = canvasWidth - currentX;
                      return {
                        textAlign: dis < 80 || disCanvas > width / 2 ? 'center' : 'end',
                      };
                    }
                  }
                }

                return {};
              },
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

// function rotateLabel(autoRotate: boolean | avoidCallback, xAxisType: string) {
//   if (!autoRotate || xAxisType.includes('time')) {
//     return false;
//   }
//   return (isVertical: boolean, labelGroup: IGroup, limitLength: number) => {
//     console.log(111, isVertical, labelGroup, limitLength)
//     return true
//   };
// }

/** 自动省略函数，支持head/middle/tail */
function ellipsisLabels(autoEllipsis: boolean | 'head' | 'middle' | 'tail', xAxisType: string, config?: any, chart?: Chart) {
  if (!autoEllipsis || xAxisType?.includes('time') || config?.column === false || typeof config?.column === 'object') {
    return false;
  }

  // 是否自定义了省略方式
  const hasCustom = typeof autoEllipsis === 'string';
  const type = autoEllipsis === true ? 'middle' : autoEllipsis;
  let minGap = 8;

  return (isVertical: boolean, labelGroup: IGroup, limitLength: number) => {
    const children = labelGroup.getChildren();
    const childrenCount = children.length ?? 1;
    const chartCanvasWidth = chart?.coordinateBBox?.width ?? 0;
    // const labelCanvasWidth = labelGroup.getBBox().width ?? 0;

    // 判断是否有重叠
    // let first = children[0];
    // // 重叠部分的最大尺寸
    // let maxOverlopGap = 0;
    // let hasOverlap = false;
    // // 数据中最长的字长(在画布中的宽度),考虑用户自定义
    // // 理论上只有一个刻度的时候最大宽度为图表尺寸，现在默认为100，后面再调整
    // let maxTextLength = children.length > 1 ? first.getBBox().width : limitLength;

    // // 中文减少偏移， 暂定一个偏移值
    // if (containsChinese(first.attr('text'))) {
    //   minGap = -16;
    // }

    for (let i = 1; i < children.length; i++) {
      // const { isOverlap: isTextOverlap, maxGap } = isOverlap(
      //   isVertical,
      //   i > 1 ? children[i - 1] : first,
      //   children[i],
      //   minGap,
      // );
      const text = children[i].attr('text') ?? '';
      // maxTextLength = Math.max(maxTextLength, children[i].getBBox().width)
      if (containsChinese(text)) {
        minGap = 12;
      }
      // if (isTextOverlap) {
      //   maxOverlopGap = Math.max(maxOverlopGap, maxGap);
      //   hasOverlap = isTextOverlap;
      // }
    }

    // maxTextLength = Math.min(maxTextLength, limitLength);
    // const tickDistance = children.length > 1 ? children[1].getBBox().x - first.getBBox().x : maxTextLength;
    // 重叠时最大允许宽度为最大字长 - 最大重叠距离 - 刻度值间最小间距
    // 不重叠时取刻度间距 - 最小间距
    // const adjustLimitLength = hasOverlap ? maxTextLength - maxOverlopGap - minGap : tickDistance - minGap;

    const textLengthForCanvas = (chartCanvasWidth - minGap * (childrenCount - 1)) / childrenCount;

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
      let ellipsisText = ellipsisLabel(text, textLengthForCanvas, font, '...', type, hasCustom);

      if (ellipsisText === '...') {
        const x = label.attr('x');
        const y = label.attr('y');
        const matrix = getMatrixByAngle({ x, y }, Math.PI / 4);
        let ellipsisText = ellipsisLabel(text, 30, font, '...', type, hasCustom);

        label.attr('text', ellipsisText);
        label.set('tip', text);
        label.attr('matrix', matrix);

        return false;
      }
      label.attr('text', ellipsisText);
      label.set('tip', text);
    });
    return true;
  };
}
