'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.convertPointPosition = convertPointPosition;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _dataSet = require('@antv/data-set');

var _d3Geo = require('d3-geo');

var _merge = require('../utils/merge');

var _merge2 = _interopRequireDefault(_merge);

var _chinaGeo = require('./chinaGeo');

var _chinaGeo2 = _interopRequireDefault(_chinaGeo);

var _normal = require('../theme/normal');

require('./G2Map.scss');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var defaultConfig = {
  padding: [0, 0, 0, 0],
  colors: function () {
    var result = [];
    for (var i = 1; i <= 10; i++) {
      result.push(_normal.color['widgetsColorLinear' + i]);
    }
    return result;
  }(),
  type: 'china',
  showSouthChinaSea: true,
  legend: {
    align: 'left',
    nameFormatter: null //可以强制覆盖，手动设置label
  },
  tooltip: {
    titleFormatter: null,
    nameFormatter: null,
    valueFormatter: null
  },
  labels: false
};

var chinaProjection = function chinaProjection() {
  return (0, _d3Geo.geoConicEqualArea)().center([0, 36.4]).parallels([25, 47]).scale(1000).rotate([-105, 0]).translate([0, 0]);
};

// 这几个地点太小，需要特殊处理边框颜色
var minArea = ['钓鱼岛', '赤尾屿', '澳门'];

exports.default = {
  beforeInit: function beforeInit(props) {
    var config = props.config,
        geoData = props.geoData;

    var newConfig = (0, _merge2.default)({}, defaultConfig, config);
    if (geoData) {
      this.geoData = geoData;
    }

    return _extends({}, props, {
      padding: props.padding || newConfig.padding,
      config: newConfig
    });
  },
  init: function init(chart, config, data) {
    var _this = this;

    chart.tooltip({
      showTitle: false
    });

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
      }
    });

    // 设置了 geo.projection 变换后，几何体的坐标系和图表的坐标系（从左下角到右上角）上下相反，所以设置镜像使地图的坐标正确。
    chart.coord().reflect();

    chart.axis(false);

    // 设置图例
    chart.legend(false);
    // chart.legend('trend', {
    //   position: 'left'
    // });

    var ds = new _dataSet.DataSet();

    drawMapBackground.call(this, chart, ds, config);

    var customPointLayer = [];
    _react2.default.Children.forEach(this.props.children, function (child) {
      if (!child) {
        return;
      }
      if (child.type.name === 'MapArea') {
        drawMapArea.call(_this, chart, ds, config, child.props.data);
      }
      if (child.type.name === 'MapPoint') {
        drawMapPoint.call(_this, chart, ds, config, child.props.data);
      }
      if (child.type.name === 'MapCustom') {
        customPointLayer.push(child.props);
      }
    });
    this.setState({
      customPointLayer: customPointLayer
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
  }
};


function drawMapBackground(chart, ds, config) {
  // 绘制地图背景
  var geoData = null;
  if (this.geoData) {
    // 如果用户有传geoData，优先使用
    geoData = this.geoData;
  } else if (config.type === 'china') {
    // 自带中国地图数据
    geoData = _chinaGeo2.default;
  } else {
    console.warn('map: no geo data, can\'t draw the map!');
  }

  var bgMapDataView = ds.createView('bgMap').source(geoData, {
    type: 'GeoJSON'
  }).transform({
    type: 'geo.projection',
    // 因为G2的投影函数不支持设置投影参数，这里使用自定义的投影函数设置参数
    projection: chinaProjection,
    as: ['x', 'y', 'cX', 'cY']
  });

  if (config.type === 'china') {
    // 过滤掉南海诸岛
    bgMapDataView.transform({
      type: 'filter',
      callback: function callback(row) {
        return row.properties.name !== '南海诸岛';
      }
    });
  }

  // start: 按照投影后尺寸比例调整图表的真实比例
  var longitudeRange = bgMapDataView.range('x');
  var latitudeRange = bgMapDataView.range('y');
  var ratio = (longitudeRange[1] - longitudeRange[0]) / (latitudeRange[1] - latitudeRange[0]);
  var _chart$_attrs = chart._attrs,
      chartWidth = _chart$_attrs.width,
      chartHeight = _chart$_attrs.height;

  var chartRatio = chartWidth / chartHeight;

  var width = chartWidth;
  var height = chartHeight;
  if (chartRatio > ratio) {
    width = chartHeight * ratio;
  } else if (chartRatio < ratio) {
    height = chartWidth / ratio;
  }
  if (width !== chartWidth || height !== chartHeight) {
    chart.changeSize(width, height);
  }
  // end: 按照投影后尺寸比例调整图表的真实比例

  var bgMapView = chart.view();
  bgMapView.source(bgMapDataView);
  bgMapView.tooltip(false);
  bgMapView.polygon().position('x*y').style('name', {
    fill: _normal.color.widgetsMapAreaBg,
    stroke: function stroke(name) {
      // 对一些尺寸非常小的形状特殊处理，以显示出来。
      if (minArea.indexOf(name) > -1) {
        return _normal.color.widgetsMapAreaBg;
      }
      return _normal.color.widgetsMapAreaBorder;
    },
    lineWidth: 1
  });

  this.bgMapDataView = bgMapDataView;
  this.bgMapView = bgMapView;
}

// 绘制分级统计地图
function drawMapArea(chart, ds, config, data) {
  var areaMapDataView = ds.createView().source(data).transform({
    geoDataView: this.bgMapDataView,
    field: 'name',
    type: 'geo.region',
    as: ['x', 'y']
    // })
    // .transform({
    //   type: 'map',
    //   callback: function(obj) {
    //     obj.trend = (obj.value > 100) ? '男性更多' : '女性更多';
    //     return obj;
    //   }
  });
  var areaMapView = chart.view();
  areaMapView.source(areaMapDataView);
  areaMapView.polygon().position('x*y')
  // 颜色倒序，否则颜色对应的数值会从小开始
  .color('value', config.colors.slice(0).reverse())
  // .opacity('value')
  .tooltip('name*value');

  this.areaMapView = areaMapView;
}

// 绘制散点图
function drawMapPoint(chart, ds, config, data) {
  var pointMapDataView = ds.createView().source(data).transform({
    type: 'map',
    callback: convertPointPosition.bind(this)
  });

  var pointMapView = chart.view();
  pointMapView.source(pointMapDataView);
  pointMapView.point().position('x*y').shape('circle').color('value', config.colors.slice(0).reverse()).size(4)
  // .opacity('value')
  .tooltip('name*value*x*y').active(false);

  this.pointMapView = pointMapView;
}

function convertTypeData(data) {
  if (!Array.isArray(data)) {
    return [];
  }
  var result = [];
  data.forEach(function (item) {
    var name = item.name,
        data = item.data;

    if (!Array.isArray(data)) {
      return;
    }
    data.forEach(function (d) {
      if (!d.type) {
        d.type = name || 'type';
      }

      result.push(d);
    });
  });

  return result;
}

// 设置数据的坐标点
function convertPointPosition(point) {
  if (point.x && point.y) {
    return point;
  }
  if (this.bgMapDataView && point.lng && point.lat) {
    var projectedCoord = this.bgMapDataView.geoProjectPosition([Number(point.lng), Number(point.lat)], chinaProjection);
    point.x = projectedCoord[0];
    point.y = projectedCoord[1];
  }
  if (point.name) {}
  return point;
}