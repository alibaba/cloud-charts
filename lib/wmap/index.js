"use strict";

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _g2Factory = require("../common/g2Factory");

var _g2Factory2 = _interopRequireDefault(_g2Factory);

var _G2Map = require("./G2Map");

var _G2Map2 = _interopRequireDefault(_G2Map);

var _index = require("../wshoot/index");

var _index2 = _interopRequireDefault(_index);

var _southChinaSea = require("./mapData/southChinaSea");

var _southChinaSea2 = _interopRequireDefault(_southChinaSea);

var _index3 = require("../theme/index");

var _index4 = _interopRequireDefault(_index3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults(subClass, superClass); }

var MapBase = (0, _g2Factory2.default)('G2Map', _G2Map2.default, false);
var rootClassName = 'aisc-widgets ';

var Map = function (_MapBase) {
  _inherits(Map, _MapBase);

  function Map(props, context) {
    _classCallCheck(this, Map);

    var _this = _possibleConstructorReturn(this, _MapBase.call(this, props, context));

    _this.state = {
      customPointLayer: [],
      shootLayer: []
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

  Map.prototype.convertPosition = function convertPosition(d) {
    if (!d) {
      return;
    }
    var point = _G2Map.convertPointPosition.call(this, d);
    return this.bgMapView.getXY(point);
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
        var _newData = child.props.data;
        if (Array.isArray(_newData)) {
          _newData = _newData.map(function (d) {
            var from = _extends({}, d.from);
            var to = _extends({}, d.to);
            var fromPosition = _this2.convertPosition(from);
            var toPosition = _this2.convertPosition(to);
            if (fromPosition) {
              from.x = fromPosition.x;
              from.y = fromPosition.y;
            }
            if (toPosition) {
              to.x = toPosition.x;
              to.y = toPosition.y;
            }
            return _extends({}, d, { from: from, to: to });
          });
        }
        shootLayer.push(_extends({}, child.props, { data: _newData }));
        return;
      }

      if (!isInit) {
        var _child$props = child.props,
            data = _child$props.data,
            propsConfig = _objectWithoutProperties(_child$props, ["data"]);

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
        otherProps = _objectWithoutProperties(layer, ["data", "render"]);

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
      "div",
      { key: layerIndex, className: "aisc-widgets-map-custom-container", style: layerStyle },
      Array.isArray(data) && data.map(function (d, i) {
        if (!d) {
          return null;
        }

        var pointStyle = {
          left: d.x,
          top: d.y
        };
        return _react2.default.createElement(
          "div",
          { key: i, className: "aisc-widgets-map-custom-point", style: pointStyle },
          render && render(d, i, otherProps)
        );
      })
    );
  };

  Map.prototype.renderShootLayer = function renderShootLayer(shootProps, shootIndex) {
    if (!this.chart) {
      return null;
    }
    var width = this.chart.get('width');
    var height = this.chart.get('height');
    var _size2 = this._size,
        cW = _size2[0],
        cH = _size2[1];

    var layerStyle = {
      left: (cW - width) / 2,
      top: (cH - height) / 2,
      width: width,
      height: height
    };

    return _react2.default.createElement(_index2.default, _extends({
      key: shootIndex,
      className: "aisc-widgets-map-shoot",
      width: width,
      height: height,
      style: layerStyle
    }, shootProps));
  };

  Map.prototype.renderSouthChinaSea = function renderSouthChinaSea(config) {
    if (config.showSouthChinaSea === undefined || config.showSouthChinaSea) {
      var _ref = config.background || {},
          fill = _ref.fill;

      var mapColor = fill || _index4.default['widgets-map-area-bg'];

      return _react2.default.createElement(_southChinaSea2.default, { className: "aisc-widgets-map-south-china-sea", fontColor: mapColor, landColor: mapColor, lineColor: mapColor, boxColor: mapColor, islandColor: mapColor });
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
        otherProps = _objectWithoutProperties(_props, ["className", "style", "children", "data", "width", "height", "padding", "geoData", "config", "animate", "language", "customChart"]);

    var _state = this.state,
        customPointLayer = _state.customPointLayer,
        shootLayer = _state.shootLayer;

    return _react2.default.createElement(
      "div",
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
      _react2.default.createElement("div", { className: "aisc-widgets-map-legend", id: this.chartId + '-legend' })
    );
  };

  return Map;
}(MapBase);

// 地图不需要校验data


delete Map.propTypes.data;

/**
 * @return {null}
 */
Map.Area = function WidgetsMapArea() {
  return null;
};
Map.Area.displayName = _G2Map.AREA_NAME;

/**
 * @return {null}
 */
Map.Point = function WidgetsMapPoint() {
  return null;
};
Map.Point.displayName = _G2Map.POINT_NAME;

/**
 * @return {null}
 */
Map.HeatMap = function WidgetsMapHeatMap() {
  return null;
};
Map.HeatMap.displayName = _G2Map.HEAT_MAP_NAME;

/**
 * @return {null}
 */
Map.Shoot = function WidgetsMapShoot() {
  return null;
};
Map.Shoot.displayName = _G2Map.SHOOT_NAME;

/**
 * @return {null}
 */
Map.Custom = function WidgetsMapCustom() {
  return null;
};
Map.Custom.displayName = _G2Map.CUSTOM_NAME;

exports.default = Map;
module.exports = exports["default"];