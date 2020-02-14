'use strict';

import { View } from '@antv/data-set';

// 直方图数据转换
function parseHistItem(oneData, config) {
  const { name: dataName, facet, dodge, visible, ...groupExtra } = oneData;
  const { binWidth = 1, normalize = false } = config.histogram;

  const dv = new View().source(oneData.data.map(value => ({ value })));
  dv.transform({
    type: 'bin.histogram',
    field: 'value',
    binWidth,
    as: ['x', 'y'],
  });

  const factor = normalize ? dv.rows.reduce((acc, cur) => acc + cur.y, 0) : 1;

  return dv.rows.map(({ x, y }) => ({
    x,
    y: y / factor,
    extra: [],
    groupExtra,
    facet,
    dodge,
    visible,
    type: dataName,
  }));
}

// 烛形图数据转换
function parseCandlestickItem(oneData, config) {
  const { name: dataName, facet, dodge, visible, ...groupExtra } = oneData;

  return oneData.data.map(([date, { start, end, max, min, ...extra }]) => ({
    x: date,
    y: [start, end, max, min],
    start,
    end,
    max,
    min,
    trend: start <= end ? 'up' : 'down',
    extra,
    groupExtra,
    facet,
    dodge,
    visible,
    type: dataName,
  }));
}

export default function highchartsDataToG2Data(data, config, chartName) {
  if (!data) {
    return [];
  }
  if (!Array.isArray(data)) {
    data = [data];
  }
  const newData = [];
  if (Array.isArray(config.yAxis)) {
    data.forEach(oneData => {
      if (!oneData || !Array.isArray(oneData.data)) {
        return;
      }

      const {
        name: dataName,
        yAxis: yIndex = 0,
        dodge,
        visible,
        ...groupExtra
      } = oneData;

      oneData.data.forEach((d, i) => {
        if (Array.isArray(d)) {
          const [x, y, ...extra] = d;
          newData.push({
            x,
            [`y${yIndex}`]: y,
            extra,
            groupExtra,
            dodge,
            visible,
            type: dataName,
          });
        } else if (
          config.xAxis &&
          config.xAxis.categories &&
          config.xAxis.categories[i]
        ) {
          const x = config.xAxis.categories[i];
          const y = isNaN(d) ? d[0] : d;
          newData.push({
            x,
            [`y${yIndex}`]: y,
            extra: [],
            groupExtra,
            dodge,
            visible,
            type: dataName,
          });
        } else {
          const { x, y, ...extra } = d;
          newData.push({
            x,
            [`y${yIndex}`]: y,
            extra,
            groupExtra,
            dodge,
            visible,
            type: dataName,
          });
        }
      });
    });
  } else {
    data.forEach(oneData => {
      if (!oneData || !Array.isArray(oneData.data)) {
        return;
      }

      const { name: dataName, facet, dodge, visible, ...groupExtra } = oneData;

      // 若为直方图
      if (oneData.data.every(x => typeof x === 'number') && config.histogram) {
        newData.push(...parseHistItem(oneData, config));
        return;
      }

      // 若为烛形图
      if (
        chartName === 'G2Candlestick' &&
        oneData.data.every(
          x =>
            Array.isArray(x) &&
            x[1] &&
            x[1].start &&
            x[1].end &&
            x[1].max &&
            x[1].min
        )
      ) {
        newData.push(...parseCandlestickItem(oneData, config));
        return;
      }

      oneData.data.forEach((d, i) => {
        if (Array.isArray(d)) {
          const [x, y, ...extra] = d;
          newData.push({
            x,
            y,
            extra,
            groupExtra,
            facet,
            dodge,
            visible,
            type: dataName,
          });
        } else if (
          config.xAxis &&
          config.xAxis.categories &&
          config.xAxis.categories[i]
        ) {
          const x = config.xAxis.categories[i];
          const y = isNaN(d) ? d[0] : d;
          newData.push({
            x,
            y,
            extra: [],
            groupExtra,
            facet,
            dodge,
            visible,
            type: dataName,
          });
        } else {
          const { x, y, ...extra } = d;
          newData.push({
            x,
            y,
            extra,
            groupExtra,
            facet,
            dodge,
            visible,
            type: dataName,
          });
        }
      });
    });
  }

  return newData;
}
