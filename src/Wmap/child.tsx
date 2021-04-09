import { VoidFunctionComponent, ReactNode } from 'react';
import {  Types, ChartData } from '../common/types';
// import Wmap, { WmapConfig } from "./index";
// import { provinceName } from "./mapData/chinaGeoInfo";
// import * as React from "react";

export interface MapChildProps {
  data?: ChartData;
  config?: Types.LooseObject;
}

// class ChildBase {
//   parent: Wmap = null;
//
//   init (ctx: Wmap, config: WmapConfig, data: ChartData) {
//     this.parent = ctx;
//   }
//
//   changeData(data: ChartData) {}
// }

export const AREA_NAME = 'MapArea';
export const MapArea: VoidFunctionComponent<MapChildProps> = () => { return null; };
MapArea.displayName = AREA_NAME;

// class Area extends ChildBase {
//   init (ctx: Wmap, config: WmapConfig, data: ChartData) {
//     super.init(ctx, config, data);
//
//     const { chart, ds } = ctx;
//
//     const areaMapDataView = ds
//       .createView()
//       .source(data)
//       .transform({
//         type: 'map',
//         callback(obj) {
//           const { name, type, ...others } = obj;
//           return {
//             // @ts-ignore 将省份全称转化为简称
//             name: provinceName[name] ? provinceName[name] : name,
//             type: String(type),
//             ...others,
//           };
//         },
//       })
//       .transform({
//         geoDataView: ctx.bgMapDataView,
//         field: 'name',
//         type: 'geo.region',
//         as: ['x', 'y'],
//       });
//
//     const areaMapView = chart.createView({
//       padding: 0,
//     });
//     areaMapView.data(areaMapDataView.rows);
//     /*const areaGeom = */areaMapView
//       .polygon()
//       .position('x*y')
//       // 如果用连续型颜色，需要对数组倒序，否则颜色对应的数值会从小开始
//       .color('type', config.areaColors.join('-'))
//       // .opacity('value')
//       .tooltip('name*value', (name, value) => ({
//         name,
//         value,
//       }));
//
//     if (config.geomStyle) {
//       // areaGeom.style('name*value', config.geomStyle);
//     }
//
//     ctx.areaMapDataView = areaMapDataView;
//     ctx.areaMapView = areaMapView;
//   }
//
//   // changeConfig(config) {
//   //
//   // }
//
//   changeData(data: ChartData) {
//     const { areaMapDataView } = this.parent;
//     if (areaMapDataView.origin !== data) {
//       areaMapDataView.source(data);
//     }
//   }
// }

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

// function reactMapChild(child: Area) {
//   return class ReactMapChild extends React.Component<MapChildProps> {
//     static displayName = '';
//
//
//
//     render(): null {
//       return null;
//     }
//   }
// }
