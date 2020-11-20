'use strict';

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.convertPointPosition = convertPointPosition;
exports["default"] = void 0;

var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutPropertiesLoose"));

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inheritsLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/inheritsLoose"));

var React = _interopRequireWildcard(require("react"));

var _dataSet = require("@antv/data-set/lib/data-set");

require("@antv/data-set/lib/api/statistics");

require("@antv/data-set/lib/api/geo");

require("@antv/data-set/lib/connector/geojson");

require("@antv/data-set/lib/transform/map");

require("@antv/data-set/lib/transform/filter");

require("@antv/data-set/lib/transform/geo/projection");

require("@antv/data-set/lib/transform/geo/region");

var _Base2 = _interopRequireWildcard(require("../common/Base"));

var _chinaGeo = _interopRequireDefault(require("./mapData/chinaGeo.json"));

var _southChinaSea = _interopRequireDefault(require("./mapData/southChinaSea"));

var _chinaGeoInfo = require("./mapData/chinaGeoInfo");

var _index = _interopRequireDefault(require("../themes/index"));

var _rectTooltip = _interopRequireDefault(require("../common/rectTooltip"));

var _rectLegend = _interopRequireDefault(require("../common/rectLegend"));

var _geomSize = _interopRequireDefault(require("../common/geomSize"));

var _child = require("./child");

require("./index.scss");

var _Wshoot = _interopRequireDefault(require("../Wshoot"));

// DataSet
// @ts-ignore
// import label, { LabelConfig } from "../common/label";
// 这几个地点太小，需要特殊处理边框颜色
var minArea = ['钓鱼岛', '赤尾屿', '香港', '澳门']; // 这几个地点需要特殊处理标签的文字大小

var minLabel = ['钓鱼岛', '赤尾屿']; // 特殊处理一些地区的label

var fixLngLatMap = {
  甘肃: [104.4948862, 35.0248462],
  河北: [115.5193875, 38.3062153],
  天津: [118.2141694, 38.8206246],
  澳门: [113.2573035, 21.7906005],
  香港: [114.9040905, 21.9265955],
  陕西: [108.5133047, 33.8799429],
  上海: [122.2818331, 31.0480268]
};

var Wmap = /*#__PURE__*/function (_Base) {
  (0, _inheritsLoose2["default"])(Wmap, _Base);

  function Wmap() {
    var _this;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _Base.call.apply(_Base, [this].concat(args)) || this;
    _this.state = {
      customPointLayer: [],
      shootLayer: [],
      southChinaSeaKey: 0
    };

    _this.convertPosition = function (d) {
      if (!d) {
        return undefined;
      }

      var point = convertPointPosition((0, _assertThisInitialized2["default"])(_this), d);
      return _this.bgMapView.getXY(point);
    };

    _this.chartName = 'G2Map';
    _this.convertData = false;
    _this.geoData = null;
    _this.ds = null;
    _this.projection = null;
    _this.bgMapDataView = null;
    _this.bgMapView = null;
    _this.areaMapDataView = null;
    _this.areaMapView = null;
    _this.pointMapDataView = null;
    _this.pointMapView = null;
    _this.heatMapDataView = null;
    _this.heatMapView = null;
    _this.labelMapView = null;
    _this.bgMapRatio = 1;
    _this.bgMapSize = [0, 0];
    return _this;
  }

  var _proto = Wmap.prototype;

  _proto.componentDidMount = function componentDidMount() {
    _Base.prototype.componentDidMount.call(this);

    this.convertChildren(this.props.children, this.props.config, true);
  };

  _proto.componentDidUpdate = function componentDidUpdate(prevProps) {
    if (!this.isReRendering && this.props.children !== prevProps.children) {
      this.convertChildren(this.props.children, this.props.config);
    }

    _Base.prototype.componentDidUpdate.call(this, prevProps);
  };

  _proto.shouldComponentUpdate = function shouldComponentUpdate() {
    return !(this.isReRendering || !this.chart);
  };

  _proto.rerender = function rerender() {
    // fix: 动态切换主题后南海诸岛地图没有更新
    if (this.props.config.showSouthChinaSea === undefined || this.props.config.showSouthChinaSea) {
      this.setState({
        southChinaSeaKey: this.state.southChinaSeaKey + 1
      });
    }

    return _Base.prototype.rerender.call(this);
  };

  _proto.convertChildren = function convertChildren(children, config, isInit) {
    var _this2 = this;

    if (children === void 0) {
      children = this.props.children;
    }

    if (config === void 0) {
      config = this.props.config;
    }

    if (isInit === void 0) {
      isInit = false;
    }

    var customPointLayer = [];
    var shootLayer = [];
    React.Children.forEach(children, function (child) {
      if (!child) {
        return;
      } // @ts-ignore


      var props = child.props,
          type = child.type;

      if (type.displayName === _child.MapCustom.displayName) {
        var newData = props.data;

        if (Array.isArray(newData)) {
          newData = newData.map(function (d) {
            var position = _this2.convertPosition(d ? (0, _extends2["default"])({}, d) : null);

            if (!position) {
              return null;
            }

            return (0, _extends2["default"])({}, d, {
              x: position.x,
              y: position.y
            });
          });
        }

        customPointLayer.push((0, _extends2["default"])({}, props, {
          data: newData
        }));
        return;
      }

      if (type.displayName === _child.MapShoot.displayName) {
        // let newData = child.props.data;
        // if (Array.isArray(newData)) {
        //   newData = newData.map((d) => {
        //     let from = { ...d.from };
        //     let to = { ...d.to };
        //     const fromPosition = this.convertPosition(from);
        //     const toPosition = this.convertPosition(to);
        //     if (fromPosition) {
        //       from.x = fromPosition.x;
        //       from.y = fromPosition.y;
        //     }
        //     if (toPosition) {
        //       to.x = toPosition.x;
        //       to.y = toPosition.y;
        //     }
        //     return { ...d, from, to };
        //   });
        // }
        // shootLayer.push({ ...child.props, data: newData });
        shootLayer.push(props);
        return;
      }

      if (!isInit) {
        var _data = props.data,
            propsConfig = (0, _objectWithoutPropertiesLoose2["default"])(props, ["data"]);
        var layerConfig = Object.assign({}, config, propsConfig);

        _this2.changeChildData(_this2.chart, layerConfig, type.displayName, _data);
      }
    });
    this.setState({
      customPointLayer: customPointLayer,
      shootLayer: shootLayer
    });
  };

  _proto.renderCustomPointLayer = function renderCustomPointLayer(layer, layerIndex) {
    if (!this.chart) {
      return null;
    }

    var data = layer.data,
        render = layer.render,
        otherProps = (0, _objectWithoutPropertiesLoose2["default"])(layer, ["data", "render"]); // const { width: chartWidth, height: chartHeight } = this.chart;
    // const [width, height] = this.bgMapSize;
    // const layerStyle = {
    //   left: (chartWidth - width) / 2,
    //   top: (chartHeight - height) / 2,
    //   width,
    //   height,
    // };

    return /*#__PURE__*/React.createElement("div", {
      key: layerIndex,
      className: "cloud-charts-map-custom-container"
    }, Array.isArray(data) && data.map(function (d, i) {
      if (!d) {
        return null;
      }

      var pointStyle = {
        left: d.x,
        top: d.y
      };
      return /*#__PURE__*/React.createElement("div", {
        key: i,
        className: "cloud-charts-map-custom-point",
        style: pointStyle
      }, render && render(d, i, otherProps));
    }));
  };

  _proto.renderShootLayer = function renderShootLayer(shootProps, shootIndex) {
    if (!this.chart) {
      return null;
    }

    var className = shootProps.className,
        style = shootProps.style;
    var _this$chart = this.chart,
        chartWidth = _this$chart.width,
        chartHeight = _this$chart.height; // const [width, height] = this.bgMapSize;
    // const layerStyle = {
    //   left: (chartWidth - width) / 2,
    //   top: (chartHeight - height) / 2,
    //   width,
    //   height,
    //   ...(style || {})
    // };

    return /*#__PURE__*/React.createElement(_Wshoot["default"], (0, _extends2["default"])({
      key: shootIndex,
      className: "cloud-charts-map-shoot " + (className || ''),
      width: chartWidth,
      height: chartHeight,
      style: style,
      getPosition: this.convertPosition
    }, shootProps));
  };

  _proto.renderSouthChinaSea = function renderSouthChinaSea(config) {
    if (config.showSouthChinaSea === undefined || config.showSouthChinaSea) {
      var southChinaSeaKey = this.state.southChinaSeaKey;

      var _ref = config.background || {},
          fill = _ref.fill;

      var mapColor = fill || _index["default"]['widgets-map-area-bg'];
      return /*#__PURE__*/React.createElement(_southChinaSea["default"], {
        key: southChinaSeaKey,
        className: "cloud-charts-map-south-china-sea",
        fontColor: mapColor,
        landColor: mapColor,
        lineColor: mapColor,
        boxColor: mapColor,
        islandColor: mapColor
      });
    } else {
      return null;
    }
  };

  _proto.render = function render() {
    var _this3 = this;

    var _this$props = this.props,
        _this$props$className = _this$props.className,
        className = _this$props$className === void 0 ? '' : _this$props$className,
        style = _this$props.style,
        children = _this$props.children,
        data = _this$props.data,
        width = _this$props.width,
        height = _this$props.height,
        padding = _this$props.padding,
        geoData = _this$props.geoData,
        config = _this$props.config,
        language = _this$props.language,
        otherProps = (0, _objectWithoutPropertiesLoose2["default"])(_this$props, ["className", "style", "children", "data", "width", "height", "padding", "geoData", "config", "language"]);
    var _this$state = this.state,
        customPointLayer = _this$state.customPointLayer,
        shootLayer = _this$state.shootLayer;
    return /*#__PURE__*/React.createElement("div", (0, _extends2["default"])({
      ref: function ref(dom) {
        return _this3.chartDom = dom;
      },
      id: this.chartId,
      className: _Base2.rootClassName + 'G2Map ' + className,
      style: style
    }, otherProps), this.renderSouthChinaSea(config), shootLayer.length > 0 && shootLayer.map(function (shoot, i) {
      return _this3.renderShootLayer(shoot, i);
    }), customPointLayer.length > 0 && customPointLayer.map(function (layer, i) {
      return _this3.renderCustomPointLayer(layer, i);
    }));
  };

  _proto.getDefaultConfig = function getDefaultConfig() {
    return {
      padding: [20, 20, 20, 20],
      background: {
        fill: _index["default"]['widgets-map-area-bg'],
        stroke: _index["default"]['widgets-map-area-border']
      },
      areaColors: _index["default"].order_10,
      pointColors: _index["default"].category_12,
      heatColors: 'rgb(0,0,255)-rgb(0,255,0)-rgb(255,255,0)-rgb(255,0,0)',
      type: 'china',
      showSouthChinaSea: true,
      projection: null,
      legend: {
        position: 'left',
        align: 'bottom',
        nameFormatter: null // 可以强制覆盖，手动设置label

      },
      tooltip: {
        nameFormatter: null,
        valueFormatter: null
      },
      labels: false,
      label: false
    };
  };

  _proto.beforeInit = function beforeInit(props) {
    var geoData = props.geoData;

    if (geoData) {
      this.geoData = geoData;
    }

    return props;
  };

  _proto.init = function init(chart, config) {
    var _this4 = this;

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
    }); // 设置了 geo.projection 变换后，几何体的坐标系和图表的坐标系（从左下角到右上角）上下相反，所以设置镜像使地图的坐标正确。

    chart.coordinate().reflect('y');
    chart.axis(false);

    _rectTooltip["default"].call(this, chart, config, {
      showTitle: false
    }, function (ev) {
      if (typeof config.tooltip === 'boolean') {
        return;
      }

      var _config$tooltip = config.tooltip,
          nameFormatter = _config$tooltip.nameFormatter,
          valueFormatter = _config$tooltip.valueFormatter;
      var items = ev.data.items;
      items.forEach(function (item, index) {
        var raw = item.data || {};

        if (valueFormatter) {
          item.value = valueFormatter(item.value, raw, index, ev.items);
        }

        if (nameFormatter) {
          item.name = nameFormatter(item.name, raw, index, ev.items);
        }
      });
    }, {
      showCrosshairs: false,
      // crosshairs: null,
      showMarkers: false
    }); // 设置图例


    _rectLegend["default"].call(this, chart, config, {// autoCollapse: false,
      // position: 'left',
      // align: 'bottom',
      // paddingIgnore: true,
      // 使用container控制图例添加的位置，方便调整样式
      // container: `#${this.chartId}-legend`,
      // 'g2-legend': {
      //   ...legendHtmlContainer,
      //   position: 'static',
      //   overflow: 'visible',
      // },
    });

    var ds = new _dataSet.DataSet();
    this.ds = ds;
    drawMapBackground(this, chart, ds, config);
    React.Children.forEach(this.props.children, function (child) {
      if (!child) {
        return;
      } // @ts-ignore


      var props = child.props,
          type = child.type;
      var layerConfig = Object.assign({}, config, props.config); // G2 图层需要转化数据格式

      var data = props.data;

      if (layerConfig.dataType !== 'g2') {
        data = convertMapData(data);
      }

      if (type.displayName === _child.MapArea.displayName) {
        drawMapArea(_this4, chart, ds, layerConfig, data);
      }

      if (type.displayName === _child.MapPoint.displayName) {
        drawMapPoint(_this4, chart, ds, layerConfig, data);
      }

      if (type.displayName === _child.MapHeatMap.displayName) {
        drawHeatMap(_this4, chart, ds, layerConfig, data);
      }
    });

    if (config.labels || config.label) {
      drawMapLabel(this, chart, config);
    } // chart.render();

  } // addLayer(child: MapChild) {
  //   if (child && child.addParent) {
  //     child.addParent(this);
  //   }
  // }

  /** 地图正确的长宽比 */
  ;

  _proto.changeSize = function changeSize(chart, config, chartWidth, chartHeight) {
    var chartRatio = chartWidth / chartHeight;
    var ratio = this.bgMapRatio || chartRatio;
    var width = chartWidth;
    var height = chartHeight;

    if (chartRatio > ratio) {
      width = chartHeight * ratio;
    } else if (chartRatio < ratio) {
      height = chartWidth / ratio;
    }

    if (width !== chartWidth || height !== chartHeight) {
      var p1 = (chartWidth - width) / 2;
      var p2 = (chartHeight - height) / 2;
      chart.appendPadding = [p2, p1, p2, p1];
    }

    this.bgMapSize = [width, height];
    chart.changeSize(chartWidth, chartHeight); // React 版方法

    this.convertChildren(this.props.children, this.props.config, true);
  };

  _proto.changeChildData = function changeChildData(chart, config, viewName, newData) {
    var ds = this.ds;
    var data = newData;

    if (config.dataType !== 'g2') {
      data = convertMapData(newData);
    }

    if (viewName === _child.MapArea.displayName) {
      drawMapArea(this, chart, ds, config, data);
    }

    if (viewName === _child.MapPoint.displayName) {
      drawMapPoint(this, chart, ds, config, data);
    }

    if (viewName === _child.MapHeatMap.displayName) {
      drawHeatMap(this, chart, ds, config, data);
    }
  }
  /** @override Map 使用自定义 changeData 方法，覆盖原方法逻辑 */
  ;

  _proto.changeData = function changeData() {} //
  // destroy() {
  //   this.bgMapDataView = null;
  //   this.areaMapDataView = null;
  //   this.pointMapDataView = null;
  //   this.heatMapDataView = null;
  // }
  ;

  return Wmap;
}(_Base2["default"]); // 绘制地图背景


Wmap.Area = _child.MapArea;
Wmap.Point = _child.MapPoint;
Wmap.HeatMap = _child.MapHeatMap;
Wmap.Shoot = _child.MapShoot;
Wmap.Custom = _child.MapCustom;
Wmap.chinaGeoData = _chinaGeo["default"];
Wmap.provinceName = _chinaGeoInfo.provinceName;
Wmap.positionMap = _chinaGeoInfo.positionMap;

function drawMapBackground(ctx, chart, ds, config) {
  var geoData = null;

  if (ctx.geoData) {
    // 如果用户有传geoData，优先使用
    geoData = ctx.geoData;
  } else if (config.type === 'china') {
    // 自带中国地图数据
    geoData = _chinaGeo["default"];
  } else {
    console.warn("map: no geo data, can't draw the map!");
  }

  var bgMapDataView = ds.createView('bgMap').source(geoData, {
    type: 'GeoJSON'
  });
  var _projection = config.projection;

  if (!_projection) {
    _projection = bgMapDataView.getGeoProjection('geoConicEqualArea');

    _projection // @ts-ignore
    .center([0, 36.4]).parallels([25, 47]).scale(1000).rotate([-105, 0]).translate([0, 0]);
  }

  bgMapDataView.transform({
    type: 'geo.projection',
    // 因为G2的投影函数不支持设置投影参数，这里使用自定义的投影函数设置参数
    // @ts-ignore
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
  } // start: 按照投影后尺寸比例调整图表的真实比例


  var longitudeRange = bgMapDataView.range('x');
  var latitudeRange = bgMapDataView.range('y');
  var ratio = (longitudeRange[1] - longitudeRange[0]) / (latitudeRange[1] - latitudeRange[0]);
  ctx.bgMapRatio = ratio;
  var chartWidth = chart.width,
      chartHeight = chart.height;
  var chartRatio = chartWidth / chartHeight;
  var width = chartWidth;
  var height = chartHeight;

  if (chartRatio > ratio) {
    width = chartHeight * ratio;
  } else if (chartRatio < ratio) {
    height = chartWidth / ratio;
  }

  if (width !== chartWidth || height !== chartHeight) {
    var p1 = (chartWidth - width) / 2;
    var p2 = (chartHeight - height) / 2;
    chart.appendPadding = [p2, p1, p2, p1]; // chart.changeSize(width, height);
  }

  ctx.bgMapSize = [width, height]; // end: 按照投影后尺寸比例调整图表的真实比例

  var _ref2 = config.background || {},
      bgFill = _ref2.fill,
      bgStroke = _ref2.stroke,
      otherBgStyle = (0, _objectWithoutPropertiesLoose2["default"])(_ref2, ["fill", "stroke"]);

  var bgMapView = chart.createView({
    padding: 0
  });
  bgMapView.data(bgMapDataView.rows);
  bgMapView.tooltip(false);
  bgMapView.polygon().position('x*y').style('name', function (name) {
    var result = (0, _extends2["default"])({
      fill: bgFill || _index["default"]['widgets-map-area-bg'],
      stroke: bgStroke || _index["default"]['widgets-map-area-border'],
      lineWidth: 1
    }, otherBgStyle); // 对一些尺寸非常小的形状特殊处理，以显示出来。

    if (minArea.indexOf(name) > -1) {
      result.stroke = bgFill || _index["default"]['widgets-map-area-bg'];
    }

    return result;
  });
  ctx.bgMapDataView = bgMapDataView;
  ctx.bgMapView = bgMapView;
  ctx.projection = _projection;
} // 绘制分级统计地图


function drawMapArea(ctx, chart, ds, config, data) {
  var areaMapDataView = ctx.areaMapDataView;

  if (areaMapDataView) {
    areaMapDataView.origin !== data && areaMapDataView.source(data);
  } else {
    areaMapDataView = ds.createView().source(data).transform({
      type: 'map',
      callback: function callback(obj) {
        var name = obj.name,
            type = obj.type,
            others = (0, _objectWithoutPropertiesLoose2["default"])(obj, ["name", "type"]);
        return (0, _extends2["default"])({
          // @ts-ignore 将省份全称转化为简称
          name: _chinaGeoInfo.provinceName[name] ? _chinaGeoInfo.provinceName[name] : name,
          type: String(type)
        }, others);
      }
    }).transform({
      geoDataView: ctx.bgMapDataView,
      field: 'name',
      type: 'geo.region',
      as: ['x', 'y']
    });
    var areaMapView = chart.createView({
      padding: 0
    });
    areaMapView.data(areaMapDataView.rows);
    /*const areaGeom = */

    areaMapView.polygon().position('x*y') // 如果用连续型颜色，需要对数组倒序，否则颜色对应的数值会从小开始
    .color('type', config.areaColors.join('-')) // .opacity('value')
    .tooltip('name*value', function (name, value) {
      return {
        name: name,
        value: value
      };
    });

    if (config.geomStyle) {// areaGeom.style('name*value', config.geomStyle);
    }

    ctx.areaMapDataView = areaMapDataView;
    ctx.areaMapView = areaMapView;
  }
} // 绘制散点图


function drawMapPoint(ctx, chart, ds, config, data) {
  var pointMapDataView = ctx.pointMapDataView;

  if (pointMapDataView) {
    pointMapDataView.origin !== data && pointMapDataView.source(data);
  } else {
    pointMapDataView = ds.createView().source(data).transform({
      type: 'map',
      callback: function callback(point) {
        var newPoint = Object.assign({}, point);
        newPoint.type = String(newPoint.type);
        return convertPointPosition(ctx, newPoint);
      }
    });
    var pointMapView = chart.createView({
      padding: 0
    });
    pointMapView.data(pointMapDataView.rows);
    var pointGeom = pointMapView.point().position('x*y').shape('circle').color('type', config.pointColors).tooltip('name*value', function (name, value) {
      return {
        name: name,
        value: value
      };
    }); // .active(false);

    (0, _geomSize["default"])(pointGeom, config.size, 4, 'value', 'name*value');

    if (config.geomStyle) {// pointGeom.style('name*value', config.geomStyle);
    }

    if (config.labels) {
      console.warn("config.labels \u5DF2\u5E9F\u5F03\uFF0C\u8BF7\u4F7F\u7528 config.label");
    }

    if (config.labels || config.label) {// let labelConfig = {};
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
} // 绘制热力图


function drawHeatMap(ctx, chart, ds, config, data) {
  var heatMapDataView = ctx.heatMapDataView;

  if (heatMapDataView) {
    heatMapDataView.origin !== data && heatMapDataView.source(data);
  } else {
    heatMapDataView = ds.createView().source(data).transform({
      type: 'map',
      callback: function callback(point) {
        var newPoint = Object.assign({}, point);
        newPoint.type = String(newPoint.type);
        return convertPointPosition(ctx, newPoint);
      }
    });
    var heatMapView = chart.createView({
      padding: 0
    });
    heatMapView.data(heatMapDataView.rows);
    chart.legend('value', false);
    var heatGeom = heatMapView.heatmap().position('x*y').color('value', config.heatColors).tooltip('name*value', function (name, value) {
      return {
        name: name,
        value: value
      };
    }); // heatmap 不支持 opacity，似乎不支持 style
    // .style('name*value', {
    //   // opacity(name, value) {
    //   //   return 0.5;
    //   // },
    //   ...(config.geomStyle || {}),
    // })
    // .active(false);

    (0, _geomSize["default"])(heatGeom, config.size, 16, 'value', 'name*value');
    ctx.heatMapDataView = heatMapDataView;
    ctx.heatMapView = heatMapView;
  }
} // 绘制背景地图标签


function drawMapLabel(ctx, chart, config) {
  var labelConfig = config.labels || config.label; // 将背景数据集中的中心点坐标(cX, cY)映射为新数据中的x, y。保证scale可以同步这个view的度量。

  var labelData = ctx.bgMapDataView.rows.map(function (row) {
    var label = {
      name: row.name,
      x: row.cX,
      y: row.cY
    }; // @ts-ignore fix 某些地区label位置不好，需要重新定位

    var fixLngLat = fixLngLatMap[row.name];

    if (fixLngLat) {
      // @ts-ignore 第二个参数支持函数
      var position = ctx.bgMapDataView.geoProjectPosition(fixLngLat, ctx.projection, true);
      label.x = position[0];
      label.y = position[1];
    }

    return label;
  }); // @ts-ignore TODO label 统一化

  var _ref3 = typeof labelConfig === 'object' ? labelConfig : {},
      _ref3$offset = _ref3.offset,
      offset = _ref3$offset === void 0 ? 0 : _ref3$offset,
      _ref3$textStyle = _ref3.textStyle,
      textStyle = _ref3$textStyle === void 0 ? {} : _ref3$textStyle,
      formatter = _ref3.formatter;

  var labelMapView = chart.createView({
    padding: 0
  });
  labelMapView.data(labelData);
  labelMapView.point().position('x*y').size(0).label('name', function (name) {
    var fontSize = _index["default"]['widgets-font-size-1'].replace('px', ''); // 对一些尺寸非常小的形状特殊处理，以显示出来。


    if (minLabel.indexOf(name) > -1) {
      fontSize = String(Number(fontSize) * 2 / 3);
    }

    var labelStyle = (0, _extends2["default"])({
      fill: _index["default"]['widgets-map-label'],
      // 需要去掉 px 的字符串
      fontSize: fontSize,
      textBaseline: 'middle'
    }, textStyle);
    var result = {
      offset: offset,
      style: labelStyle,
      // FIXME 默认的动画会导致部分label不显示，暂时关闭动画
      animate: false
    };

    if (formatter) {
      result.content = function (v, item, index) {
        return formatter(v['name'], item, index);
      };
    }

    return result;
  }).tooltip(false); // .active(false);

  ctx.labelMapView = labelMapView;
}

// 转换地图数据结构，因为和默认结构不同，需要特殊处理。
function convertMapData(data) {
  if (!Array.isArray(data)) {
    return [];
  }

  var result = [];
  data.forEach(function (item) {
    var _item$name = item.name,
        name = _item$name === void 0 ? '' : _item$name,
        itemData = item.data;

    if (!Array.isArray(itemData)) {
      return;
    }

    itemData.forEach(function (d) {
      result.push((0, _extends2["default"])({}, d, {
        type: d.type || name
      }));
    });
  });
  return result;
} // 计算数据的坐标点


function convertPointPosition(ctx, point) {
  if (point.x && point.y) {
    return point;
  }

  if (!ctx.bgMapDataView) {
    return point;
  }

  var projection = ctx.projection;

  if (point.lng && point.lat) {
    return getProjectionPosition(point, ctx.bgMapDataView, projection, Number(point.lng), Number(point.lat));
  }

  if (point.name) {
    var name = point.name;

    if (!/^\w/.test(name)) {
      if (/^\u963F\u62C9/.test(name) || /^\u5F20\u5BB6/.test(name)) {
        // 阿拉、张家 两个开头的需要截取三个字符
        name = name.slice(0, 3);
      } else if (!/\u7701$/.test(name) && !/\u81ea\u6cbb\u533a$/.test(name)) {
        // 以"省" / "自治区"结尾的不截断
        name = name.slice(0, 2);
      }
    } // @ts-ignore


    var position = _chinaGeoInfo.positionMap[name];

    if (position) {
      return getProjectionPosition(point, ctx.bgMapDataView, projection, position.lng, position.lat);
    }
  }

  if (!point.x || !point.y) {
    console.warn('无法定位地点：', point);
  }

  return point;
}

function getProjectionPosition(point, view, projection, lng, lat) {
  // @ts-ignore
  var projectedCoord = view.geoProjectPosition([lng, lat], projection, true);
  point.x = projectedCoord[0];
  point.y = projectedCoord[1];
  return point;
} // // 地图的tooltip逻辑
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


var _default = Wmap;
exports["default"] = _default;