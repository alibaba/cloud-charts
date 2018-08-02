"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _g2Factory = require("../common/g2Factory");

var _g2Factory2 = _interopRequireDefault(_g2Factory);

var _G2Map = require("./G2Map");

var _G2Map2 = _interopRequireDefault(_G2Map);

var _southChinaSea = require("./mapData/southChinaSea");

var _southChinaSea2 = _interopRequireDefault(_southChinaSea);

var _index = require("../theme/index");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MapBase = (0, _g2Factory2.default)('G2Map', _G2Map2.default, false);
var rootClassName = 'aisc-widgets ';
var southChinaSea = (0, _southChinaSea2.default)({
  className: 'aisc-widgets-map-south-china-sea',
  fontColor: _index.color.widgetsMapAreaBg,
  landColor: _index.color.widgetsMapAreaBg,
  lineColor: _index.color.widgetsMapAreaBg,
  boxColor: _index.color.widgetsMapAreaBg,
  islandColor: _index.color.widgetsMapAreaBg
});

var Map = function (_MapBase) {
  _inherits(Map, _MapBase);

  function Map(props, context) {
    _classCallCheck(this, Map);

    var _this = _possibleConstructorReturn(this, (Map.__proto__ || Object.getPrototypeOf(Map)).call(this, props, context));

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

  _createClass(Map, [{
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(nextProps) {
      if (nextProps.children !== this.props.children) {
        this.convertChildren(nextProps.children, nextProps.config);
      }

      _get(Map.prototype.__proto__ || Object.getPrototypeOf(Map.prototype), "componentWillReceiveProps", this).call(this, nextProps);
    }
  }, {
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate(nextProps, nextState) {
      var newLayer = nextState.customPointLayer;
      var oldLayer = this.state.customPointLayer;


      return _get(Map.prototype.__proto__ || Object.getPrototypeOf(Map.prototype), "shouldComponentUpdate", this).call(this, nextProps, nextState) || newLayer !== oldLayer;
    }
  }, {
    key: "convertChildren",
    value: function convertChildren() {
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
    }
  }, {
    key: "renderCustomPointLayer",
    value: function renderCustomPointLayer(layer, layerIndex) {
      var _this3 = this;

      var data = layer.data,
          render = layer.render,
          otherProps = _objectWithoutProperties(layer, ["data", "render"]);

      var width = this.chart.get('width');
      var height = this.chart.get('height');

      var _size = _slicedToArray(this._size, 2),
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
          var point = _G2Map.convertPointPosition.call(_this3, d, _this3.config.projection);
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
    }
  }, {
    key: "render",
    value: function render() {
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
          config = _props.config,
          otherProps = _objectWithoutProperties(_props, ["className", "style", "children", "data", "width", "height", "padding", "config"]);

      var customPointLayer = this.state.customPointLayer;

      return _react2.default.createElement(
        "div",
        _extends({ ref: function ref(dom) {
            return _this4.chartDom = dom;
          }, id: this.chartId, className: rootClassName + 'G2Map ' + className, style: style }, otherProps),
        config.showSouthChinaSea === undefined || config.showSouthChinaSea ? southChinaSea : null,
        customPointLayer.length > 0 && customPointLayer.map(function (layer, i) {
          return _this4.renderCustomPointLayer(layer, i);
        }),
        _react2.default.createElement("div", { className: "aisc-widgets-map-legend", id: this.chartId + '-legend' })
      );
    }
  }]);

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
Map.Area.displayName = 'WidgetsMapArea';

/**
 * @return {null}
 */
Map.Point = function WidgetsMapPoint() {
  return null;
};
Map.Point.displayName = 'WidgetsMapPoint';

/**
 * @return {null}
 */
Map.Custom = function WidgetsMapCustom() {
  return null;
};
Map.Custom.displayName = 'WidgetsMapCustom';

exports.default = Map;
module.exports = exports["default"];