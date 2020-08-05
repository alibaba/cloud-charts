'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _g2Factory = require('../common/g2Factory');

var _g2Factory2 = _interopRequireDefault(_g2Factory);

var _errorWrap = require('../common/errorWrap');

var _errorWrap2 = _interopRequireDefault(_errorWrap);

var _G2Map = require('./G2Map');

var _G2Map2 = _interopRequireDefault(_G2Map);

var _index = require('../Wshoot/index');

var _index2 = _interopRequireDefault(_index);

var _southChinaSea = require('./mapData/southChinaSea');

var _southChinaSea2 = _interopRequireDefault(_southChinaSea);

var _chinaGeoInfo = require('./mapData/chinaGeoInfo');

var _chinaGeo = require('./mapData/chinaGeo.json');

var _chinaGeo2 = _interopRequireDefault(_chinaGeo);

var _index3 = require('../themes/index');

var _index4 = _interopRequireDefault(_index3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults(subClass, superClass); }

var MapBase = (0, _g2Factory2.default)('G2Map', _G2Map2.default, false);
var rootClassName = 'cloud-charts ';

var Map = function (_MapBase) {
  _inherits(Map, _MapBase);

  function Map(props, context) {
    _classCallCheck(this, Map);

    var _this = _possibleConstructorReturn(this, _MapBase.call(this, props, context));

    _this.convertPosition = function (d) {
      if (!d) {
        return;
      }
      var point = _G2Map.convertPointPosition.call(_this, d);
      return _this.bgMapView.getXY(point);
    };

    _this.state = {
      customPointLayer: [],
      shootLayer: [],
      southChinaSeaKey: 0
    };
    return _this;
  }

  Map.prototype.componentDidMount = function componentDidMount() {
    _MapBase.prototype.componentDidMount.call(this);

    this.convertChildren(this.props.children, this.props.config, true);
  };

  Map.prototype.componentDidUpdate = function componentDidUpdate(prevProps, prevState, snapshot) {
    if (!this.isReRendering && this.props.children !== prevProps.children) {
      this.convertChildren(this.props.children, this.props.config);
    }

    _MapBase.prototype.componentDidUpdate.call(this, prevProps, prevState, snapshot);
  };

  Map.prototype.shouldComponentUpdate = function shouldComponentUpdate(nextProps, nextState) {
    return !(this.isReRendering || !this.chart);
  };

  Map.prototype.rerender = function rerender() {
    // fix: 动态切换主题后南海诸岛地图没有更新
    if (this.props.config.showSouthChinaSea === undefined || this.props.config.showSouthChinaSea) {
      this.setState({
        southChinaSeaKey: this.state.southChinaSeaKey + 1
      });
    }
    return _MapBase.prototype.rerender.call(this);
  };

  Map.prototype.convertChildren = function convertChildren() {
    var children = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.props.children;

    var _this2 = this;

    var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.props.config;
    var isInit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

    var customPointLayer = [];
    var shootLayer = [];
    _react2.default.Children.forEach(children, function (child) {
      if (!child) {
        return;
      }
      if (child.type.displayName === _G2Map.CUSTOM_NAME) {
        var newData = child.props.data;
        if (Array.isArray(newData)) {
          newData = newData.map(function (d) {
            var position = _this2.convertPosition(d ? _extends({}, d) : null);
            if (!position) {
              return null;
            }
            return _extends({}, d, { x: position.x, y: position.y });
          });
        }
        customPointLayer.push(_extends({}, child.props, { data: newData }));
        return;
      }
      if (child.type.displayName === _G2Map.SHOOT_NAME) {
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
        shootLayer.push(child.props);
        return;
      }

      if (!isInit) {
        var _child$props = child.props,
            data = _child$props.data,
            propsConfig = _objectWithoutProperties(_child$props, ['data']);

        var layerConfig = _extends({}, config, propsConfig);

        _this2.chartProcess.changeData.call(_this2, _this2.chart, layerConfig, child.type.displayName, data);
      }
    });
    this.setState({
      customPointLayer: customPointLayer,
      shootLayer: shootLayer
    });
  };

  Map.prototype.changeSize = function changeSize(config, w, h) {
    _MapBase.prototype.changeSize.call(this, config, w, h);

    this.convertChildren(this.props.children, this.props.config, true);
  };

  Map.prototype.renderCustomPointLayer = function renderCustomPointLayer(layer, layerIndex) {
    if (!this.chart) {
      return null;
    }

    var data = layer.data,
        render = layer.render,
        otherProps = _objectWithoutProperties(layer, ['data', 'render']);

    var width = this.chart.get('width');
    var height = this.chart.get('height');
    var _size = this._size,
        cW = _size[0],
        cH = _size[1];

    var layerStyle = {
      left: (cW - width) / 2,
      top: (cH - height) / 2,
      width: width,
      height: height
    };

    return _react2.default.createElement(
      'div',
      { key: layerIndex, className: 'cloud-charts-map-custom-container', style: layerStyle },
      Array.isArray(data) && data.map(function (d, i) {
        if (!d) {
          return null;
        }

        var pointStyle = {
          left: d.x,
          top: d.y
        };
        return _react2.default.createElement(
          'div',
          { key: i, className: 'cloud-charts-map-custom-point', style: pointStyle },
          render && render(d, i, otherProps)
        );
      })
    );
  };

  Map.prototype.renderShootLayer = function renderShootLayer(shootProps, shootIndex) {
    if (!this.chart) {
      return null;
    }
    var className = shootProps.className,
        style = shootProps.style;

    var width = this.chart.get('width');
    var height = this.chart.get('height');
    var _size2 = this._size,
        cW = _size2[0],
        cH = _size2[1];

    var layerStyle = _extends({
      left: (cW - width) / 2,
      top: (cH - height) / 2,
      width: width,
      height: height
    }, style || {});

    return _react2.default.createElement(_index2.default, _extends({
      key: shootIndex,
      className: 'cloud-charts-map-shoot ' + (className || ''),
      width: width,
      height: height,
      style: layerStyle,
      getPosition: this.convertPosition
    }, shootProps));
  };

  Map.prototype.renderSouthChinaSea = function renderSouthChinaSea(config) {
    if (config.showSouthChinaSea === undefined || config.showSouthChinaSea) {
      var southChinaSeaKey = this.state.southChinaSeaKey;

      var _ref = config.background || {},
          fill = _ref.fill;

      var mapColor = fill || _index4.default['widgets-map-area-bg'];

      return _react2.default.createElement(_southChinaSea2.default, { key: southChinaSeaKey, className: 'cloud-charts-map-south-china-sea', fontColor: mapColor, landColor: mapColor, lineColor: mapColor, boxColor: mapColor, islandColor: mapColor });
    } else {
      return null;
    }
  };

  Map.prototype.render = function render() {
    var _this3 = this;

    var _props = this.props,
        _props$className = _props.className,
        className = _props$className === undefined ? '' : _props$className,
        style = _props.style,
        children = _props.children,
        data = _props.data,
        width = _props.width,
        height = _props.height,
        padding = _props.padding,
        geoData = _props.geoData,
        config = _props.config,
        animate = _props.animate,
        language = _props.language,
        customChart = _props.customChart,
        otherProps = _objectWithoutProperties(_props, ['className', 'style', 'children', 'data', 'width', 'height', 'padding', 'geoData', 'config', 'animate', 'language', 'customChart']);

    var _state = this.state,
        customPointLayer = _state.customPointLayer,
        shootLayer = _state.shootLayer;

    return _react2.default.createElement(
      'div',
      _extends({ ref: function ref(dom) {
          return _this3.chartDom = dom;
        }, id: this.chartId, className: rootClassName + 'G2Map ' + className, style: style }, otherProps),
      this.renderSouthChinaSea(config),
      shootLayer.length > 0 && shootLayer.map(function (shoot, i) {
        return _this3.renderShootLayer(shoot, i);
      }),
      customPointLayer.length > 0 && customPointLayer.map(function (layer, i) {
        return _this3.renderCustomPointLayer(layer, i);
      }),
      _react2.default.createElement('div', { className: 'cloud-charts-map-legend', id: this.chartId + '-legend' })
    );
  };

  return Map;
}(MapBase);

// 地图不需要校验data


delete Map.propTypes.data;

var MapClass = (0, _errorWrap2.default)(Map);

/**
 * @return {null}
 */
MapClass.Area = function WidgetsMapArea() {
  return null;
};
MapClass.Area.displayName = _G2Map.AREA_NAME;

/**
 * @return {null}
 */
MapClass.Point = function WidgetsMapPoint() {
  return null;
};
MapClass.Point.displayName = _G2Map.POINT_NAME;

/**
 * @return {null}
 */
MapClass.HeatMap = function WidgetsMapHeatMap() {
  return null;
};
MapClass.HeatMap.displayName = _G2Map.HEAT_MAP_NAME;

/**
 * @return {null}
 */
MapClass.Shoot = function WidgetsMapShoot() {
  return null;
};
MapClass.Shoot.displayName = _G2Map.SHOOT_NAME;

/**
 * @return {null}
 */
MapClass.Custom = function WidgetsMapCustom() {
  return null;
};
MapClass.Custom.displayName = _G2Map.CUSTOM_NAME;

// 南海诸岛组件
MapClass.SouthChinaSea = _southChinaSea2.default;

// 中国地图 Geo 数据
MapClass.chinaGeoData = _chinaGeo2.default;

// 省份全称转简称数据
MapClass.provinceName = _chinaGeoInfo.provinceName;

// 省市经纬度数据
MapClass.positionMap = _chinaGeoInfo.positionMap;

exports.default = MapClass;