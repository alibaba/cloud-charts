'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _cloudCharts = require('@alicloud/cloud-charts');

var _worldWithoutAntarctic = require('./data/world-without-antarctic.json');

var _worldWithoutAntarctic2 = _interopRequireDefault(_worldWithoutAntarctic);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var defaultWorldProjection = _cloudCharts.DataSet.View.prototype.getGeoProjection('geoEquirectangular');

function WorldMap(props) {
  var geoData = props.geoData,
      children = props.children,
      config = props.config,
      other = _objectWithoutProperties(props, ['geoData', 'children', 'config']);

  var newConfig = _extends({}, config || {});
  if (newConfig.showSouthChinaSea === undefined || newConfig.showSouthChinaSea) {
    newConfig.showSouthChinaSea = false;
  }
  if (!newConfig.projection) {
    newConfig.projection = defaultWorldProjection;
  }
  if (!newConfig.padding) {
    newConfig.padding = [0, 0, 0, 0];
  }
  return _react2.default.createElement(
    _cloudCharts.Wmap,
    _extends({ geoData: geoData || _worldWithoutAntarctic2.default, config: newConfig }, other),
    children
  );
}

WorldMap.Area = _cloudCharts.Wmap.Area;
WorldMap.Point = _cloudCharts.Wmap.Point;
WorldMap.HeatMap = _cloudCharts.Wmap.HeatMap;
WorldMap.Shoot = _cloudCharts.Wmap.Shoot;
WorldMap.Custom = _cloudCharts.Wmap.Custom;

WorldMap.worldGeoData = _worldWithoutAntarctic2.default;

WorldMap.isG2Chart = true;

if (_cloudCharts.pluginManager) {
  _cloudCharts.pluginManager.register('WorldMap', WorldMap);
}

exports.default = WorldMap;