'use strict';

import label from './label';

export default function drawLine(chart, config, lineShape, areaShape, yAxisKey = 'y') {
  const geomStyle = config.geomStyle || {};
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
  if (config.symbol && config.area && config.stack) {
    chart.point().adjust('stack').position(['x', yAxisKey]).color('type', config.colors).shape('circle').size(3).active(false);
  } else if (config.symbol) {
    chart.point().position(['x', yAxisKey]).color('type', config.colors).shape('circle').size(3).active(false);
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
