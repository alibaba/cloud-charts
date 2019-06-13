'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _aiscWidgets = require('@alife/aisc-widgets');

var _worldWithoutAntarctic = require('./data/world-without-antarctic.json');

var _worldWithoutAntarctic2 = _interopRequireDefault(_worldWithoutAntarctic);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

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
    var projection = _aiscWidgets.DataSet.View.prototype.getGeoProjection('geoEquirectangular');

    newConfig.projection = projection;
  }
  if (!newConfig.padding) {
    newConfig.padding = [0, 0, 0, 0];
  }
  return _react2.default.createElement(
    _aiscWidgets.Wmap,
    _extends({ geoData: geoData || _worldWithoutAntarctic2.default, config: newConfig }, other),
    children
  );
}

WorldMap.Area = _aiscWidgets.Wmap.Area;
WorldMap.Point = _aiscWidgets.Wmap.Point;
WorldMap.HeatMap = _aiscWidgets.Wmap.HeatMap;
WorldMap.Custom = _aiscWidgets.Wmap.Custom;

if (_aiscWidgets.pluginManager) {
  _aiscWidgets.pluginManager.register('WorldMap', WorldMap);
}

exports.default = WorldMap;
module.exports = exports['default'];