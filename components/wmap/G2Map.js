'use strict';

import React from 'react';
import { DataSet } from '@antv/data-set';
import { geoConicEqualArea } from 'd3-geo';
import merge from '../utils/merge';
import chinaGeo from './chinaGeo.json';
import { color, size } from '../theme/normal';
import { noop } from '../chartCommon/common';
import './G2Map.scss';

const defaultConfig = {
  padding: [20, 20, 20, 20],
  colors: (() => {
    const result = [];
    for (let i = 1; i <= 10; i++) {
      result.push(color[`widgetsColorLinear${i}`]);
    }
    return result;
  })(),
  type: 'china',
  showSouthChinaSea: true,
  legend: {
    align: 'left',
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
const minArea = ['钓鱼岛', '赤尾屿', '澳门'];

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
  init(chart, config, data) {
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
        // 'g2-legend': Object.assign({
        //   // display: 'inline-block',
        //   position: 'relative',
        //   textAlign: 'left',
        //   // top: size.s3,
        // }, config.legend.align === 'right' ? { marginLeft: size.s3 } : { marginRight: size.s3 }),
      });
      // hack 图例的位置，仅在初始化时处理一遍
      // setTimeout(() => {
      //   // TODO 在示例中this会无法获取？？？
      //   const legendDom = self.chartDom.querySelector('.g2-legend');
      //   const parent = legendDom && legendDom.parentNode;
      //   if (parent) {
      //     parent.style.textAlign = config.legend.align === 'right' ? 'right' : 'left';
      //   }
      // }, 100);
    } else {
      chart.legend(false);
    }

    const ds = new DataSet();

    drawMapBackground.call(this, chart, ds, config);

    const customPointLayer = [];
    React.Children.forEach(this.props.children, (child) => {
      if (!child) {
        return;
      }
      if (child.type.name === 'MapArea') {
        drawMapArea.call(this, chart, ds, config, child.props.data);
      }
      if (child.type.name === 'MapPoint') {
        drawMapPoint.call(this, chart, ds, config, child.props.data);
      }
      if (child.type.name === 'MapCustom') {
        customPointLayer.push(child.props);
      }
    });
    this.setState({
      customPointLayer
    });

    //
    this.convertChildren();

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

    // chart.polygon().position(Stat.map.region('name', config.geoData)).color('Population','#e5f5e0-#31a354').style({
    //   fill: 'rgba(49, 157, 255, 0.8)',
    //   stroke: '#999',
    //   lineWidth: 1
    // });
    //
    // if (config.labels) {
    //   chart.point().position(Stat.map.center('name', config.geoData)).size(0).label('name', {offset: 0});
    // }

    chart.render();

    // 自定义图例html
    // if (config.legend) {
    //   let id = chart._attrs.id;
    //   let chartNode = document.getElementById(id);
    //   chartNode.style.position = 'relative';
    //   let geom = chart.getGeoms()[0]; // 获取所有的图形
    //   let items = geom.getData(); // 获取图形对应的数据
    //   let stash = {};
    //
    //   let ulNode = document.createElement('ul');
    //   ulNode.classList.add('ac-line-legend');
    //   // ulNode.style.top = config.padding[0] + 'px';
    //   if(config.legend.align === 'right'){
    //     ulNode.style.right = config.padding[1] + 'px';
    //   }else{
    //     ulNode.style.left = 5 + 'px';
    //   }
    //   ulNode.innerHTML = '';
    //   for (let i = 0, l = items.length; i < l; i++) {
    //     let item = items[i];
    //     let itemData = item._origin;
    //     let color = item.color;
    //     let type = itemData[0].type;
    //     let name = itemData.name;
    //     let value = itemData.value;
    //
    //     let typeFormatter = config.legend.nameFormatter ? config.legend.nameFormatter(type, item, i) : type ;
    //
    //     let liHtml = '<li class="item" data-id="' + type + '"><i class="dot" style="background:' + color + ';"></i><span>' + typeFormatter + '</span></li>';
    //     ulNode.innerHTML += liHtml;
    //     chartNode.appendChild(ulNode);
    //
    //     stash[type] = {
    //       item: item,
    //       color: color,
    //       name: type,
    //       isChecked: true,
    //       index: i
    //     };
    //   }
    //   let dotDom = chartNode.getElementsByClassName('dot');
    //   Array.prototype.forEach.call(ulNode.querySelectorAll('li'), (item) => {
    //     item.addEventListener('click', (e) => {
    //       let node = getLegendNode(e.target);
    //       let type = node.getAttribute('data-id');
    //       g2LegendFilter(type, stash, Util, dotDom, chart);
    //     });
    //   });
    // }
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
  const areaMapDataView = ds.createView()
    .source(data)
    .transform({
      geoDataView: this.bgMapDataView,
      field: 'name',
      type: 'geo.region',
      as: ['x', 'y']
    })
      .transform({
        type: 'map',
        callback(obj) {
          obj.type = String(obj.type);
          return obj;
        }
      });
  const areaMapView = chart.view();
  areaMapView.source(areaMapDataView);
  areaMapView.polygon().position('x*y')
    // 如果用连续型颜色，需要对数组倒序，否则颜色对应的数值会从小开始
    .color('type', config.colors.slice(0))
    // .opacity('value')
    .tooltip('name*value', (name, value) => ({
      name,
      value
    }));

  this.areaMapView = areaMapView;
}

// 绘制散点图
function drawMapPoint(chart, ds, config, data) {
  const pointMapDataView = ds.createView()
    .source(data)
    .transform({
      type: 'map',
      callback: (point) => {
        point.type = String(point.type);
        return convertPointPosition.call(this, point);
      }
    });

  const pointMapView = chart.view();
  pointMapView.source(pointMapDataView);
  pointMapView.point().position('x*y')
    .shape('circle')
    .color('type', config.colors.slice(0))
    .size(4)
    // .opacity('value')
    .tooltip('name*value', (name, value) => ({
      name,
      value
    }))
    .active(false);

  this.pointMapView = pointMapView;
}

function convertTypeData(data) {
  if (!Array.isArray(data)) {
    return [];
  }
  const result = [];
  data.forEach((item) => {
    const { name, data } = item;
    if (!Array.isArray(data)) {
      return;
    }
    data.forEach((d) => {
      if (!d.type) {
        d.type = name || 'type';
      }

      result.push(d);
    });
  });

  return result;
}

// 设置数据的坐标点
export function convertPointPosition(point) {
  if (point.x && point.y) {
    return point;
  }
  if (this.bgMapDataView && point.lng && point.lat) {
    const projectedCoord = this.bgMapDataView.geoProjectPosition([Number(point.lng), Number(point.lat)], chinaProjection);
    point.x = projectedCoord[0];
    point.y = projectedCoord[1];
    return point;
  }
  if (point.name) {

  }
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
