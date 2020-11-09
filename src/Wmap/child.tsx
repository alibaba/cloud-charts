import { VoidFunctionComponent, ReactNode } from 'react';
import {  Types, ChartData } from '../common/types';

export interface MapChildProps {
  data?: ChartData;
  config?: Types.LooseObject;
}

export const AREA_NAME = 'MapArea';
export const MapArea: VoidFunctionComponent<MapChildProps> = () => { return null; };
MapArea.displayName = AREA_NAME;

export const POINT_NAME = 'MapPoint';
export const MapPoint: VoidFunctionComponent<MapChildProps> = () => { return null; };
MapPoint.displayName = POINT_NAME;

export const HEAT_MAP_NAME = 'MapHeatMap';
export const MapHeatMap: VoidFunctionComponent<MapChildProps> = () => { return null; };
MapHeatMap.displayName = HEAT_MAP_NAME;

export const SHOOT_NAME = 'MapShoot';
export const MapShoot: VoidFunctionComponent<MapChildProps> = () => { return null; };
MapShoot.displayName = SHOOT_NAME;

interface CustomMapChildProps extends MapChildProps {
  render?(data: any, index: number): ReactNode;
}
export const CUSTOM_NAME = 'MapCustom';
export const MapCustom: VoidFunctionComponent<CustomMapChildProps> = () => { return null; };
MapCustom.displayName = CUSTOM_NAME;

export type MapChild = typeof MapArea | typeof MapPoint | typeof MapHeatMap | typeof MapShoot | typeof MapCustom;

