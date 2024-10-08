'use strict';
import { BaseChartConfig, Chart, Colors } from './types';
import label, { LabelConfig } from './label';
import geomSize, { GeomSizeConfig } from './geomSize';
import geomStyle, { GeomStyleConfig } from './geomStyle';
import themes from '../themes/index';
import { warn } from './log';
import {getAreaColors} from '../common/common';

const stepNames = ['hv', 'vh', 'hvh', 'vhv'];

export interface DrawLineConfig {
  /** 线条颜色 */
  colors?: Colors;
  /** 面积颜色 */
  areaColors?: Colors;
  /** 是否为面积图 */
  area?:
    | boolean
    | {
        geomStyle?: GeomStyleConfig;
      };
  /** 是否为堆叠图，仅在 area: true 时生效 */
  stack?: boolean;
  /** 是否线条平滑 */
  spline?: boolean;
  /** 是否阶梯折线 */
  step?: string | boolean;
  /** 是否展示线上点 */
  symbol?:
    | {
        shape: string;
        size?: GeomSizeConfig;
        geomStyle?: GeomStyleConfig;
      }
    | boolean;
  /** 数据label */
  label?: LabelConfig | boolean;
  /** 线条宽度 */
  lineWidth?: number;
  /** 元素样式 */
  geomStyle?: GeomStyleConfig;
  /** 是否数据排序 */
  sortable?: boolean;
}

/**
 * drawLine 绘制线图逻辑
 *
 * @param {Chart} chart 图表实例
 * @param {Object} config 配置项
 * @param {string} yAxisKey 数据映射字段
 * */
export default function drawLine(
  chart: Chart,
  config: DrawLineConfig & BaseChartConfig,
  yAxisKey = 'y',
) {
  let areaColors: any = config.areaColors || config.colors;
  if (Array.isArray(config.colors) && Array.isArray(config.areaColors)) {
    areaColors = mergeArray([], config.colors, config.areaColors);
  }

  if (Array.isArray(areaColors)) {
    areaColors = getAreaColors(areaColors, config.stack);
  }

  // 区域、堆叠、平滑曲线
  let lineShape = config.spline ? 'smooth' : 'line';
  const areaShape = config.spline ? 'smooth' : 'area';

  if (config.spline) {
    warn('config.spline', '涉及监控、运维、运营等业务场景不推荐开启曲线，建议关闭');
  }

  // 阶梯折线，目前区域图不支持阶梯，需特殊说明
  if (config.step && !config.area) {
    lineShape = stepNames.indexOf(String(config.step)) > -1 ? (config.step as string) : 'hv';
  }

  let lineGeom = null;
  let areaGeom = null;

  const geomConfig = {
    sortable: config.sortable,
  };

  if (config.area && config.stack) {
    areaGeom = chart
      .area(geomConfig)
      .position(['x', yAxisKey])
      .color('type', areaColors)
      .tooltip(false)
      .shape(areaShape)
      .adjust('stack');
    lineGeom = chart
      .line(geomConfig)
      .position(['x', yAxisKey])
      .color('type', config.colors)
      .shape(lineShape)
      .adjust('stack');
  } else if (config.area && !config.stack) {
    areaGeom = chart
      .area(geomConfig)
      .position(['x', yAxisKey])
      .color('type', areaColors)
      .tooltip(false)
      .shape(areaShape);
    lineGeom = chart
      .line(geomConfig)
      .position(['x', yAxisKey])
      .color('type', config.colors)
      .shape(lineShape);
  } else {
    lineGeom = chart
      .line(geomConfig)
      .position(['x', yAxisKey])
      .color('type', config.colors)
      .shape(lineShape);
  }

  if (typeof config.animate === 'object') {
    lineGeom.animate(config.animate);
    areaGeom && areaGeom.animate(config.animate);
  }

  if (areaGeom && typeof config.area === 'object') {
    if (config.area.geomStyle) {
      geomStyle(areaGeom, config.area.geomStyle, {}, `x*${yAxisKey}*type*extra`);
    }
  }

  geomStyle(
    lineGeom,
    config.geomStyle,
    {
      lineWidth: config.lineWidth || themes['widgets-line-width'],
      lineJoin: 'round',
    },
    `x*${yAxisKey}*type*extra`,
  );

  label({ geom: lineGeom, config: config, field: yAxisKey });

  // 曲线上圆点
  if (config.symbol) {
    let pointGeom = null;
    pointGeom = chart
      .point(geomConfig)
      .position(['x', yAxisKey])
      .color('type', config.colors)
      // 改为空心shape
      .shape('hollowCircle')
      .state({
        active: {
          style: (ele: any) => {
            return {
              stroke: ele?.model?.color,
            };
          },
        },
        selected: {
          style: (ele: any) => {
            return {
              stroke: ele?.model?.color,
            };
          },
        },
      });
    if (config.area && config.stack) {
      pointGeom = pointGeom.adjust('stack');
    }

    if (typeof config.symbol === 'object') {
      pointGeom.shape(config.symbol.shape || 'hollowCircle'); // 配置形状
      geomSize(pointGeom, config.symbol.size, 3, yAxisKey, 'type');

      if (config.symbol.geomStyle) {
        geomStyle(pointGeom, config.symbol.geomStyle, {}, `x*${yAxisKey}*type*extra`);
      }
    }
  }
}

function mergeArray(target: string[], ...source: string[][]) {
  source.forEach((s) => {
    if (!s || s.length === 0) {
      return;
    }
    s.forEach((item, i) => {
      if (i >= target.length) {
        target.push(item);
      } else {
        target[i] = item;
      }
    });
  });

  return target;
}
