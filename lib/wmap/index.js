"use strict";

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _g2Factory = require("../common/g2Factory");

var _g2Factory2 = _interopRequireDefault(_g2Factory);

var _G2Map = require("./G2Map");

var _G2Map2 = _interopRequireDefault(_G2Map);

var _southChinaSea = require("./mapData/southChinaSea");

var _southChinaSea2 = _interopRequireDefault(_southChinaSea);

var _index = require("../theme/index");

var _index2 = _interopRequireDefault(_index);

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
      customPointLayer: []
    };
    return _this;
  }

  // componentDidMount() {
  //   super.componentDidMount();
  //
  //   setTimeout(() => {
  //     this.convertChildren();
  //   }, 0);
  // }

  Map.prototype.componentDidUpdate = function componentDidUpdate(prevProps, prevState, snapshot) {
    if (!this.isReRendering && this.props.children !== prevProps.children) {
      this.convertChildren(this.props.children, this.props.config);
    }

    _MapBase.prototype.componentDidUpdate.call(this, prevProps, prevState, snapshot);
  };

  Map.prototype.shouldComponentUpdate = function shouldComponentUpdate(nextProps, nextState) {
    var newLayer = nextState.customPointLayer;
    var oldLayer = this.state.customPointLayer;

    if (this.isReRendering || !this.chart) {
      return false;
    }

    return newLayer !== oldLayer;
  };

  Map.prototype.convertChildren = function convertChildren() {
    var _this2 = this;

    var children = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.props.children;
    var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.props.config;

    var customPointLayer = [];
    _react2.default.Children.forEach(children, function (child) {
      if (!child) {
        return;
      }
      if (child.type.displayName === 'WidgetsMapCustom') {
        customPointLayer.push(child.props);
        return;
      }

      var _child$props = child.props,
          data = _child$props.data,
          propsConfig = _objectWithoutProperties(_child$props, ["data"]);

      var layerConfig = _extends({}, config, propsConfig);

      _this2.chartProcess.changeData.call(_this2, _this2.chart, layerConfig, child.type.displayName, data);
    });
    this.setState({
      customPointLayer: customPointLayer
    });
  };

  Map.prototype.renderCustomPointLayer = function renderCustomPointLayer(layer, layerIndex) {
    var _this3 = this;

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
        var point = _G2Map.convertPointPosition.call(_this3, d);
        point = _this3.bgMapView.getXY(point);
        if (!point) {
          return null;
        }

        var pointStyle = {
          left: point.x,
          top: point.y
        };
        return _react2.default.createElement(
          "div",
          { key: i, className: "aisc-widgets-map-custom-point", style: pointStyle },
          render && render(d, i, otherProps)
        );
      })
    );
  };

  Map.prototype.renderSouthChinaSea = function renderSouthChinaSea(config) {
    if (config.showSouthChinaSea === undefined || config.showSouthChinaSea) {
      var _ref = config.background || {},
          fill = _ref.fill;

      var mapColor = fill || _index2.default['widgets-map-area-bg'];

      return _react2.default.createElement(_southChinaSea2.default, { className: "aisc-widgets-map-south-china-sea", fontColor: mapColor, landColor: mapColor, lineColor: mapColor, boxColor: mapColor, islandColor: mapColor });
    } else {
      return null;
    }
  };

  Map.prototype.render = function render() {
    var _this4 = this;

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
        otherProps = _objectWithoutProperties(_props, ["className", "style", "children", "data", "width", "height", "padding", "geoData", "config"]);

    var customPointLayer = this.state.customPointLayer;

    return _react2.default.createElement(
      "div",
      _extends({ ref: function ref(dom) {
          return _this4.chartDom = dom;
        }, id: this.chartId, className: rootClassName + 'G2Map ' + className, style: style }, otherProps),
      this.renderSouthChinaSea(config),
      customPointLayer.length > 0 && customPointLayer.map(function (layer, i) {
        return _this4.renderCustomPointLayer(layer, i);
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
Map.Custom = function WidgetsMapCustom() {
  return null;
};
Map.Custom.displayName = _G2Map.CUSTOM_NAME;

exports.default = Map;
module.exports = exports["default"];