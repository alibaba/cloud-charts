'use strict';

import { Chart, Types, G2Dependents } from './types';
import themes from '../themes';
import { merge, customFormatter, customFormatterConfig } from './common';
import ellipsisLabel from './ellipsisLabel';
import { IElement, IGroup } from '@antv/g-base';

export interface XAxisConfig extends customFormatterConfig {
  visible?: boolean;
  alias?: boolean;
  autoRotate?: boolean;
  rotate?: number;
  autoHide?: boolean;
  autoEllipsis?: boolean | 'head' | 'middle' | 'tail';
  label?: any;
  labelFormatter?: Types.AxisCfg['label']['formatter'];
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
      autoHide,
      autoEllipsis,
      label,
      labelFormatter,
      tickLine,
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
