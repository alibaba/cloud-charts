/*
 * @Author: luhuihua luhuihua.lhh@alibaba-inc.com
 * @Date: 2023-04-19 16:13:46
 * @LastEditors: luhuihua luhuihua.lhh@alibaba-inc.com
 * @LastEditTime: 2023-06-13 17:29:21
 * @FilePath: /aisc-widgets/src/common/circleAnnoation.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
'use strict';

import { Chart, G2Dependents } from './types';
import themes from '../themes';
import { numberDecimal } from '../common/common';
import { FullCrossName } from '../constants';
import { warn } from './log';

interface decorationItem {
  innerRadius?: number;
  outerRadius?: number;
  innerStyle?: any;
  outerStyle?: G2Dependents.ShapeAttrs;
}

export interface DecorationConfig {
  showDecoration?: decorationItem | boolean;
  cycle?: boolean;
  radius?: number;
  innerRadius?: number;
  outerRadius?: number;
}

export default function (chart: Chart, config: DecorationConfig, size: any, chartName: string) {
  if (!config.showDecoration) {
    return;
  }

  if (config.showDecoration) {
    if (config?.radius) {
      config.radius = 0.85;
    } else if (config.outerRadius) {
      config.outerRadius = 0.85;
    }

    const viewWidth = chart.coordinateBBox.width ?? size?.[0] ?? 0;
    const viewHeight = chart.coordinateBBox.height ?? size?.[1] ?? 0;
    // 视图最小宽高 * 半径 * 内圈半径 - 图例间距 - 留白间距 - 柱子宽度
    const innerR =
      config.showDecoration?.innerRadius ??
      numberDecimal(
        Math.min(viewWidth, viewHeight) * (config.radius || config.outerRadius || 1) * (config.innerRadius || 0.5),
        0,
      ) -
        14 * 3;
    // 视图最小宽高减去图例间距
    const outerR = config.showDecoration?.outerRadius ?? numberDecimal(Math.min(viewWidth, viewHeight) / 2 - 14);

    if (Math.min(viewWidth, viewHeight) > 60) {
      if (config.cycle || chartName === 'G2MultiCircle') {
        chart.annotation().html({
          html: `<div class='${FullCrossName} circle-innerBackground' style="display: flex; align-items: center;height: ${innerR}px;width: ${innerR}px;border-radius: 50%;"></div>`,
          alignX: 'middle',
          alignY: 'middle',
          position: ['50%', '50%'],
        });
      }

      chart.annotation().dataMarker({
        top: false,
        text: {
          content: '',
        },
        point: {
          style: {
            fill: themes['widgets-circle-outer-background'],
            stroke: 'rgba(0,0,0,0)',
            r: outerR,
            ...config.showDecoration?.outerStyle,
          },
        },
        position: ['50%', '50%'],
      });
    } else {
      warn('config.showDecoration', '当前图表尺寸小于60，默认关闭背景装饰');
    }
  }
}
