'use strict';

exports.__esModule = true;
exports.CUSTOM_NAME = exports.HEAT_MAP_NAME = exports.POINT_NAME = exports.AREA_NAME = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.convertPointPosition = convertPointPosition;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _g = require('@antv/g2');

var _g2 = _interopRequireDefault(_g);

var _dataSet = require('@antv/data-set');

var _chinaGeo = require('./mapData/chinaGeo.json');

var _chinaGeo2 = _interopRequireDefault(_chinaGeo);

var _chinaGeoInfo = require('./mapData/chinaGeoInfo');

var _index = require('../theme/index');

var _index2 = _interopRequireDefault(_index);

var _g2Theme = require('../common/g2Theme');

var _merge = require('../common/merge');

var _merge2 = _interopRequireDefault(_merge);

var _rectLegend = require('../common/rectLegend');

var _rectLegend2 = _interopRequireDefault(_rectLegend);

require('./G2Map.scss');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var defaultConfig = {
  padding: [20, 20, 20, 20],
  background: {
    fill: _index2.default['widgets-map-area-bg'],
    stroke: _index2.default['widgets-map-area-border']
  },
  areaColors: _index2.default.order_10,
  pointColors: _index2.default.category_12,
  heatColors: 'rgb(0,0,255)-rgb(0,255,0)-rgb(255,255,0)-rgb(255,0,0)',
  type: 'china',
  showSouthChinaSea: true,
  projection: null,
  legend: {
    nameFormatter: null // 可以强制覆盖，手动设置label
  },
  tooltip: {
    nameFormatter: null,
    valueFormatter: null
  },
  labels: false,
  label: false
};

var AREA_NAME = exports.AREA_NAME = 'WidgetsMapArea';
var POINT_NAME = exports.POINT_NAME = 'WidgetsMapPoint';
var HEAT_MAP_NAME = exports.HEAT_MAP_NAME = 'WidgetsMapHeatMap';
var CUSTOM_NAME = exports.CUSTOM_NAME = 'WidgetsMapCustom';

// const chinaProjection = () => geoConicEqualArea().center([0, 36.4]).parallels([25, 47]).scale(1000).rotate([-105, 0]).translate([0, 0]);

// 这几个地点太小，需要特殊处理边框颜色
var minArea = ['钓鱼岛', '赤尾屿', '香港', '澳门'];
// 这几个地点需要特殊处理标签的文字大小
var minLabel = ['钓鱼岛', '赤尾屿'];

// 特殊处理一些地区的label
var fixLngLatMap = {
  甘肃: [104.4948862, 35.0248462],
  河北: [115.5193875, 38.3062153],
  天津: [118.2141694, 38.8206246],
  澳门: [113.2573035, 21.7906005],
  香港: [114.9040905, 21.9265955],
  陕西: [108.5133047, 33.8799429],
  上海: [122.2818331, 31.0480268]
};

exports.default = {
  beforeInit: function beforeInit(props) {
    var config = props.config,
        geoData = props.geoData;

    var newConfig = (0, _merge2.default)({}, defaultConfig, config);
    if (geoData) {
      this.geoData = geoData;
    }
    this.config = newConfig;

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
      autoCollapse: false,
      position: 'left',
      // 使用container控制图例添加的位置，方便调整样式
      container: '#' + this.chartId + '-legend',
      'g2-legend': _extends({}, _g2Theme.legendHtmlContainer, {
        position: 'static',
        overflow: 'visible'
      })
    });

    var ds = new _dataSet.DataSet();
    this.ds = ds;

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
      if (child.type.displayName === AREA_NAME) {
        drawMapArea.call(_this, chart, ds, layerConfig, data);
      }
      if (child.type.displayName === POINT_NAME) {
        drawMapPoint.call(_this, chart, ds, layerConfig, data);
      }
      if (child.type.displayName === HEAT_MAP_NAME) {
        drawHeatMap.call(_this, chart, ds, layerConfig, data);
      }
      if (child.type.displayName === CUSTOM_NAME) {
        customPointLayer.push(child.props);
      }
    });
    this.setState({
      customPointLayer: customPointLayer
    });

    if (config.labels || config.label) {
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
  destroy: function destroy() {
    this.bgMapDataView = null;
    this.areaMapDataView = null;
    this.pointMapDataView = null;
    this.heatMapDataView = null;
  }
};

// 绘制地图背景

function drawMapBackground(chart, ds, config) {
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
  });

  var _projection = config.projection;

  if (!_projection) {
    _projection = bgMapDataView.getGeoProjection('geoConicEqualArea');
    _projection.center([0, 36.4]).parallels([25, 47]).scale(1000).rotate([-105, 0]).translate([0, 0]);
  }

  bgMapDataView.transform({
    type: 'geo.projection',
    // 因为G2的投影函数不支持设置投影参数，这里使用自定义的投影函数设置参数
    projection: function projection() {
      return _projection;
    },

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
  this.bgMapRatio = ratio;
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

  var _ref = config.background || {},
      bgFill = _ref.fill,
      bgStroke = _ref.stroke,
      otherBgStyle = _objectWithoutProperties(_ref, ['fill', 'stroke']);

  var bgMapView = chart.view();
  bgMapView.source(bgMapDataView);
  bgMapView.tooltip(false);
  bgMapView.polygon().position('x*y').style('name', _extends({
    fill: bgFill || _index2.default['widgets-map-area-bg'],
    stroke: function stroke(name) {
      // 对一些尺寸非常小的形状特殊处理，以显示出来。
      if (minArea.indexOf(name) > -1) {
        return bgFill || _index2.default['widgets-map-area-bg'];
      }
      return bgStroke || _index2.default['widgets-map-area-border'];
    },
    lineWidth: 1
  }, otherBgStyle));

  this.bgMapDataView = bgMapDataView;
  this.bgMapView = bgMapView;

  this.projection = _projection;
}

// 绘制分级统计地图
function drawMapArea(chart, ds, config, data) {
  var areaMapDataView = this.areaMapDataView;
  if (areaMapDataView) {
    areaMapDataView.origin !== data && areaMapDataView.source(data);
  } else {
    areaMapDataView = ds.createView().source(data).transform({
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
    var areaGeom = areaMapView.polygon().position('x*y')
    // 如果用连续型颜色，需要对数组倒序，否则颜色对应的数值会从小开始
    .color('type', config.areaColors.join('-'))
    // .opacity('value')
    .tooltip('name*value', function (name, value) {
      return {
        name: name,
        value: value
      };
    });

    if (config.geomStyle) {
      areaGeom.style('name*value', config.geomStyle);
    }

    this.areaMapDataView = areaMapDataView;
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
    var _pointMapView$point$p;

    pointMapDataView = ds.createView().source(data).transform({
      type: 'map',
      callback: function callback(point) {
        var newPoint = _extends({}, point);
        newPoint.type = String(newPoint.type);
        return convertPointPosition.call(_this2, newPoint);
      }
    });

    var pointMapView = chart.view();
    pointMapView.source(pointMapDataView);
    var sizeConfig = config.size || 4;
    if (Array.isArray(sizeConfig)) {
      sizeConfig = ['value', sizeConfig];
    } else if (_g2.default.Util.isFunction(sizeConfig)) {
      sizeConfig = ['name*value', sizeConfig];
    } else {
      sizeConfig = [sizeConfig];
    }
    var pointGeom = (_pointMapView$point$p = pointMapView.point().position('x*y').shape('circle').color('type', config.pointColors)).size.apply(_pointMapView$point$p, sizeConfig)
    // .opacity('value')
    .tooltip('name*value', function (name, value) {
      return {
        name: name,
        value: value
      };
    }).active(false);

    if (config.geomStyle) {
      pointGeom.style('name*value', config.geomStyle);
    }

    if (config.labels || config.label) {
      var labelConfig = {};
      if (_typeof(config.labels) === 'object') {
        labelConfig = config.labels;
      } else if (_typeof(config.label) === 'object') {
        labelConfig = config.label;
      }
      var _labelConfig = labelConfig,
          _labelConfig$offset = _labelConfig.offset,
          offset = _labelConfig$offset === undefined ? 0 : _labelConfig$offset,
          _labelConfig$textStyl = _labelConfig.textStyle,
          textStyle = _labelConfig$textStyl === undefined ? {} : _labelConfig$textStyl,
          formatter = _labelConfig.formatter;

      pointGeom.label('name', {
        offset: '' + (offset - Number(_index2.default.s3.replace('px', ''))),
        textStyle: _extends({
          fill: _index2.default['widgets-map-label'],
          // 需要去掉 px 的字符串
          fontSize: _index2.default.s3.replace('px', ''),
          textBaseline: 'middle'
        }, textStyle),
        formatter: formatter || null
      });
    }

    this.pointMapDataView = pointMapDataView;
    this.pointMapView = pointMapView;
  }
}

// 绘制热力图
function drawHeatMap(chart, ds, config, data) {
  var _this3 = this;

  var heatMapDataView = this.heatMapDataView;
  if (heatMapDataView) {
    heatMapDataView.origin !== data && heatMapDataView.source(data);
  } else {
    var _heatMapView$heatmap$;

    heatMapDataView = ds.createView().source(data).transform({
      type: 'map',
      callback: function callback(point) {
        var newPoint = _extends({}, point);
        newPoint.type = String(newPoint.type);
        return convertPointPosition.call(_this3, newPoint);
      }
    });

    var heatMapView = chart.view();
    heatMapView.source(heatMapDataView);
    chart.legend('value', false);

    var sizeConfig = config.size || 16;
    if (Array.isArray(sizeConfig)) {
      sizeConfig = ['value', sizeConfig];
    } else if (_g2.default.Util.isFunction(sizeConfig)) {
      sizeConfig = ['name*value', sizeConfig];
    } else {
      sizeConfig = [sizeConfig];
    }
    var heatMapGeom = (_heatMapView$heatmap$ = heatMapView.heatmap().position('x*y').color('value', config.heatColors)).size.apply(_heatMapView$heatmap$, sizeConfig).tooltip('name*value', function (name, value) {
      return {
        name: name,
        value: value
      };
    })
    // heatmap 不支持 opacity，似乎不支持 style
    .style('name*value', _extends({}, config.geomStyle || {})).active(false);

    this.heatMapDataView = heatMapDataView;
    this.heatMapView = heatMapView;
  }
}

// 绘制背景地图标签
function drawMapLabel(chart, config) {
  var _this4 = this;

  var labelConfig = config.labels || config.label;

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
      var position = _this4.bgMapDataView.geoProjectPosition(fixLngLat, _this4.projection, true);
      label.x = position[0];
      label.y = position[1];
    }

    return label;
  });

  var _ref2 = (typeof labelConfig === 'undefined' ? 'undefined' : _typeof(labelConfig)) === 'object' ? labelConfig : {},
      _ref2$offset = _ref2.offset,
      offset = _ref2$offset === undefined ? 0 : _ref2$offset,
      _ref2$textStyle = _ref2.textStyle,
      _textStyle = _ref2$textStyle === undefined ? {} : _ref2$textStyle;

  var labelMapView = chart.view();
  labelMapView.source(labelData);
  labelMapView.point().position('x*y').size(0).label('name', {
    offset: offset,
    textStyle: function textStyle(name) {
      var fontSize = _index2.default.s3;
      // 对一些尺寸非常小的形状特殊处理，以显示出来。
      if (minLabel.indexOf(name) > -1) {
        fontSize = _index2.default.s2;
      }

      return _extends({
        fill: _index2.default['widgets-map-label'],
        // 需要去掉 px 的字符串
        fontSize: fontSize.replace('px', ''),
        textBaseline: 'middle'
      }, _textStyle);
    },
    formatter: labelConfig.formatter || null
  }).tooltip(false).active(false);

  this.labelMapView = labelMapView;
}

// 转换地图数据结构，因为和默认结构不同，需要特殊处理。
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

// 计算数据的坐标点
function convertPointPosition(point) {
  if (point.x && point.y) {
    return point;
  }
  if (!this.bgMapDataView) {
    return point;
  }

  var projection = this.projection;
  if (point.lng && point.lat) {
    return getProjectionPosition(point, this.bgMapDataView, projection, Number(point.lng), Number(point.lat));
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
      return getProjectionPosition(point, this.bgMapDataView, projection, position.lng, position.lat);
    }
  }
  if (!point.x || !point.y) {
    console.warn('无法定位地点：', point);
  }
  return point;
}

function getProjectionPosition(point, view, projection, lng, lat) {
  var projectedCoord = view.geoProjectPosition([lng, lat], projection, true);
  point.x = projectedCoord[0];
  point.y = projectedCoord[1];
  return point;
}

// 地图的tooltip逻辑
function mapTooltip(chart, config) {
  // tooltip
  if (config.tooltip !== false) {
    var _ref3 = config.tooltip || {},
        nameFormatter = _ref3.nameFormatter,
        valueFormatter = _ref3.valueFormatter,
        customConfig = _ref3.customConfig;

    var tooltipCfg = {
      showTitle: false,
      crosshairs: null,
      itemTpl: '<li data-index={index}>' + '<span style="background-color:{color};" class="g2-tooltip-marker"></span>' + '<span class="g2-tooltip-item-name">{name}</span>:<span class="g2-tooltip-item-value">{value}</span></li>'
    };

    if (customConfig) {
      (0, _merge2.default)(tooltipCfg, customConfig);
    }

    chart.tooltip(tooltipCfg);

    if (nameFormatter || valueFormatter) {
      chart.on('tooltip:change', function (ev) {
        ev.items.forEach(function (item, index) {
          var raw = item.point._origin || {};

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