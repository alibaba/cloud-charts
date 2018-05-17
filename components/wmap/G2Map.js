'use strict';

import React from 'react';
import { DataSet } from '@antv/data-set';
import { geoConicEqualArea } from 'd3-geo';
import merge from '../utils/merge';
import chinaGeo from './chinaGeo.json';
import { color, size } from '../theme/normal';
import { noop } from '../chartCommon/common';
import { provinceName, positionMap } from './chinaGeoInfo';
import './G2Map.scss';

const defaultConfig = {
  padding: [20, 20, 20, 20],
  areaColors: (() => {
    const result = [];
    for (let i = 1; i <= 10; i++) {
      result.push(color[`widgetsColorLinear${i}`]);
    }
    return result;
  })(),
  pointColors: color.category_12,
  type: 'china',
  showSouthChinaSea: true,
  legend: {
    nameFormatter: null, //可以强制覆盖，手动设置label
  },
  tooltip: {
    nameFormatter: null,
    valueFormatter: null,
  },
  labels: false,
};

const chinaProjection = () => geoConicEqualArea().center([0, 36.4]).parallels([25, 47]).scale(1000).rotate([-105, 0]).translate([0, 0]);

// 这几个地点太小，需要特殊处理边框颜色
const minArea = ['钓鱼岛', '赤尾屿', '香港', '澳门'];
const minLabel = ['钓鱼岛', '赤尾屿'];

// 特殊处理一些地区的label
const fixLngLatMap = {
  '甘肃': [104.4948862, 35.0248462],
  '河北': [115.5193875, 38.3062153],
  '天津': [118.2141694, 38.8206246],
  '澳门': [113.2573035, 21.7906005],
  '香港': [114.9040905, 21.9265955],
  '陕西': [108.5133047, 33.8799429],
  '上海': [122.2818331, 31.0480268],
};

export default {
  beforeInit(props) {
    const { config, geoData } = props;
    const newConfig = merge({}, defaultConfig, config);
    if (geoData) {
      this.geoData = geoData;
    }

    return Object.assign({}, props, {
      padding: props.padding || newConfig.padding,
      config: newConfig
    });
  },
  init(chart, config) {
    // 同步度量
    chart.scale({
      longitude: {
        sync: true
      },
      latitude: {
        sync: true
      },
      x: {
        nice: false,
        sync: true
      },
      y: {
        nice: false,
        sync: true
      },
    });

    // 设置了 geo.projection 变换后，几何体的坐标系和图表的坐标系（从左下角到右上角）上下相反，所以设置镜像使地图的坐标正确。
    chart.coord().reflect();

    chart.axis(false);

    mapTooltip.call(this, chart, config);

    // 设置图例
    if (config.legend) {
      const self = this;
      chart.legend({
        useHtml: true,
        title: null,
        position: 'left',
        // 使用container控制图例添加的位置，方便调整样式
        container: `#${this.chartId}-legend`,
        // 这个属性文档里没有，设置为false可以让图例不居中，再手动设置定位样式
        autoPosition: false,
        onHover: noop,
        itemTpl: (value, color, checked, index) => {
          const item = (self.rawData && self.rawData[index]) || {};
          const result = config.legend.nameFormatter ? config.legend.nameFormatter(value, {
            ...item,
            color,
            checked
          }, index) : value;
          return '<li class="g2-legend-list-item item-{index} {checked}" data-color="{originColor}" data-value="{originValue}">' +
            '<i class="g2-legend-marker" style="background-color:{color};"></i>' +
            '<span class="g2-legend-text">' + result + '</span></li>';
        },
      });
    } else {
      chart.legend(false);
    }

    const ds = this.ds = new DataSet();

    drawMapBackground.call(this, chart, ds, config);

    const customPointLayer = [];
    React.Children.forEach(this.props.children, (child) => {
      if (!child) {
        return;
      }
      let { data } = child.props;
      if (config.dataType !== 'g2') {
        data = convertMapData(data);
      }
      const layerConfig = Object.assign({}, config, child.props);
      if (child.type.name === 'MapArea') {
        drawMapArea.call(this, chart, ds, layerConfig, data);
      }
      if (child.type.name === 'MapPoint') {
        drawMapPoint.call(this, chart, ds, layerConfig, data);
      }
      if (child.type.name === 'MapCustom') {
        customPointLayer.push(child.props);
      }
    });
    this.setState({
      customPointLayer
    });

    // tooltip
    // if (config.tooltip) {
    //   let tooltipCfg = {
    //     custom: true,
    //     offset: 8,
    //     // crosshairs: {
    //     //   type: 'y' // 启用水平方向的辅助线
    //     // },
    //     // crossLine: {
    //     //   stroke: '#dddddd',
    //     //   lineWidth: 1,
    //     // },
    //     padding: [12, 12, 12, 12],
    //     html: '<div class="ac-tooltip" style="position:absolute;visibility: hidden;"><h4 class="ac-title"></h4><ul class="ac-list"></ul></div>',
    //     // itemTpl: '<li><i style="background-color:{color}"></i>{name}<span>{value}</span></li>',
    //   };
    //   chart.tooltip(true, tooltipCfg);
    //   if (config.tooltip.titleFormatter || config.tooltip.nameFormatter || config.tooltip.valueFormatter) {
    //     chart.on('tooltipchange', function (ev) {
    //       ev.items.forEach((item) => {
    //         item.title = config.tooltip.titleFormatter ? config.tooltip.titleFormatter(item.title) : item.title;
    //         item.value = '';
    //         item.name = '';
    //         // item.value = config.tooltip.valueFormatter ? config.tooltip.valueFormatter(item.value) : item.value;
    //         // item.name = config.tooltip.nameFormatter ? config.tooltip.nameFormatter(item.name) : item.name;
    //       });
    //     });
    //   }
    // } else {
    //   chart.tooltip(false);
    // }

    if (config.labels) {
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
    const config = merge({}, defaultConfig, newConfig);
    const ds = this.ds;
    let data = newData;
    if (config.dataType !== 'g2') {
      data = convertMapData(newData);
    }
    if (viewName === 'MapArea') {
      drawMapArea.call(this, chart, ds, config, data);
    }
    if (viewName === 'MapPoint') {
      drawMapPoint.call(this, chart, ds, config, data);
    }
  }
};

function drawMapBackground(chart, ds, config) {
  // 绘制地图背景
  let geoData = null;
  if (this.geoData) {
    // 如果用户有传geoData，优先使用
    geoData = this.geoData;
  } else if (config.type === 'china') {
    // 自带中国地图数据
    geoData = chinaGeo;
  } else {
    console.warn('map: no geo data, can\'t draw the map!');
  }

  const bgMapDataView = ds.createView('bgMap')
    .source(geoData, {
      type: 'GeoJSON'
    }).transform({
      type: 'geo.projection',
      // 因为G2的投影函数不支持设置投影参数，这里使用自定义的投影函数设置参数
      projection: chinaProjection,
      as: ['x', 'y', 'cX', 'cY'],
    });

  if (config.type === 'china') {
    // 过滤掉南海诸岛
    bgMapDataView.transform({
      type: 'filter',
      callback(row) {
        return row.properties.name !== '南海诸岛';
      }
    });
  }

  // start: 按照投影后尺寸比例调整图表的真实比例
  const longitudeRange = bgMapDataView.range('x');
  const latitudeRange = bgMapDataView.range('y');
  const ratio = this.bgMapRatio = (longitudeRange[1] - longitudeRange[0]) / (latitudeRange[1] - latitudeRange[0]);
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

  const bgMapView = chart.view();
  bgMapView.source(bgMapDataView);
  bgMapView.tooltip(false);
  bgMapView.polygon().position('x*y').style('name', {
    fill: color.widgetsMapAreaBg,
    stroke: (name) => {
      // 对一些尺寸非常小的形状特殊处理，以显示出来。
      if (minArea.indexOf(name) > -1) {
        return color.widgetsMapAreaBg;
      }
      return color.widgetsMapAreaBorder;
    },
    lineWidth: 1
  });

  this.bgMapDataView = bgMapDataView;
  this.bgMapView = bgMapView;
}

// 绘制分级统计地图
function drawMapArea(chart, ds, config, data) {
  let areaMapDataView = this.areaMapDataView;
  if (areaMapDataView) {
    areaMapDataView.origin !== data && areaMapDataView.source(data);
  } else {
    areaMapDataView = this.areaMapDataView = ds.createView()
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
            ...others
          };
        }
      })
      .transform({
        geoDataView: this.bgMapDataView,
        field: 'name',
        type: 'geo.region',
        as: ['x', 'y']
      });

    const areaMapView = chart.view();
    areaMapView.source(areaMapDataView);
    areaMapView.polygon().position('x*y')
      // 如果用连续型颜色，需要对数组倒序，否则颜色对应的数值会从小开始
      .color('type', config.areaColors)
      // .opacity('value')
      .tooltip('name*value', (name, value) => ({
        name,
        value
      }));

    this.areaMapView = areaMapView;
  }
}

// 绘制散点图
function drawMapPoint(chart, ds, config, data) {
  let pointMapDataView = this.pointMapDataView;
  if (pointMapDataView) {
    pointMapDataView.origin !== data && pointMapDataView.source(data);
  } else {
    pointMapDataView = this.pointMapDataView = ds.createView()
      .source(data)
      .transform({
        type: 'map',
        callback: (point) => {
          const newPoint = Object.assign({}, point);
          newPoint.type = String(newPoint.type);
          return convertPointPosition.call(this, newPoint);
        }
      });

    const pointMapView = chart.view();
    pointMapView.source(pointMapDataView);
    const pointGeom = pointMapView.point().position('x*y')
      .shape('circle')
      .color('type', config.pointColors)
      .size(config.size || 4)
      // .opacity('value')
      .tooltip('name*value', (name, value) => ({
        name,
        value
      }))
      .active(false);

    if (config.labels) {
      pointGeom.label('name', {
        offset: `-${size.s3.replace('px', '')}`,
        textStyle: {
          fill: color.colorN23,
          // 需要去掉 px 的字符串
          fontSize: size.s3.replace('px', ''),
          textBaseline: 'middle'
        },
        formatter: config.labels.formatter || null
      })
    }

    this.pointMapView = pointMapView;
  }
}

function drawMapLabel(chart, config) {
  const labelConfig = config.labels;

  // 将背景数据集中的中心点坐标(cX, cY)映射为新数据中的x, y。保证scale可以同步这个view的度量。
  const labelData = this.bgMapDataView.rows.map((row) => {
    let label = {
      name: row.name,
      x: row.cX,
      y: row.cY
    };

    // fix 某些地区label位置不好，需要重新定位
    const fixLngLat = fixLngLatMap[row.name];
    if (fixLngLat) {
      const position = this.bgMapDataView.geoProjectPosition(fixLngLat, chinaProjection);
      label.x = position[0];
      label.y = position[1];
    }

    return label;
  });

  const labelMapView = chart.view();
  labelMapView.source(labelData);
  labelMapView.point().position('x*y')
    .size(0)
    .label('name', {
      offset: 0,
      textStyle: (name) => {
        let fontSize = size.s3;
        // 对一些尺寸非常小的形状特殊处理，以显示出来。
        if (minLabel.indexOf(name) > -1) {
          fontSize = size.s2;
        }

        return {
          fill: color.colorN23,
          // 需要去掉 px 的字符串
          fontSize: fontSize.replace('px', ''),
          textBaseline: 'middle'
        };
      },
      formatter: labelConfig.formatter || null
    })
    .tooltip(false)
    .active(false);

  this.labelMapView = labelMapView;
}

function convertMapData(data) {
  if (!Array.isArray(data)) {
    return [];
  }
  const result = [];
  data.forEach((item) => {
    const { name = '', data: itemData } = item;
    if (!Array.isArray(itemData)) {
      return;
    }
    itemData.forEach((d) => {
      result.push({
        ...d,
        type: d.type || name
      });
    });
  });

  return result;
}

// 设置数据的坐标点
export function convertPointPosition(point) {
  if (point.x && point.y) {
    return point;
  }
  if (!this.bgMapDataView) {
    return point;
  }
  if (point.lng && point.lat) {
    return getProjectionPosition(point, this.bgMapDataView, Number(point.lng), Number(point.lat));
  }
  if (point.name) {
    let name = point.name;
    if (!/^\w/.test(name)) {
      if (name === '\u963F\u62C9' || name === '\u5F20\u5BB6') {
        // 阿拉、张家 两个开头的需要截取三个字符
        name = name.slice(0, 3);
      } else if (!/\u7701$/.test(name) && !/\u81ea\u6cbb\u533a$/.test(name)) { //以"省" / "自治区"结尾的不截断
        name = name.slice(0, 2);
      }
    }
    const position = positionMap[name];
    if (position) {
      return getProjectionPosition(point, this.bgMapDataView, position.lng, position.lat);
    }
  }
  return point;
}

function getProjectionPosition(point, view, lng, lat) {
  const projectedCoord = view.geoProjectPosition([lng, lat], chinaProjection);
  point.x = projectedCoord[0];
  point.y = projectedCoord[1];
  return point;
}

function mapTooltip(chart, config) {
  // tooltip
  if (config.tooltip) {
    const tooltipCfg = {
      showTitle: false,
      crosshairs: null,
      itemTpl: '<li data-index={index}>'
      + '<span style="background-color:{color};" class="g2-tooltip-marker"></span>'
      + '<span class="g2-tooltip-item-name">{name}</span>:<span class="g2-tooltip-item-value">{value}</span></li>',
    };
    chart.tooltip(tooltipCfg);
    if (config.tooltip.nameFormatter || config.tooltip.valueFormatter) {
      chart.on('tooltip:change', (ev) => {
        ev.items.forEach((item, index) => {
          const raw = item.point._origin || {};

          if (config.tooltip.valueFormatter) {
            item.value = config.tooltip.valueFormatter(item.value, raw, index, ev.items);
          }
          if (config.tooltip.nameFormatter) {
            item.name = config.tooltip.nameFormatter(item.name, raw, index, ev.items);
          }
        });
      });
    }
  } else {
    chart.tooltip(false);
  }
}
