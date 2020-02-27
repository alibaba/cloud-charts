'use strict';

import themes from '../theme/index';
import { pxToNumber, isInvalidNumber } from './common';

/**
 * 常见直角坐标系自动计算标签个数。
 * @param chart {object} G2图表实例
 * @param config {object} 图表配置项
 * @param defs {object} 数据列定义
 * @param transpose {boolean} 坐标系是否翻转，翻转后使用宽度计算Y轴，高度计算X轴
 * */
export default function (chart, config, defs, transpose) {
  // X轴&Y轴对应的长度
  var xLen = transpose ? chart.get('height') : chart.get('width');
  var yLen = transpose ? chart.get('width') : chart.get('height');

  // 坐标系不翻转时为横向，翻转时为纵向
  computerAxis(chart, config.xAxis, defs.x, transpose, xLen);

  // 坐标系不翻转时为纵向，翻转时为横向
  if (Array.isArray(config.yAxis)) {
    config.yAxis.forEach(function (axis, yIndex) {
      computerAxis(chart, axis, defs['y' + yIndex], !transpose, yLen);
    });
  } else {
    computerAxis(chart, config.yAxis, defs.y, !transpose, yLen);
  }
}

// 计算口径 horizontal 横向 ? vertical 纵向
function computerAxis(chart, axisConfig, def, isVertical, len) {
  // 轴设定为不显示 或 tickCount 不是 auto 时，跳过
  if (axisConfig === false || axisConfig && axisConfig.visible === false || axisConfig.tickCount !== 'auto') {
    return;
  }

  var labelFontSize = pxToNumber(themes['widgets-font-size-1']);
  if (axisConfig.customConfig && axisConfig.customConfig.label && axisConfig.customConfig.label.textStyle && axisConfig.customConfig.label.textStyle.fontSize) {
    labelFontSize = convertFontSize(axisConfig.customConfig.label.textStyle.fontSize);
  }

  var tickCount = 0;

  if (isVertical) {
    // 纵向，使用高度计算，除数为 一倍的字体大小 + 三分之四倍字号作为间距
    // TODO 需要减去上下padding
    tickCount = Math.max(Math.floor((len - 20) / (labelFontSize * 8 / 3)), 2);
  } else if (def.type === 'time' || def.type === 'timeCat') {
    // 横向，使用宽度计算，仅支持time类型，取mask的字符长度 * 0.5倍字号作为标签宽度，再乘1.5倍作为除数
    var labelWidth = (def.mask || 'YYYY-MM-DD HH:mm:ss').length * labelFontSize / 2;
    tickCount = Math.max(Math.floor(len / (labelWidth * 3 / 2)), 2);
  }

  if (tickCount) {
    // console.log(tickCount);
    def.tickCount = tickCount;
  }
}

function convertFontSize(fontSize) {
  var size = fontSize;
  if (typeof size === 'string') {
    size = size.replace('px', '');
  }
  if (isInvalidNumber(size)) {
    return pxToNumber(themes['widgets-font-size-1']);
  } else {
    return Number(size);
  }
}