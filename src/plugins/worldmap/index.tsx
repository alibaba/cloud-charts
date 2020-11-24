import * as React from 'react';
// @ts-ignore
import { Wmap, pluginManager } from '@alife/aisc-widgets';
// @ts-ignore
import worldGeo from './data/world-without-antarctic.json';
import { MapProps } from '../../Wmap';

const defaultWorldProjection = Wmap.getGeoProjection('geoEquirectangular');

function WorldMap (props: MapProps) {
  const { geoData, children, config, ...other } = props;
  const newConfig = Object.assign({}, config || {});
  if (newConfig.showSouthChinaSea === undefined || newConfig.showSouthChinaSea) {
    newConfig.showSouthChinaSea = false;
  }
  if (!newConfig.projection) {
    newConfig.projection = defaultWorldProjection;
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
WorldMap.Shoot = Wmap.Shoot;
WorldMap.Custom = Wmap.Custom;

WorldMap.worldGeoData = worldGeo;

WorldMap.isG2Chart = true;

if (pluginManager) {
  pluginManager.register('WorldMap', WorldMap);
}

export default WorldMap;
