var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

import React from 'react';
import { Wmap, DataSet, pluginManager } from '@alife/aisc-widgets';
import worldGeo from './data/world-without-antarctic.json';

var defaultWorldProjection = DataSet.View.prototype.getGeoProjection('geoEquirectangular');

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
  return React.createElement(
    Wmap,
    _extends({ geoData: geoData || worldGeo, config: newConfig }, other),
    children
  );
}

WorldMap.Area = Wmap.Area;
WorldMap.Point = Wmap.Point;
WorldMap.HeatMap = Wmap.HeatMap;
WorldMap.Shoot = Wmap.Shoot;
WorldMap.Custom = Wmap.Custom;

WorldMap.isG2Chart = true;

if (pluginManager) {
  pluginManager.register('WorldMap', WorldMap);
}

export default WorldMap;