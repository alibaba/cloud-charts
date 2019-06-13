import React from 'react';
import { Wmap, DataSet, pluginManager } from '@alife/aisc-widgets';
import worldGeo from './data/world-without-antarctic.json';

function WorldMap (props) {
  const { geoData, children, config, ...other } = props;
  const newConfig = Object.assign({}, config || {});
  if (newConfig.showSouthChinaSea === undefined || newConfig.showSouthChinaSea) {
    newConfig.showSouthChinaSea = false;
  }
  if (!newConfig.projection) {
    const projection = DataSet.View.prototype.getGeoProjection('geoEquirectangular');

    newConfig.projection = projection;
  }
  if (!newConfig.padding) {
    newConfig.padding = [0, 0, 0, 0];
  }
  return (
    <Wmap geoData={geoData || worldGeo} config={newConfig} {...other}>
      {children}
    </Wmap>
  );
}

WorldMap.Area = Wmap.Area;
WorldMap.Point = Wmap.Point;
WorldMap.HeatMap = Wmap.HeatMap;
WorldMap.Custom = Wmap.Custom;

if (pluginManager) {
  pluginManager.register('WorldMap', WorldMap);
}

export default WorldMap;