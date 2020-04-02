'use strict';

import React from 'react';
import G2 from '@antv/g2';
import { DataSet } from '@antv/data-set';
import chinaGeo from './mapData/chinaGeo.json';
import { provinceName, positionMap } from './mapData/chinaGeoInfo';
import themes from '../themes/index';
import { legendHtmlContainer } from '../common/g2Theme';
import merge from '../common/merge';
import rectLegend from '../common/rectLegend';
import getGeomSizeConfig from '../common/geomSize';
import './G2Map.scss';

export const AREA_NAME = 'WidgetsMapArea';
export const POINT_NAME = 'WidgetsMapPoint';
export const HEAT_MAP_NAME = 'WidgetsMapHeatMap';
export const SHOOT_NAME = 'WidgetsMapShoot';
export const CUSTOM_NAME = 'WidgetsMapCustom';

// const chinaProjection = () => geoConicEqualArea().center([0, 36.4]).parallels([25, 47]).scale(1000).rotate([-105, 0]).translate([0, 0]);

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

export default {
  getDefaultConfig() {
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
        nameFormatter: null, // 可以强制覆盖，手动设置label
      },
      tooltip: {
        nameFormatter: null,
        valueFormatter: null,
      },
      labels: false,
      label: false,
    };
  },
  beforeInit(props) {
    const { config, geoData } = props;
    const newConfig = merge({}, this.defaultConfig, config);
    if (geoData) {
      this.geoData = geoData;
    }
    this.config = newConfig;

    return Object.assign({}, props, {
      padding: props.padding || newConfig.padding,
      config: newConfig,
    });
  },
  init(chart, config) {
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
    chart.coord().reflect();

    chart.axis(false);

    mapTooltip.call(this, chart, config);

    // 设置图例
    rectLegend.call(this, chart, config, {
      autoCollapse: false,
      position: 'left',
      // 使用container控制图例添加的位置，方便调整样式
      container: `#${this.chartId}-legend`,
      'g2-legend': {
        ...legendHtmlContainer,
        position: 'static',
        overflow: 'visible',
      },
    });

    const ds = new DataSet();
    this.ds = ds;

    drawMapBackground.call(this, chart, ds, config);

    React.Children.forEach(this.props.children, child => {
      if (!child) {
        return;
      }
      const layerConfig = Object.assign(
        {},
        config,
        child.props.config || child.props
      );
      // G2 图层需要转化数据格式
      let { data } = child.props;
      if (layerConfig.dataType !== 'g2') {
        data = convertMapData(data);
      }
      if (child.type.displayName === AREA_NAME) {
        drawMapArea.call(this, chart, ds, layerConfig, data);
      }
      if (child.type.displayName === POINT_NAME) {
        drawMapPoint.call(this, chart, ds, layerConfig, data);
      }
      if (child.type.displayName === HEAT_MAP_NAME) {
        drawHeatMap.call(this, chart, ds, layerConfig, data);
      }
    });

    if (config.labels || config.label) {
      drawMapLabel.call(this, chart, config);
    }

    chart.render();
  },
  changeSize(chart, config, chartWidth, chartHeight) {
    const chartRatio = chartWidth / chartHeight;
    const ratio = this.bgMapRatio || chartRatio;

    let width = chartWidth;
    let height = chartHeight;
    if (chartRatio > ratio) {
      width = chartHeight * ratio;
    } else if (chartRatio < ratio) {
      height = chartWidth / ratio;
    }
    chart.changeSize(width, height);
  },
  changeData(chart, newConfig, viewName, newData) {
    const config = merge({}, this.defaultConfig, newConfig);
    const { ds } = this;
    let data = newData;
    if (config.dataType !== 'g2') {
      data = convertMapData(newData);
    }
    if (viewName === AREA_NAME) {
      drawMapArea.call(this, chart, ds, config, data);
    }
    if (viewName === POINT_NAME) {
      drawMapPoint.call(this, chart, ds, config, data);
    }
    if (viewName === HEAT_MAP_NAME) {
      drawHeatMap.call(this, chart, ds, config, data);
    }
  },
  destroy() {
    this.bgMapDataView = null;
    this.areaMapDataView = null;
    this.pointMapDataView = null;
    this.heatMapDataView = null;
  },
};

// 绘制地图背景
function drawMapBackground(chart, ds, config) {
  let geoData = null;
  if (this.geoData) {
    // 如果用户有传geoData，优先使用
    geoData = this.geoData;
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
      .center([0, 36.4])
      .parallels([25, 47])
      .scale(1000)
      .rotate([-105, 0])
      .translate([0, 0]);
  }

  bgMapDataView.transform({
    type: 'geo.projection',
    // 因为G2的投影函数不支持设置投影参数，这里使用自定义的投影函数设置参数
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
  this.bgMapRatio = ratio;
  const { width: chartWidth, height: chartHeight } = chart._attrs;
  const chartRatio = chartWidth / chartHeight;

  let width = chartWidth;
  let height = chartHeight;
  if (chartRatio > ratio) {
    width = chartHeight * ratio;
  } else if (chartRatio < ratio) {
    height = chartWidth / ratio;
  }
  if (width !== chartWidth || height !== chartHeight) {
    chart.changeSize(width, height);
  }
  // end: 按照投影后尺寸比例调整图表的真实比例

  const { fill: bgFill, stroke: bgStroke, ...otherBgStyle } =
    config.background || {};

  const bgMapView = chart.view();
  bgMapView.source(bgMapDataView);
  bgMapView.tooltip(false);
  bgMapView
    .polygon()
    .position('x*y')
    .style('name', {
      fill: bgFill || themes['widgets-map-area-bg'],
      stroke: name => {
        // 对一些尺寸非常小的形状特殊处理，以显示出来。
        if (minArea.indexOf(name) > -1) {
          return bgFill || themes['widgets-map-area-bg'];
        }
        return bgStroke || themes['widgets-map-area-border'];
      },
      lineWidth: 1,
      ...otherBgStyle,
    });

  this.bgMapDataView = bgMapDataView;
  this.bgMapView = bgMapView;

  this.projection = projection;
}

// 绘制分级统计地图
function drawMapArea(chart, ds, config, data) {
  let { areaMapDataView } = this;
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
          let newName = name;
          // 将省份全称转化为简称，原名先存在别的名字
          if (provinceName[name]) {
            newName = provinceName[obj.name];
          }
          obj.type = String(obj.type);
          return {
            name: newName,
            type: String(type),
            ...others,
          };
        },
      })
      .transform({
        geoDataView: this.bgMapDataView,
        field: 'name',
        type: 'geo.region',
        as: ['x', 'y'],
      });

    const areaMapView = chart.view();
    areaMapView.source(areaMapDataView);
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

    if (config.geomStyle) {
      areaGeom.style('name*value', config.geomStyle);
    }

    this.areaMapDataView = areaMapDataView;
    this.areaMapView = areaMapView;
  }
}

// 绘制散点图
function drawMapPoint(chart, ds, config, data) {
  let { pointMapDataView } = this;
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
          return convertPointPosition.call(this, newPoint);
        },
      });

    const pointMapView = chart.view();
    pointMapView.source(pointMapDataView);
    const sizeConfig = getGeomSizeConfig(config.size, 4, 'value', 'name*value');
    const pointGeom = pointMapView
      .point()
      .position('x*y')
      .shape('circle')
      .color('type', config.pointColors)
      .size(...sizeConfig)
      // .opacity('value')
      .tooltip('name*value', (name, value) => ({
        name,
        value,
      }))
      .active(false);

    if (config.geomStyle) {
      pointGeom.style('name*value', config.geomStyle);
    }

    if (config.labels || config.label) {
      let labelConfig = {};
      if (typeof config.labels === 'object') {
        labelConfig = config.labels;
      } else if (typeof config.label === 'object') {
        labelConfig = config.label;
      }
      const { offset = 0, textStyle = {}, formatter } = labelConfig;
      pointGeom.label('name', {
        offset: `${offset - Number(themes['widgets-font-size-1'].replace('px', ''))}`,
        textStyle: {
          fill: themes['widgets-map-label'],
          // 需要去掉 px 的字符串
          fontSize: themes['widgets-font-size-1'].replace('px', ''),
          textBaseline: 'middle',
          ...textStyle,
        },
        formatter: formatter || null,
      });
    }

    this.pointMapDataView = pointMapDataView;
    this.pointMapView = pointMapView;
  }
}

// 绘制热力图
function drawHeatMap(chart, ds, config, data) {
  let { heatMapDataView } = this;
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
          return convertPointPosition.call(this, newPoint);
        },
      });

    const heatMapView = chart.view();
    heatMapView.source(heatMapDataView);
    chart.legend('value', false);

    const sizeConfig = getGeomSizeConfig(
      config.size,
      16,
      'value',
      'name*value'
    );
    heatMapView
      .heatmap()
      .position('x*y')
      .color('value', config.heatColors)
      .size(...sizeConfig)
      .tooltip('name*value', (name, value) => ({
        name,
        value,
      }))
      // heatmap 不支持 opacity，似乎不支持 style
      .style('name*value', {
        // opacity(name, value) {
        //   return 0.5;
        // },
        ...(config.geomStyle || {}),
      })
      .active(false);

    this.heatMapDataView = heatMapDataView;
    this.heatMapView = heatMapView;
  }
}

// 绘制背景地图标签
function drawMapLabel(chart, config) {
  const labelConfig = config.labels || config.label;

  // 将背景数据集中的中心点坐标(cX, cY)映射为新数据中的x, y。保证scale可以同步这个view的度量。
  const labelData = this.bgMapDataView.rows.map(row => {
    const label = {
      name: row.name,
      x: row.cX,
      y: row.cY,
    };

    // fix 某些地区label位置不好，需要重新定位
    const fixLngLat = fixLngLatMap[row.name];
    if (fixLngLat) {
      const position = this.bgMapDataView.geoProjectPosition(
        fixLngLat,
        this.projection,
        true
      );
      label.x = position[0];
      label.y = position[1];
    }

    return label;
  });

  const { offset = 0, textStyle = {} } =
    typeof labelConfig === 'object' ? labelConfig : {};

  const labelMapView = chart.view();
  labelMapView.source(labelData);
  labelMapView
    .point()
    .position('x*y')
    .size(0)
    .label('name', {
      offset,
      textStyle: name => {
        let fontSize = themes['widgets-font-size-1'].replace('px', '');
        // 对一些尺寸非常小的形状特殊处理，以显示出来。
        if (minLabel.indexOf(name) > -1) {
          fontSize = String(Number(fontSize) * 2 / 3);
        }

        return {
          fill: themes['widgets-map-label'],
          // 需要去掉 px 的字符串
          fontSize: fontSize,
          textBaseline: 'middle',
          ...textStyle,
        };
      },
      formatter: labelConfig.formatter || null,
    })
    .tooltip(false)
    .active(false);

  this.labelMapView = labelMapView;
}

// 转换地图数据结构，因为和默认结构不同，需要特殊处理。
function convertMapData(data) {
  if (!Array.isArray(data)) {
    return [];
  }
  const result = [];
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
export function convertPointPosition(point) {
  if (point.x && point.y) {
    return point;
  }
  if (!this.bgMapDataView) {
    return point;
  }

  const { projection } = this;
  if (point.lng && point.lat) {
    return getProjectionPosition(
      point,
      this.bgMapDataView,
      projection,
      Number(point.lng),
      Number(point.lat)
    );
  }
  if (point.name) {
    let { name } = point;
    if (!/^\w/.test(name)) {
      if (name === '\u963F\u62C9' || name === '\u5F20\u5BB6') {
        // 阿拉、张家 两个开头的需要截取三个字符
        name = name.slice(0, 3);
      } else if (!/\u7701$/.test(name) && !/\u81ea\u6cbb\u533a$/.test(name)) {
        // 以"省" / "自治区"结尾的不截断
        name = name.slice(0, 2);
      }
    }
    const position = positionMap[name];
    if (position) {
      return getProjectionPosition(
        point,
        this.bgMapDataView,
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

function getProjectionPosition(point, view, projection, lng, lat) {
  const projectedCoord = view.geoProjectPosition([lng, lat], projection, true);
  point.x = projectedCoord[0];
  point.y = projectedCoord[1];
  return point;
}

// 地图的tooltip逻辑
function mapTooltip(chart, config) {
  // tooltip
  if (config.tooltip !== false) {
    const { nameFormatter, valueFormatter, customConfig } =
      config.tooltip || {};

    const tooltipCfg = {
      showTitle: false,
      crosshairs: null,
      itemTpl:
        '<li data-index={index}>' +
        '<svg viewBox="0 0 6 6" class="g2-tooltip-marker"></svg>' +
        '<span class="g2-tooltip-item-name">{name}</span>:<span class="g2-tooltip-item-value">{value}</span></li>',
    };

    if (customConfig) {
      merge(tooltipCfg, customConfig);
    }

    chart.tooltip(tooltipCfg);

    if (nameFormatter || valueFormatter) {
      chart.on('tooltip:change', ev => {
        ev.items.forEach((item, index) => {
          const raw = item.point._origin || {};

          if (valueFormatter) {
            item.value = valueFormatter(item.value, raw, index, ev.items);
          }
          if (nameFormatter) {
            item.name = nameFormatter(item.name, raw, index, ev.items);
          }
        });
      });
    }
  } else {
    chart.tooltip(false);
  }
}
