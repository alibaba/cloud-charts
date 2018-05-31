'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = highchartsDataToG2Data;

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); }

function highchartsDataToG2Data(data, config) {
  if (!data) {
    return [];
  }
  if (!Array.isArray(data)) {
    data = [data];
  }
  var newData = [];
  if (Array.isArray(config.yAxis)) {
    data.forEach(function (oneData) {
      var dataName = oneData.name,
          _oneData$yAxis = oneData.yAxis,
          yIndex = _oneData$yAxis === undefined ? 0 : _oneData$yAxis;


      if (!Array.isArray(oneData.data)) {
        return;
      }

      oneData.data.forEach(function (d, i) {
        if (Array.isArray(d)) {
          var _newData$push;

          var _d = _toArray(d),
              x = _d[0],
              y = _d[1],
              extra = _d.slice(2);

          newData.push((_newData$push = {
            x: x
          }, _defineProperty(_newData$push, 'y' + yIndex, y), _defineProperty(_newData$push, 'extra', extra), _defineProperty(_newData$push, 'type', dataName), _newData$push));
        } else if (config.xAxis && config.xAxis.categories && config.xAxis.categories[i]) {
          var _newData$push2;

          var _x = config.xAxis.categories[i];
          var _y = isNaN(d) ? d[0] : d;
          newData.push((_newData$push2 = {
            x: _x
          }, _defineProperty(_newData$push2, 'y' + yIndex, _y), _defineProperty(_newData$push2, 'extra', []), _defineProperty(_newData$push2, 'type', dataName), _newData$push2));
        } else {
          var _newData$push3;

          var _x2 = d.x,
              _y2 = d.y,
              _extra = _objectWithoutProperties(d, ['x', 'y']);

          newData.push((_newData$push3 = {
            x: _x2
          }, _defineProperty(_newData$push3, 'y' + yIndex, _y2), _defineProperty(_newData$push3, 'extra', _extra), _defineProperty(_newData$push3, 'type', dataName), _newData$push3));
        }
      });
    });
  } else {
    data.forEach(function (oneData) {
      var dataName = oneData.name;


      if (!Array.isArray(oneData.data)) {
        return;
      }

      oneData.data.forEach(function (d, i) {
        if (Array.isArray(d)) {
          var _d2 = _toArray(d),
              x = _d2[0],
              y = _d2[1],
              extra = _d2.slice(2);

          newData.push({
            x: x,
            y: y,
            extra: extra,
            type: dataName
          });
        } else if (config.xAxis && config.xAxis.categories && config.xAxis.categories[i]) {
          var _x3 = config.xAxis.categories[i];
          var _y3 = isNaN(d) ? d[0] : d;
          newData.push({
            x: _x3,
            y: _y3,
            extra: [],
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
            type: dataName
          });
        }
      });
    });
  }
  return newData;
}
module.exports = exports['default'];