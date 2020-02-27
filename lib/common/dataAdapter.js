'use strict';

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

import { View } from '@antv/data-set';

// 直方图数据转换
function parseHistItem(oneData, config) {
  var dataName = oneData.name,
      visible = oneData.visible,
      groupExtra = _objectWithoutProperties(oneData, ['name', 'visible']);

  var binWidth = config.binWidth,
      normalize = config.normalize;


  var dv = new View().source(oneData.data.map(function (value) {
    return { value: value };
  }));
  dv.transform({
    type: 'bin.histogram',
    field: 'value',
    binWidth: binWidth,
    as: ['x', 'y']
  });

  var factor = normalize ? dv.rows.reduce(function (acc, cur) {
    return acc + cur.y;
  }, 0) : 1;

  return dv.rows.map(function (_ref) {
    var x = _ref.x,
        y = _ref.y;
    return {
      x: x,
      y: y / factor,
      extra: [],
      groupExtra: groupExtra,
      visible: visible,
      type: dataName
    };
  });
}

// 烛形图数据转换
function parseCandlestickItem(oneData, config) {
  var dataName = oneData.name,
      facet = oneData.facet,
      dodge = oneData.dodge,
      visible = oneData.visible,
      groupExtra = _objectWithoutProperties(oneData, ['name', 'facet', 'dodge', 'visible']);

  return oneData.data.map(function (_ref2) {
    var date = _ref2[0],
        _ref2$ = _ref2[1],
        start = _ref2$.start,
        end = _ref2$.end,
        max = _ref2$.max,
        min = _ref2$.min,
        extra = _objectWithoutProperties(_ref2$, ['start', 'end', 'max', 'min']);

    return {
      x: date,
      y: [start, end, max, min],
      start: start,
      end: end,
      max: max,
      min: min,
      trend: start <= end ? 'up' : 'down',
      extra: extra,
      groupExtra: groupExtra,
      facet: facet,
      dodge: dodge,
      visible: visible,
      type: dataName
    };
  });
}

export default function highchartsDataToG2Data(data, config, chartName) {
  if (!data) {
    return [];
  }
  if (!Array.isArray(data)) {
    data = [data];
  }
  var newData = [];
  if (Array.isArray(config.yAxis)) {
    data.forEach(function (oneData) {
      if (!oneData || !Array.isArray(oneData.data)) {
        return;
      }

      var dataName = oneData.name,
          _oneData$yAxis = oneData.yAxis,
          yIndex = _oneData$yAxis === undefined ? 0 : _oneData$yAxis,
          dodge = oneData.dodge,
          visible = oneData.visible,
          groupExtra = _objectWithoutProperties(oneData, ['name', 'yAxis', 'dodge', 'visible']);

      oneData.data.forEach(function (d, i) {
        if (Array.isArray(d)) {
          var _newData$push;

          var x = d[0],
              y = d[1],
              extra = d.slice(2);

          newData.push((_newData$push = {
            x: x
          }, _newData$push['y' + yIndex] = y, _newData$push.extra = extra, _newData$push.groupExtra = groupExtra, _newData$push.dodge = dodge, _newData$push.visible = visible, _newData$push.type = dataName, _newData$push));
        } else if (config.xAxis && config.xAxis.categories && config.xAxis.categories[i]) {
          var _newData$push2;

          var _x = config.xAxis.categories[i];
          var _y = isNaN(d) ? d[0] : d;
          newData.push((_newData$push2 = {
            x: _x
          }, _newData$push2['y' + yIndex] = _y, _newData$push2.extra = [], _newData$push2.groupExtra = groupExtra, _newData$push2.dodge = dodge, _newData$push2.visible = visible, _newData$push2.type = dataName, _newData$push2));
        } else {
          var _newData$push3;

          var _x2 = d.x,
              _y2 = d.y,
              _extra = _objectWithoutProperties(d, ['x', 'y']);

          newData.push((_newData$push3 = {
            x: _x2
          }, _newData$push3['y' + yIndex] = _y2, _newData$push3.extra = _extra, _newData$push3.groupExtra = groupExtra, _newData$push3.dodge = dodge, _newData$push3.visible = visible, _newData$push3.type = dataName, _newData$push3));
        }
      });
    });
  } else {
    data.forEach(function (oneData) {
      if (!oneData || !Array.isArray(oneData.data)) {
        return;
      }

      var dataName = oneData.name,
          facet = oneData.facet,
          dodge = oneData.dodge,
          visible = oneData.visible,
          groupExtra = _objectWithoutProperties(oneData, ['name', 'facet', 'dodge', 'visible']);

      // 若为直方图


      if (oneData.data.every(function (x) {
        return typeof x === 'number';
      }) && chartName === 'G2Histogram') {
        newData.push.apply(newData, parseHistItem(oneData, config));
        return;
      }

      // 若为烛形图
      if (chartName === 'G2Candlestick' && oneData.data.every(function (x) {
        return Array.isArray(x) && x[1] && x[1].start && x[1].end && x[1].max && x[1].min;
      })) {
        newData.push.apply(newData, parseCandlestickItem(oneData, config));
        return;
      }

      oneData.data.forEach(function (d, i) {
        if (Array.isArray(d)) {
          var x = d[0],
              y = d[1],
              extra = d.slice(2);

          newData.push({
            x: x,
            y: y,
            extra: extra,
            groupExtra: groupExtra,
            facet: facet,
            dodge: dodge,
            visible: visible,
            type: dataName
          });
        } else if (config.xAxis && config.xAxis.categories && config.xAxis.categories[i]) {
          var _x3 = config.xAxis.categories[i];
          var _y3 = isNaN(d) ? d[0] : d;
          newData.push({
            x: _x3,
            y: _y3,
            extra: [],
            groupExtra: groupExtra,
            facet: facet,
            dodge: dodge,
            visible: visible,
            type: dataName
          });
        } else {
          var _x4 = d.x,
              _y4 = d.y,
              _extra2 = _objectWithoutProperties(d, ['x', 'y']);

          newData.push({
            x: _x4,
            y: _y4,
            extra: _extra2,
            groupExtra: groupExtra,
            facet: facet,
            dodge: dodge,
            visible: visible,
            type: dataName
          });
        }
      });
    });
  }

  return newData;
}