'use strict';

/**
 * drawLine 绘制线图逻辑
 *
 * @param {Object|Array} data 原始数据
 * @param {Object} config 配置项
 *
 * @return {Array} json-array 型数据
 * */

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

export default function highchartsDataToG2Data(data, config) {
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
        } else if (!isNaN(d)) {
          newData.push({
            x: d,
            y: d,
            groupExtra: groupExtra,
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