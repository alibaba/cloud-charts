'use strict';

import * as React from 'react';
// DataSet
import { DataSet } from '@antv/data-set/lib/data-set';
import { View as DataView } from '@antv/data-set/lib/view';
import '@antv/data-set/lib/api/statistics';
import '@antv/data-set/lib/api/geo';
import '@antv/data-set/lib/connector/geojson';
import '@antv/data-set/lib/transform/map';
import '@antv/data-set/lib/transform/filter';
import '@antv/data-set/lib/transform/geo/projection';
import '@antv/data-set/lib/transform/geo/region';
import { Chart, View, Types, BaseChartConfig, ChartData } from '../common/types';
import Base, { ChartProps, rootClassName } from "../common/Base";
import errorWrap from '../common/errorWrap';
// @ts-ignore
import chinaGeo from './mapData/chinaGeo.json';
import SouthChinaSea from './mapData/southChinaSea';
import { provinceName, positionMap } from './mapData/chinaGeoInfo';
import themes from '../themes/index';
import rectTooltip, { TooltipConfig } from '../common/rectTooltip';
import rectLegend, { LegendConfig } from '../common/rectLegend';
import label, { LabelConfig } from "../common/label";
import geomSize, { GeomSizeConfig } from '../common/geomSize';
import geomStyle, { GeomStyleConfig } from '../common/geomStyle';
import {
  MapChild,
  MapArea,
  MapPoint,
  MapHeatMap,
  MapShoot,
  MapCustom
} from './child';
import './index.scss';
import Wshoot, { ShootProps } from "../Wshoot";
import { FullCrossName } from '../constants';

// 这几个地点太小，需要特殊处理边框颜色
const minArea = ['钓鱼岛', '赤尾屿', '香港', '澳门'];
// 这几个地点需要特殊处理标签的文字大小
const minLabel = ['钓鱼岛', '赤尾屿'];

// 特殊处理一些地区的label
const fixLngLatMap = {
  甘肃: [104.4948862, 35.0248462],
  河北: [115.5193875, 38.3062153],
  天津: [118.2141694, 38.8206246],
  澳门: [113.2573035, 21.7906005],
  香港: [114.9040905, 21.9265955],
  陕西: [108.5133047, 33.8799429],
  上海: [122.2818331, 31.0480268],
};



interface WmapConfig extends BaseChartConfig {
  background?: {
    fill?: string;
    stroke?: string;
  };
  areaColors?: string[];
  pointColors?: string[];
  heatColors?: string;
  showSouthChinaSea?: boolean;
  type?: string;
  projection?: Function;

  legend?: LegendConfig | boolean,
  tooltip?: TooltipConfig | boolean,
  /** @deprecated labels 已废弃，请使用 label */
  labels?: LabelConfig | boolean;
  label?: LabelConfig | boolean;
  size?: GeomSizeConfig;
  geomStyle?: GeomStyleConfig;
}

export interface MapProps extends ChartProps<WmapConfig> {
  geoData?: any;
  children?: MapChild;
}

interface MapState {
  customPointLayer: CustomProps[];
  shootLayer: ShootProps[];
  southChinaSeaKey: number;
}

interface CustomProps {
  data: MapData;
  render(data: Types.LooseObject, index: number, otherProps: any): React.ReactNode;
}

export class Map extends Base<WmapConfig, MapProps> {
  public static Area = MapArea;
  public static Point = MapPoint;
  public static HeatMap = MapHeatMap;
  public static Shoot = MapShoot;
  public static Custom = MapCustom;

  // 元数据
  public static chinaGeoData = chinaGeo;
  public static provinceName = provinceName;
  public static positionMap = positionMap;

  public static getGeoProjection = DataSet.View.prototype.getGeoProjection;

  state: MapState = {
    customPointLayer: [],
    shootLayer: [],
    southChinaSeaKey: 0,
  };

  componentDidMount() {
    super.componentDidMount();

    this.convertChildren(this.props.children, this.props.config, true);
  }

  componentDidUpdate(prevProps: MapProps) {
    if (!this.isReRendering && this.props.children !== prevProps.children) {
      this.convertChildren(this.props.children, this.props.config);
    }

    super.componentDidUpdate(prevProps);
  }

  shouldComponentUpdate() {
    return !(this.isReRendering || !this.chart);
  }

  rerender() {
    // fix: 动态切换主题后南海诸岛地图没有更新
    if (this.props.config.showSouthChinaSea === undefined || this.props.config.showSouthChinaSea) {
      this.setState({
        southChinaSeaKey: this.state.southChinaSeaKey + 1,
      });
    }
    return super.rerender();
  }

  convertPosition = (d: Types.LooseObject) => {
    if (!d) {
      return undefined;
    }
    let point = convertPointPosition(this, d);
    return this.bgMapView.getXY(point);
  };

  convertChildren(children = this.props.children, config = this.props.config, isInit = false) {
    const customPointLayer: CustomProps[] = [];
    const shootLayer: ShootProps[] = [];
    React.Children.forEach(children, (child) => {
      if (!child) {
        return;
      }
      // @ts-ignore
      const { props, type } = child;

      if (type.displayName === MapCustom.displayName) {
        let newData = props.data;
        if (Array.isArray(newData)) {
          newData = newData.map((d) => {
            const position = this.convertPosition(d ? { ...d } : null);
            if (!position) {
              return null;
            }
            return { ...d, x: position.x, y: position.y };
          });
        }
        customPointLayer.push({ ...props, data: newData });
        return;
      }
      if (type.displayName === MapShoot.displayName) {
        // 数据转换在 Shoot 内部完成
        shootLayer.push(props);
        return;
      }

      if (!isInit) {
        const { data, ...propsConfig } = props;
        const layerConfig = Object.assign({}, config, propsConfig);

        this.changeChildData(this.chart, layerConfig, type.displayName, data);
      }
    });
    this.setState({
      customPointLayer,
      shootLayer,
    });
  }

  renderCustomPointLayer(layer: CustomProps, layerIndex: number) {
    if (!this.chart) {
      return null;
    }
    const { data, render, ...otherProps } = layer;

    return (
      <div key={layerIndex} className={`${FullCrossName}-map-custom-container`}>
        {
          Array.isArray(data) && data.map((d, i) => {
            if (!d) {
              return null;
            }

            const pointStyle = {
              left: d.x,
              top: d.y,
            };
            return (
              <div key={i} className={`${FullCrossName}-map-custom-point`} style={pointStyle}>
                {render && render(d, i, otherProps)}
              </div>
            );
          })
        }
      </div>
    );
  }

  renderShootLayer(shootProps: ShootProps, shootIndex: number) {
    if (!this.chart) {
      return null;
    }
    const { className, style, ...otherShootProps } = shootProps;
    const { width: chartWidth, height: chartHeight } = this.chart;
    // const [width, height] = this.bgMapSize;
    // const layerStyle = {
    //   left: (chartWidth - width) / 2,
    //   top: (chartHeight - height) / 2,
    //   width,
    //   height,
    //   ...(style || {})
    // };

    return (
      <Wshoot
        key={shootIndex}
        className={`${FullCrossName}-map-shoot ${className || ''}`}
        width={chartWidth}
        height={chartHeight}
        style={style}
        getPosition={this.convertPosition}
        {...otherShootProps}
      />
    );
  }

  renderSouthChinaSea(config: WmapConfig) {
    if (config.showSouthChinaSea === undefined || config.showSouthChinaSea) {
      const { southChinaSeaKey } = this.state;
      const { fill } = config.background || {};
      const mapColor = fill || themes['widgets-map-area-bg'];

      return <SouthChinaSea key={southChinaSeaKey} className={`${FullCrossName}-map-south-china-sea`} fontColor={mapColor} landColor={mapColor} lineColor={mapColor} boxColor={mapColor} islandColor={mapColor} />;
    } else {
      return null;
    }
  }

  render() {
    const { className = '', style, children, data, width, height, padding, geoData, config, language, ...otherProps } = this.props;
    const { customPointLayer, shootLayer } = this.state;
    return (
      <div ref={dom => this.chartDom = dom} id={this.chartId} className={rootClassName + 'G2Map ' + className} style={style} {...otherProps}>
        {this.renderSouthChinaSea(config)}
        {
          shootLayer.length > 0 && shootLayer.map((shoot, i) => {
            return this.renderShootLayer(shoot, i);
          })
        }
        {
          customPointLayer.length > 0 && customPointLayer.map((layer, i) => {
            return this.renderCustomPointLayer(layer, i);
          })
        }
      </div>
    );
  }

  chartName = 'G2Map';

  convertData = false;

  getDefaultConfig(): WmapConfig {
    return {
      padding: [20, 20, 20, 20],
      background: {
        fill: themes['widgets-map-area-bg'],
        stroke: themes['widgets-map-area-border'],
      },
      areaColors: themes.order_10,
      pointColors: themes.category_12,
      heatColors: 'rgb(0,0,255)-rgb(0,255,0)-rgb(255,255,0)-rgb(255,0,0)',
      type: 'china',
      showSouthChinaSea: true,
      projection: null,
      legend: {
        position: 'left',
        align: 'bottom',
        nameFormatter: null, // 可以强制覆盖，手动设置label
      },
      tooltip: {
        nameFormatter: null,
        valueFormatter: null,
      },
      labels: false,
      label: false,
    };
  }

  beforeInit(props: MapProps) {
    const { geoData } = props;
    if (geoData) {
      this.geoData = geoData;
    }

    return props;
  }

  geoData: any = null;

  ds: DataSet = null;

  projection: Function = null;

  bgMapDataView: DataView = null;
  bgMapView: View = null;

  areaMapDataView: DataView = null;
  areaMapView: View = null;

  pointMapDataView: DataView = null;
  pointMapView: View = null;

  heatMapDataView: DataView = null;
  heatMapView: View = null;

  labelMapView: View = null;

  init(chart: Chart, config: WmapConfig) {
    // 同步度量
    chart.scale({
      longitude: {
        sync: true,
      },
      latitude: {
        sync: true,
      },
      x: {
        nice: false,
        sync: true,
      },
      y: {
        nice: false,
        sync: true,
      },
    });

    // 设置了 geo.projection 变换后，几何体的坐标系和图表的坐标系（从左下角到右上角）上下相反，所以设置镜像使地图的坐标正确。
    chart.coordinate().reflect('y');

    chart.axis(false);

    rectTooltip.call(
      this,
      chart,
      config,
      {
        showTitle: false,
      },
      (ev: any) => {
        if (typeof config.tooltip === 'boolean') {
          return;
        }
        const { nameFormatter, valueFormatter } = config.tooltip;
        const { items } = ev.data;
        items.forEach((item: any, index: number) => {
          const raw = item.data || {};

          if (valueFormatter) {
            item.value = valueFormatter(item.value, raw, index, ev.items);
          }
          if (nameFormatter) {
            item.name = nameFormatter(item.name, raw, index, ev.items);
          }
        });
      },
      {
        showTitle: false,
        showCrosshairs: false,
        // crosshairs: null,
        showMarkers: false,
      }
    );

    // 设置图例
    rectLegend.call(this, chart, config, {});

    const ds = new DataSet();
    this.ds = ds;

    drawMapBackground(this, chart, ds, config);

    React.Children.forEach(this.props.children, (child: MapChild) => {
      if (!child) {
        return;
      }
      // @ts-ignore
      const { props, type } = child;
      const layerConfig = Object.assign({}, config, props.config);
      // G2 图层需要转化数据格式
      let { data } = props;
      if (layerConfig.dataType !== 'g2') {
        data = convertMapData(data);
      }
      if (type.displayName === MapArea.displayName) {
        drawMapArea(this, chart, ds, layerConfig, data);
      }
      if (type.displayName === MapPoint.displayName) {
        drawMapPoint(this, chart, ds, layerConfig, data);
      }
      if (type.displayName === MapHeatMap.displayName) {
        drawHeatMap(this, chart, ds, layerConfig, data);
      }
    });

    if (config.labels || config.label) {
      drawMapLabel(this, chart, config);
    }

    // chart.render();
  }

  // addLayer(child: MapChild) {
  //   if (child && child.addParent) {
  //     child.addParent(this);
  //   }
  // }

  /** 地图正确的长宽比 */
  bgMapRatio: number = 1;

  /** 地图正确的尺寸 */
  bgMapSize: [number, number] = [0, 0];

  changeSize(chart: Chart, config: WmapConfig, chartWidth: number, chartHeight: number) {
    const chartRatio = chartWidth / chartHeight;
    const ratio = this.bgMapRatio || chartRatio;

    let width = chartWidth;
    let height = chartHeight;
    if (chartRatio > ratio) {
      width = chartHeight * ratio;
    } else if (chartRatio < ratio) {
      height = chartWidth / ratio;
    }
    if (width !== chartWidth || height !== chartHeight) {
      const p1 = (chartWidth - width) / 2;
      const p2 = (chartHeight - height) / 2;
      chart.appendPadding = [p2, p1, p2, p1];
    }

    this.bgMapSize = [width, height];

    chart.changeSize(chartWidth, chartHeight);

    // React 版方法
    this.convertChildren(this.props.children, this.props.config, true);
  }

  changeChildData(chart: Chart, config: WmapConfig, viewName: string, newData: ChartData) {
    const { ds } = this;
    let data = newData;
    if (config.dataType !== 'g2') {
      data = convertMapData(newData);
    }
    if (viewName === MapArea.displayName) {
      drawMapArea(this, chart, ds, config, data);
    }
    if (viewName === MapPoint.displayName) {
      drawMapPoint(this, chart, ds, config, data);
    }
    if (viewName === MapHeatMap.displayName) {
      drawHeatMap(this, chart, ds, config, data);
    }
  }

  /** @override Map 使用自定义 changeData 方法，覆盖原方法逻辑 */
  changeData() {}

  //
  // destroy() {
  //   this.bgMapDataView = null;
  //   this.areaMapDataView = null;
  //   this.pointMapDataView = null;
  //   this.heatMapDataView = null;
  // }
}

// 绘制地图背景
function drawMapBackground(ctx: Map, chart: Chart, ds: DataSet, config: WmapConfig) {
  let geoData = null;
  if (ctx.geoData) {
    // 如果用户有传geoData，优先使用
    geoData = ctx.geoData;
  } else if (config.type === 'china') {
    // 自带中国地图数据
    geoData = chinaGeo;
  } else {
    console.warn("map: no geo data, can't draw the map!");
  }

  const bgMapDataView = ds.createView('bgMap').source(geoData, {
    type: 'GeoJSON',
  });

  let { projection } = config;

  if (!projection) {
    projection = bgMapDataView.getGeoProjection('geoConicEqualArea');
    projection
      // @ts-ignore
      .center([0, 36.4])
      .parallels([25, 47])
      .scale(1000)
      .rotate([-105, 0])
      .translate([0, 0]);
  }

  bgMapDataView.transform({
    type: 'geo.projection',
    // 因为G2的投影函数不支持设置投影参数，这里使用自定义的投影函数设置参数
    // @ts-ignore
    projection() {
      return projection;
    },
    as: ['x', 'y', 'cX', 'cY'],
  });

  if (config.type === 'china') {
    // 过滤掉南海诸岛
    bgMapDataView.transform({
      type: 'filter',
      callback(row) {
        return row.properties.name !== '南海诸岛';
      },
    });
  }

  // start: 按照投影后尺寸比例调整图表的真实比例
  const longitudeRange = bgMapDataView.range('x');
  const latitudeRange = bgMapDataView.range('y');
  const ratio =
    (longitudeRange[1] - longitudeRange[0]) /
    (latitudeRange[1] - latitudeRange[0]);
  ctx.bgMapRatio = ratio;
  const { width: chartWidth, height: chartHeight } = chart;
  const chartRatio = chartWidth / chartHeight;

  let width = chartWidth;
  let height = chartHeight;
  if (chartRatio > ratio) {
    width = chartHeight * ratio;
  } else if (chartRatio < ratio) {
    height = chartWidth / ratio;
  }
  if (width !== chartWidth || height !== chartHeight) {
    const p1 = (chartWidth - width) / 2;
    const p2 = (chartHeight - height) / 2;
    // 不设置尺寸，通过padding控制地图形状
    chart.appendPadding = [p2, p1, p2, p1];
  }
  ctx.bgMapSize = [width, height];
  // end: 按照投影后尺寸比例调整图表的真实比例

  const { fill: bgFill, stroke: bgStroke, ...otherBgStyle } =
    config.background || {};

  const bgMapView = chart.createView({
    padding: 0,
  });
  bgMapView.data(bgMapDataView.rows);
  bgMapView.tooltip(false);
  bgMapView
    .polygon()
    .position('x*y')
    .style('name', function(name) {
      const result = {
        fill: bgFill || themes['widgets-map-area-bg'],
        stroke: bgStroke || themes['widgets-map-area-border'],
        lineWidth: 1,
        ...otherBgStyle,
      };
      // 对一些尺寸非常小的形状特殊处理，以显示出来。
      if (minArea.indexOf(name) > -1) {
        result.stroke = bgFill || themes['widgets-map-area-bg'];
      }
      return result;
    });

  ctx.bgMapDataView = bgMapDataView;
  ctx.bgMapView = bgMapView;

  ctx.projection = projection;
}

// 绘制分级统计地图
function drawMapArea(ctx: Map, chart: Chart, ds: DataSet, config: WmapConfig, data: MapData) {
  let { areaMapDataView } = ctx;
  if (areaMapDataView) {
    areaMapDataView.origin !== data && areaMapDataView.source(data);
  } else {
    areaMapDataView = ds
      .createView()
      .source(data)
      .transform({
        type: 'map',
        callback(obj) {
          const { name, type, ...others } = obj;
          return {
            // @ts-ignore 将省份全称转化为简称
            name: provinceName[name] ? provinceName[name] : name,
            type: String(type),
            ...others,
          };
        },
      })
      .transform({
        geoDataView: ctx.bgMapDataView,
        field: 'name',
        type: 'geo.region',
        as: ['x', 'y'],
      });

    const areaMapView = chart.createView({
    padding: 0,
  });
    areaMapView.data(areaMapDataView.rows);
    const areaGeom = areaMapView
      .polygon()
      .position('x*y')
      // 如果用连续型颜色，需要对数组倒序，否则颜色对应的数值会从小开始
      .color('type', config.areaColors.join('-'))
      // .opacity('value')
      .tooltip('name*value', (name, value) => ({
        name,
        value,
      }));

    geomStyle(areaGeom, config.geomStyle);

    ctx.areaMapDataView = areaMapDataView;
    ctx.areaMapView = areaMapView;
  }
}

// 绘制散点图
function drawMapPoint(ctx: Map, chart: Chart, ds: DataSet, config: WmapConfig, data: MapData) {
  let { pointMapDataView } = ctx;
  if (pointMapDataView) {
    pointMapDataView.origin !== data && pointMapDataView.source(data);
  } else {
    pointMapDataView = ds
      .createView()
      .source(data)
      .transform({
        type: 'map',
        callback: point => {
          const newPoint = Object.assign({}, point);
          newPoint.type = String(newPoint.type);
          return convertPointPosition(ctx, newPoint);
        },
      });

    const pointMapView = chart.createView({
    padding: 0,
  });
    pointMapView.data(pointMapDataView.rows);
    const pointGeom = pointMapView
      .point()
      .position('x*y')
      .shape('circle')
      .color('type', config.pointColors)
      .tooltip('name*value', (name, value) => ({
        name,
        value,
      }))
      // .active(false);

    geomSize(pointGeom, config.size, 4, 'value', 'name*value');

    geomStyle(pointGeom, config.geomStyle);

    if (config.labels) {
      console.warn(`config.labels 已废弃，请使用 config.label`);
    }

    label(pointGeom, config, 'name', {
      // FIXME 默认的动画会导致部分label不显示，暂时关闭动画
      animate: false,
    });
    if (config.labels || config.label) {
      // let labelConfig = {};
      // if (typeof config.labels === 'object') {
      //   labelConfig = config.labels;
      // } else if (typeof config.label === 'object') {
      //   labelConfig = config.label;
      // }
      //
      // const { offset = 0, textStyle = {}, formatter } = labelConfig;
      // pointGeom.label('name', {
      // FIXME 默认的动画会导致部分label不显示，暂时关闭动画
      // animate: false,
      //   offset: `${offset - Number(themes['widgets-font-size-1'].replace('px', ''))}`,
      //   textStyle: {
      //     fill: themes['widgets-map-label'],
      //     // 需要去掉 px 的字符串
      //     fontSize: themes['widgets-font-size-1'].replace('px', ''),
      //     textBaseline: 'middle',
      //     ...textStyle,
      //   },
      //   formatter: formatter || null,
      // });
    }

    ctx.pointMapDataView = pointMapDataView;
    ctx.pointMapView = pointMapView;
  }
}

// 绘制热力图
function drawHeatMap(ctx: Map, chart: Chart, ds: DataSet, config: WmapConfig, data: MapData) {
  let { heatMapDataView } = ctx;
  if (heatMapDataView) {
    heatMapDataView.origin !== data && heatMapDataView.source(data);
  } else {
    heatMapDataView = ds
      .createView()
      .source(data)
      .transform({
        type: 'map',
        callback: point => {
          const newPoint = Object.assign({}, point);
          newPoint.type = String(newPoint.type);
          return convertPointPosition(ctx, newPoint);
        },
      });

    const heatMapView = chart.createView({
    padding: 0,
  });
    heatMapView.data(heatMapDataView.rows);
    chart.legend('value', false);

    const heatGeom = heatMapView
      .heatmap()
      .position('x*y')
      .color('value', config.heatColors)
      .tooltip('name*value', (name, value) => ({
        name,
        value,
      }))

    geomSize(heatGeom, config.size, 16, 'value', 'name*value');

    ctx.heatMapDataView = heatMapDataView;
    ctx.heatMapView = heatMapView;
  }
}

// 绘制背景地图标签
function drawMapLabel(ctx: Map, chart: Chart, config: WmapConfig) {
  const labelConfig = config.labels || config.label;

  // 将背景数据集中的中心点坐标(cX, cY)映射为新数据中的x, y。保证scale可以同步这个view的度量。
  const labelData = ctx.bgMapDataView.rows.map(row => {
    const label = {
      name: row.name,
      x: row.cX,
      y: row.cY,
    };

    // @ts-ignore fix 某些地区label位置不好，需要重新定位
    const fixLngLat = fixLngLatMap[row.name];
    if (fixLngLat) {
      // @ts-ignore 第二个参数支持函数
      const position = ctx.bgMapDataView.geoProjectPosition(fixLngLat, ctx.projection, true);
      label.x = position[0];
      label.y = position[1];
    }

    return label;
  });

  // @ts-ignore label 需要函数处理，无法放到 label 工具函数中
  const { offset = 0, textStyle = {}, labelFormatter } =
    typeof labelConfig === 'object' ? labelConfig : {};

  const labelMapView = chart.createView({
    padding: 0,
  });
  labelMapView.data(labelData);
  labelMapView
    .point()
    .position('x*y')
    .size(0)
    .label('name', function (name) {
      let fontSize = themes['widgets-font-size-1'].replace('px', '');
      // 对一些尺寸非常小的形状特殊处理，以显示出来。
      if (minLabel.indexOf(name) > -1) {
        fontSize = String(Number(fontSize) * 2 / 3);
      }
      const labelStyle = {
        fill: themes['widgets-map-label'],
        // 需要去掉 px 的字符串
        fontSize: fontSize,
        textBaseline: 'middle',
        ...textStyle,
      }
      const result: Types.GeometryLabelCfg = {
        offset,
        style: labelStyle,
        // FIXME 默认的动画会导致部分label不显示，暂时关闭动画
        animate: false,
      };
      if (labelFormatter) {
        result.content = (v, item, index) => {
          return labelFormatter(v['name'], item, index);
        }
      }
      return result;
    })
    .tooltip(false)
    // .active(false);

  ctx.labelMapView = labelMapView;
}


type MapData = Types.LooseObject[];
interface RawMapData {
  name: string;
  data: MapData;
}

// 转换地图数据结构，因为和默认结构不同，需要特殊处理。
function convertMapData(data: RawMapData[]) {
  if (!Array.isArray(data)) {
    return [];
  }
  const result: MapData = [];
  data.forEach(item => {
    const { name = '', data: itemData } = item;
    if (!Array.isArray(itemData)) {
      return;
    }
    itemData.forEach(d => {
      result.push({
        ...d,
        type: d.type || name,
      });
    });
  });

  return result;
}

// 计算数据的坐标点
export function convertPointPosition(ctx: Map, point: Types.LooseObject) {
  if (point.x && point.y) {
    return point;
  }
  if (!ctx.bgMapDataView) {
    return point;
  }

  const { projection } = ctx;
  if (point.lng && point.lat) {
    return getProjectionPosition(
      point,
      ctx.bgMapDataView,
      projection,
      Number(point.lng),
      Number(point.lat)
    );
  }
  if (point.name) {
    let { name } = point;
    if (!/^\w/.test(name)) {
      if (/^\u963F\u62C9/.test(name) || /^\u5F20\u5BB6/.test(name)) {
        // 阿拉、张家 两个开头的需要截取三个字符
        name = name.slice(0, 3);
      } else if (!/\u7701$/.test(name) && !/\u81ea\u6cbb\u533a$/.test(name)) {
        // 以"省" / "自治区"结尾的不截断
        name = name.slice(0, 2);
      }
    }
    // @ts-ignore
    const position = positionMap[name];
    if (position) {
      return getProjectionPosition(
        point,
        ctx.bgMapDataView,
        projection,
        position.lng,
        position.lat
      );
    }
  }
  if (!point.x || !point.y) {
    console.warn('无法定位地点：', point);
  }
  return point;
}

function getProjectionPosition(point: Types.LooseObject, view: DataView, projection: Function, lng: number, lat: number) {
  // @ts-ignore
  const projectedCoord = view.geoProjectPosition([lng, lat], projection, true);
  point.x = projectedCoord[0];
  point.y = projectedCoord[1];
  return point;
}

// // 地图的tooltip逻辑
// function mapTooltip(chart, config) {
//   // tooltip
//   if (config.tooltip !== false) {
//     const { nameFormatter, valueFormatter, customConfig } =
//       config.tooltip || {};
//
//     const tooltipCfg = {
//       showTitle: false,
//       crosshairs: null,
//       itemTpl:
//         '<li data-index={index}>' +
//         '<svg viewBox="0 0 6 6" class="g2-tooltip-marker"></svg>' +
//         '<span class="g2-tooltip-item-name">{name}</span>:<span class="g2-tooltip-item-value">{value}</span></li>',
//     };
//
//     if (customConfig) {
//       merge(tooltipCfg, customConfig);
//     }
//
//     chart.tooltip(tooltipCfg);
//
//     if (nameFormatter || valueFormatter) {
//       chart.on('tooltip:change', ev => {
//         ev.items.forEach((item, index) => {
//           const raw = item.point._origin || {};
//
//           if (valueFormatter) {
//             item.value = valueFormatter(item.value, raw, index, ev.items);
//           }
//           if (nameFormatter) {
//             item.name = nameFormatter(item.name, raw, index, ev.items);
//           }
//         });
//       });
//     }
//   } else {
//     chart.tooltip(false);
//   }
// }

// @ts-ignore
const Wmap: typeof Map = errorWrap(Map);

Wmap.Area = Map.Area;
Wmap.Point = Map.Point;
Wmap.HeatMap = Map.HeatMap;
Wmap.Shoot = Map.Shoot;
Wmap.Custom = Map.Custom;
Wmap.chinaGeoData = Map.chinaGeoData;
Wmap.provinceName = Map.provinceName;
Wmap.positionMap = Map.positionMap;
Wmap.getGeoProjection = Map.getGeoProjection;

export default Wmap;
