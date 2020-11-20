'use strict';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = highchartsDataToG2Data;

var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutPropertiesLoose"));

/**
 * drawLine 绘制线图逻辑
 *
 * @param {DataAdapterData|DataAdapterData[]} data 原始数据
 * @param {DataAdapterConfig} config 配置项
 * @param {dataFields} dataFields 数据字段映射规则
 *
 * @return {Array} json-array 型数据
 * */
function highchartsDataToG2Data(data, config, dataFields) {
  if (!data) {
    return [];
  }

  if (!Array.isArray(data)) {
    data = [data];
  }

  var _ref = dataFields || {},
      _ref$type = _ref.type,
      typeField = _ref$type === void 0 ? 'type' : _ref$type;

  var newData = [];

  if (Array.isArray(config.yAxis)) {
    data.forEach(function (oneData) {
      if (!oneData || !Array.isArray(oneData.data)) {
        return;
      }

      var dataName = oneData.name,
          _oneData$yAxis = oneData.yAxis,
          yIndex = _oneData$yAxis === void 0 ? 0 : _oneData$yAxis,
          dodge = oneData.dodge,
          visible = oneData.visible,
          groupExtra = (0, _objectWithoutPropertiesLoose2["default"])(oneData, ["name", "yAxis", "dodge", "visible"]);
      oneData.data.forEach(function (d, i) {
        if (Array.isArray(d)) {
          var _newData$push;

          var x = d[0],
              y = d[1],
              extra = d.slice(2);
          newData.push((_newData$push = {
            x: x
          }, _newData$push["y" + yIndex] = y, _newData$push.extra = extra, _newData$push.groupExtra = groupExtra, _newData$push.dodge = dodge, _newData$push.visible = visible, _newData$push[typeField] = dataName, _newData$push));
        } else if (config.xAxis && config.xAxis.categories && config.xAxis.categories[i]) {
          var _newData$push2;

          var _x = config.xAxis.categories[i];

          var _y = typeof d === 'number' ? d : d[0];

          newData.push((_newData$push2 = {
            x: _x
          }, _newData$push2["y" + yIndex] = _y, _newData$push2.extra = [], _newData$push2.groupExtra = groupExtra, _newData$push2.dodge = dodge, _newData$push2.visible = visible, _newData$push2[typeField] = dataName, _newData$push2));
        } else {
          var _newData$push3;

          var _x2 = d.x,
              _y2 = d.y,
              _extra = (0, _objectWithoutPropertiesLoose2["default"])(d, ["x", "y"]);

          newData.push((_newData$push3 = {
            x: _x2
          }, _newData$push3["y" + yIndex] = _y2, _newData$push3.extra = _extra, _newData$push3.groupExtra = groupExtra, _newData$push3.dodge = dodge, _newData$push3.visible = visible, _newData$push3[typeField] = dataName, _newData$push3));
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
          groupExtra = (0, _objectWithoutPropertiesLoose2["default"])(oneData, ["name", "facet", "dodge", "visible"]);
      oneData.data.forEach(function (d, i) {
        if (Array.isArray(d)) {
          var _newData$push4;

          var x = d[0],
              y = d[1],
              extra = d.slice(2);
          newData.push((_newData$push4 = {
            x: x,
            y: y,
            extra: extra,
            groupExtra: groupExtra,
            facet: facet,
            dodge: dodge,
            visible: visible
          }, _newData$push4[typeField] = dataName, _newData$push4));
        } else if (config.xAxis && config.xAxis.categories && config.xAxis.categories[i]) {
          var _newData$push5;

          var _x3 = config.xAxis.categories[i];

          var _y3 = typeof d === 'number' ? d : d[0];

          newData.push((_newData$push5 = {
            x: _x3,
            y: _y3,
            extra: [],
            groupExtra: groupExtra,
            facet: facet,
            dodge: dodge,
            visible: visible
          }, _newData$push5[typeField] = dataName, _newData$push5));
        } else if (typeof d === 'number') {
          var _newData$push6;

          newData.push((_newData$push6 = {
            x: d,
            y: d,
            groupExtra: groupExtra,
            visible: visible
          }, _newData$push6[typeField] = dataName, _newData$push6));
        } else {
          var _newData$push7;

          var _x4 = d.x,
              _y4 = d.y,
              _extra2 = (0, _objectWithoutPropertiesLoose2["default"])(d, ["x", "y"]);

          newData.push((_newData$push7 = {
            x: _x4,
            y: _y4,
            extra: _extra2,
            groupExtra: groupExtra,
            facet: facet,
            dodge: dodge,
            visible: visible
          }, _newData$push7[typeField] = dataName, _newData$push7));
        }
      });
    });
  }

  return newData;
}