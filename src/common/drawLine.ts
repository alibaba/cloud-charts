'use strict';
import { Chart, Types } from "./types";
import label, { LabelConfig } from './label';
import geomSize, { GeomSizeConfig } from './geomSize';

const stepNames = ['hv', 'vh', 'hvh', 'vhv'];

export interface DrawLineConfig {
  /** 线条颜色 */
  colors?: string[];
  /** 面积颜色 */
  areaColors?: string[];
  /** 是否为面积图 */
  area?: boolean,
  /** 是否为堆叠图，仅在 area: true 时生效 */
  stack?: boolean, // 仅Area有效
  /** 是否线条平滑 */
  spline?: boolean,
  /** 是否阶梯折线 */
  step?: string | boolean,
  /** 是否展示线上点 */
  symbol?: {
    size?: GeomSizeConfig;
    geomStyle?: Types.LooseObject;
  } | boolean,
  /** 数据label */
  label?: LabelConfig | boolean,
  /** 线条宽度 */
  lineWidth?: number;
  /** 元素样式 */
  geomStyle?: Types.LooseObject;
}

/**
 * drawLine 绘制线图逻辑
 *
 * @param {Chart} chart 图表实例
 * @param {Object} config 配置项
 * @param {string} yAxisKey 数据映射字段
 * */
export default function drawLine(chart: Chart, config: DrawLineConfig, yAxisKey = 'y') {
  const { lineWidth } = config;
  const geomStyle = config.geomStyle || {};
  if (lineWidth && geomStyle.lineWidth === undefined) {
    geomStyle.lineWidth = lineWidth;
  }

  let areaColors = config.areaColors || config.colors;
  if (Array.isArray(config.colors) && Array.isArray(config.areaColors)) {
    areaColors = mergeArray([], config.colors, config.areaColors);
  }

  // 区域、堆叠、平滑曲线
  let lineShape = config.spline ? 'smooth' : 'line';
  const areaShape = config.spline ? 'smooth' : 'area';

  // 阶梯折线，目前区域图不支持阶梯，需特殊说明
  if (config.step && !config.area) {
    lineShape = stepNames.indexOf(String(config.step)) > -1 ? (config.step as string) : 'hv';
  }

  let lineGeom = null;

  if (config.area && config.stack) {
    chart.area()
      .position(['x', yAxisKey])
      .color('type', areaColors)
      .tooltip(false)
      .shape(areaShape)
      .adjust('stack');
    lineGeom = chart.line()
      .position(['x', yAxisKey])
      .color('type', config.colors)
      .shape(lineShape)
      .adjust('stack');
      // .style('x*y*type*extra', {
      //   lineJoin: 'round',
      //   ...geomStyle,
      // });
  } else if (config.area && !config.stack) {
    chart.area()
      .position(['x', yAxisKey])
      .color('type', areaColors)
      .tooltip(false)
      .shape(areaShape)
    lineGeom = chart.line()
      .position(['x', yAxisKey])
      .color('type', config.colors)
      .shape(lineShape)
      // .style('x*y*type*extra', {
      //   lineJoin: 'round',
      //   ...geomStyle,
      // });
  } else {
    lineGeom = chart.line()
      .position(['x', yAxisKey])
      .color('type', config.colors)
      .shape(lineShape)
      // .style('x*y*type*extra', {
      //   lineJoin: 'round',
      //   ...geomStyle,
      // });
  }

  label(lineGeom, config, yAxisKey);

  // 曲线默认点
  let pointGeom = null;
  if (config.symbol) {
    if (config.area && config.stack) {
      pointGeom = chart.point()
        .adjust('stack')
        .position(['x', yAxisKey])
        .color('type', config.colors)
        .shape('circle')
    } else {
      pointGeom = chart.point()
        .position(['x', yAxisKey])
        .color('type', config.colors)
        .shape('circle')
    }

    if (typeof config.symbol === 'object') {
      geomSize(pointGeom, config.symbol.size, 3, yAxisKey, 'type');

      // if (config.symbol.geomStyle) {
      //   pointGeom.style('x*y*type*extra', config.symbol.geomStyle);
      // }
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
