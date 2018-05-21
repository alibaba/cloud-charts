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

var _chinaGeo = require('./mapData/chinaGeo.json');

var _chinaGeo2 = _interopRequireDefault(_chinaGeo);

var _normal = require('../theme/normal');

var _rectLegend = require('../chartCommon/rectLegend');

var _rectLegend2 = _interopRequireDefault(_rectLegend);

var _chinaGeoInfo = require('./mapData/chinaGeoInfo');

require('./G2Map.scss');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var defaultConfig = {
  padding: [20, 20, 20, 20],
  areaColors: function () {
    var result = [];
    for (var i = 1; i <= 10; i++) {
      result.push(_normal.color['widgetsColorLinear' + i]);
    }
    return result;
  }(),
  pointColors: _normal.color.category_12,
  type: 'china',
  showSouthChinaSea: true,
  legend: {
    nameFormatter: null //可以强制覆盖，手动设置label
  },
  tooltip: {
    nameFormatter: null,
    valueFormatter: null
  },
  labels: false
};

var chinaProjection = function chinaProjection() {
  return (0, _d3Geo.geoConicEqualArea)().center([0, 36.4]).parallels([25, 47]).scale(1000).rotate([-105, 0]).translate([0, 0]);
};

// 这几个地点太小，需要特殊处理边框颜色
var minArea = ['钓鱼岛', '赤尾屿', '香港', '澳门'];
var minLabel = ['钓鱼岛', '赤尾屿'];

// 特殊处理一些地区的label
var fixLngLatMap = {
  '甘肃': [104.4948862, 35.0248462],
  '河北': [115.5193875, 38.3062153],
  '天津': [118.2141694, 38.8206246],
  '澳门': [113.2573035, 21.7906005],
  '香港': [114.9040905, 21.9265955],
  '陕西': [108.5133047, 33.8799429],
  '上海': [122.2818331, 31.0480268]
};

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
  init: function init(chart, config) {
    var _this = this;

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

    mapTooltip.call(this, chart, config);

    // 设置图例
    _rectLegend2.default.call(this, chart, config, {
      position: 'left',
      // 使用container控制图例添加的位置，方便调整样式
      container: '#' + this.chartId + '-legend',
      'g2-legend': {}
    });

    var ds = this.ds = new _dataSet.DataSet();

    drawMapBackground.call(this, chart, ds, config);

    var customPointLayer = [];
    _react2.default.Children.forEach(this.props.children, function (child) {
      if (!child) {
        return;
      }
      var data = child.props.data;

      if (config.dataType !== 'g2') {
        data = convertMapData(data);
      }
      var layerConfig = _extends({}, config, child.props);
      if (child.type.displayName === 'WidgetsMapArea') {
        drawMapArea.call(_this, chart, ds, layerConfig, data);
      }
      if (child.type.displayName === 'WidgetsMapPoint') {
        drawMapPoint.call(_this, chart, ds, layerConfig, data);
      }
      if (child.type.displayName === 'WidgetsMapCustom') {
        customPointLayer.push(child.props);
      }
    });
    this.setState({
      customPointLayer: customPointLayer
    });

    if (config.labels) {
      drawMapLabel.call(this, chart, config);
    }

    chart.render();
  },
  changeSize: function changeSize(chart, config, chartWidth, chartHeight) {
    var chartRatio = chartWidth / chartHeight;
    var ratio = this.bgMapRatio || chartRatio;

    var width = chartWidth;
    var height = chartHeight;
    if (chartRatio > ratio) {
      width = chartHeight * ratio;
    } else if (chartRatio < ratio) {
      height = chartWidth / ratio;
    }
    chart.changeSize(width, height);
  },
  changeData: function changeData(chart, newConfig, viewName, newData) {
    var config = (0, _merge2.default)({}, defaultConfig, newConfig);
    var ds = this.ds;
    var data = newData;
    if (config.dataType !== 'g2') {
      data = convertMapData(newData);
    }
    if (viewName === 'WidgetsMapArea') {
      drawMapArea.call(this, chart, ds, config, data);
    }
    if (viewName === 'WidgetsMapPoint') {
      drawMapPoint.call(this, chart, ds, config, data);
    }
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
  var ratio = this.bgMapRatio = (longitudeRange[1] - longitudeRange[0]) / (latitudeRange[1] - latitudeRange[0]);
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
  var areaMapDataView = this.areaMapDataView;
  if (areaMapDataView) {
    areaMapDataView.origin !== data && areaMapDataView.source(data);
  } else {
    areaMapDataView = this.areaMapDataView = ds.createView().source(data).transform({
      type: 'map',
      callback: function callback(obj) {
        var name = obj.name,
            type = obj.type,
            others = _objectWithoutProperties(obj, ['name', 'type']);

        var newName = name;
        // 将省份全称转化为简称，原名先存在别的名字
        if (_chinaGeoInfo.provinceName[name]) {
          newName = _chinaGeoInfo.provinceName[obj.name];
        }
        obj.type = String(obj.type);
        return _extends({
          name: newName,
          type: String(type)
        }, others);
      }
    }).transform({
      geoDataView: this.bgMapDataView,
      field: 'name',
      type: 'geo.region',
      as: ['x', 'y']
    });

    var areaMapView = chart.view();
    areaMapView.source(areaMapDataView);
    areaMapView.polygon().position('x*y')
    // 如果用连续型颜色，需要对数组倒序，否则颜色对应的数值会从小开始
    .color('type', config.areaColors)
    // .opacity('value')
    .tooltip('name*value', function (name, value) {
      return {
        name: name,
        value: value
      };
    });

    this.areaMapView = areaMapView;
  }
}

// 绘制散点图
function drawMapPoint(chart, ds, config, data) {
  var _this2 = this;

  var pointMapDataView = this.pointMapDataView;
  if (pointMapDataView) {
    pointMapDataView.origin !== data && pointMapDataView.source(data);
  } else {
    pointMapDataView = this.pointMapDataView = ds.createView().source(data).transform({
      type: 'map',
      callback: function callback(point) {
        var newPoint = _extends({}, point);
        newPoint.type = String(newPoint.type);
        return convertPointPosition.call(_this2, newPoint);
      }
    });

    var pointMapView = chart.view();
    pointMapView.source(pointMapDataView);
    var pointGeom = pointMapView.point().position('x*y').shape('circle').color('type', config.pointColors).size(config.size || 4)
    // .opacity('value')
    .tooltip('name*value', function (name, value) {
      return {
        name: name,
        value: value
      };
    }).active(false);

    if (config.labels) {
      pointGeom.label('name', {
        offset: '-' + _normal.size.s3.replace('px', ''),
        textStyle: {
          fill: _normal.color.colorN23,
          // 需要去掉 px 的字符串
          fontSize: _normal.size.s3.replace('px', ''),
          textBaseline: 'middle'
        },
        formatter: config.labels.formatter || null
      });
    }

    this.pointMapView = pointMapView;
  }
}

function drawMapLabel(chart, config) {
  var _this3 = this;

  var labelConfig = config.labels;

  // 将背景数据集中的中心点坐标(cX, cY)映射为新数据中的x, y。保证scale可以同步这个view的度量。
  var labelData = this.bgMapDataView.rows.map(function (row) {
    var label = {
      name: row.name,
      x: row.cX,
      y: row.cY
    };

    // fix 某些地区label位置不好，需要重新定位
    var fixLngLat = fixLngLatMap[row.name];
    if (fixLngLat) {
      var position = _this3.bgMapDataView.geoProjectPosition(fixLngLat, chinaProjection);
      label.x = position[0];
      label.y = position[1];
    }

    return label;
  });

  var labelMapView = chart.view();
  labelMapView.source(labelData);
  labelMapView.point().position('x*y').size(0).label('name', {
    offset: 0,
    textStyle: function textStyle(name) {
      var fontSize = _normal.size.s3;
      // 对一些尺寸非常小的形状特殊处理，以显示出来。
      if (minLabel.indexOf(name) > -1) {
        fontSize = _normal.size.s2;
      }

      return {
        fill: _normal.color.colorN23,
        // 需要去掉 px 的字符串
        fontSize: fontSize.replace('px', ''),
        textBaseline: 'middle'
      };
    },
    formatter: labelConfig.formatter || null
  }).tooltip(false).active(false);

  this.labelMapView = labelMapView;
}

function convertMapData(data) {
  if (!Array.isArray(data)) {
    return [];
  }
  var result = [];
  data.forEach(function (item) {
    var _item$name = item.name,
        name = _item$name === undefined ? '' : _item$name,
        itemData = item.data;

    if (!Array.isArray(itemData)) {
      return;
    }
    itemData.forEach(function (d) {
      result.push(_extends({}, d, {
        type: d.type || name
      }));
    });
  });

  return result;
}

// 设置数据的坐标点
function convertPointPosition(point) {
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
    var name = point.name;
    if (!/^\w/.test(name)) {
      if (name === '\u963F\u62C9' || name === '\u5F20\u5BB6') {
        // 阿拉、张家 两个开头的需要截取三个字符
        name = name.slice(0, 3);
      } else if (!/\u7701$/.test(name) && !/\u81ea\u6cbb\u533a$/.test(name)) {
        // 以"省" / "自治区"结尾的不截断
        name = name.slice(0, 2);
      }
    }
    var position = _chinaGeoInfo.positionMap[name];
    if (position) {
      return getProjectionPosition(point, this.bgMapDataView, position.lng, position.lat);
    }
  }
  return point;
}

function getProjectionPosition(point, view, lng, lat) {
  var projectedCoord = view.geoProjectPosition([lng, lat], chinaProjection);
  point.x = projectedCoord[0];
  point.y = projectedCoord[1];
  return point;
}

function mapTooltip(chart, config) {
  // tooltip
  if (config.tooltip) {
    var tooltipCfg = {
      showTitle: false,
      crosshairs: null,
      itemTpl: '<li data-index={index}>' + '<span style="background-color:{color};" class="g2-tooltip-marker"></span>' + '<span class="g2-tooltip-item-name">{name}</span>:<span class="g2-tooltip-item-value">{value}</span></li>'
    };
    chart.tooltip(tooltipCfg);
    if (config.tooltip.nameFormatter || config.tooltip.valueFormatter) {
      chart.on('tooltip:change', function (ev) {
        ev.items.forEach(function (item, index) {
          var raw = item.point._origin || {};

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