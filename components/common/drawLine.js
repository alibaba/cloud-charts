'use strict';

import G2 from '@antv/g2';
import label from './label';

export default function drawLine(chart, config, lineShape, areaShape, yAxisKey = 'y') {
  const lineWidth = config.lineWidth;
  const geomStyle = config.geomStyle || {};
  if (lineWidth && geomStyle.lineWidth === undefined) {
    geomStyle.lineWidth = lineWidth;
  }

  let areaColors = config.areaColors || config.colors;
  if (Array.isArray(config.colors) && Array.isArray(config.areaColors)) {
    areaColors = mergeArray([], config.colors, config.areaColors);
  }

  let lineGeom = null;

  if (config.area && config.stack) {
    chart.areaStack().position(['x', yAxisKey]).color('type', areaColors).shape(areaShape).active(false);
    lineGeom = chart.lineStack().position(['x', yAxisKey]).color('type', config.colors).shape(lineShape).active(false).style('x*y*type*extra', {
      lineJoin: 'round',
      ...geomStyle
    });
  } else if (config.area && !config.stack) {
    chart.area().position(['x', yAxisKey]).color('type', areaColors).shape(areaShape).active(false);
    lineGeom = chart.line().position(['x', yAxisKey]).color('type', config.colors).shape(lineShape).active(false).style('x*y*type*extra', {
      lineJoin: 'round',
      ...geomStyle
    });
  } else {
    lineGeom = chart.line().position(['x', yAxisKey]).color('type', config.colors).shape(lineShape).active(false).style('x*y*type*extra', {
      lineJoin: 'round',
      ...geomStyle
    });
  }

  label(lineGeom, config, yAxisKey);

  // 曲线默认点
  let pointGeom = null;
  if (config.symbol) {
    if (config.area && config.stack) {
      pointGeom = chart.point().adjust('stack').position(['x', yAxisKey]).color('type', config.colors).shape('circle').active(false);
    } else {
      pointGeom = chart.point().position(['x', yAxisKey]).color('type', config.colors).shape('circle').active(false);
    }

    let sizeConfig = config.symbol.size || 3;
    if (Array.isArray(sizeConfig)) {
      sizeConfig = [yAxisKey, sizeConfig];
    } else if (G2.Util.isFunction(sizeConfig)) {
      sizeConfig = ['type', sizeConfig];
    } else if (typeof sizeConfig === 'object') {
      sizeConfig = [sizeConfig.field, sizeConfig.param];
    } else {
      sizeConfig = [sizeConfig];
    }
    pointGeom.size(...sizeConfig);

    if (config.symbol.geomStyle) {
      pointGeom.style('x*y*type*extra', config.symbol.geomStyle);
    }
  }
}

function mergeArray(target, ...source) {
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
