'use strict';

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = void 0;

var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutPropertiesLoose"));

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _inheritsLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/inheritsLoose"));

var React = _interopRequireWildcard(require("react"));

var _classnames = _interopRequireDefault(require("classnames"));

require("./index.scss");

var _log = _interopRequireDefault(require("../common/log"));

var _shoot = _interopRequireDefault(require("./shoot"));

var prefix = 'cloud-wshoot';

var Wshoot = /*#__PURE__*/function (_React$Component) {
  (0, _inheritsLoose2["default"])(Wshoot, _React$Component);

  function Wshoot(props) {
    var _this;

    _this = _React$Component.call(this, props) || this; // 图表初始化时记录日志

    _this.canvas = null;
    _this.shoot = null;
    (0, _log["default"])('Wshoot', 'init');
    return _this;
  }

  var _proto = Wshoot.prototype;

  _proto.componentDidMount = function componentDidMount() {
    var _this$props = this.props,
        width = _this$props.width,
        height = _this$props.height,
        config = _this$props.config,
        getPosition = _this$props.getPosition,
        data = _this$props.data;
    this.shoot = new _shoot["default"](this.canvas, getPosition, (0, _extends2["default"])({
      width: width,
      height: height
    }, config));
    this.shoot.draw(data);
  };

  _proto.componentDidUpdate = function componentDidUpdate(prevProps) {
    var _this$props2 = this.props,
        newData = _this$props2.data,
        newWidth = _this$props2.width,
        newHeight = _this$props2.height,
        getPosition = _this$props2.getPosition;
    var oldData = prevProps.data,
        oldWidth = prevProps.width,
        oldHeight = prevProps.height; // 更新 getPosition 函数

    this.shoot.getPosition = getPosition; // 绘制飞线

    if (newData !== oldData) {
      this.shoot.draw(newData);
    } // 调整尺寸


    if (newWidth !== oldWidth || newHeight !== oldHeight) {
      this.shoot.changeSize(newWidth, newHeight);
    }
  };

  _proto.componentWillUnmount = function componentWillUnmount() {
    this.shoot && this.shoot.destroy();
  };

  _proto.render = function render() {
    var _classNames,
        _this2 = this;

    var _this$props3 = this.props,
        className = _this$props3.className,
        data = _this$props3.data,
        config = _this$props3.config,
        getPosition = _this$props3.getPosition,
        otherProps = (0, _objectWithoutPropertiesLoose2["default"])(_this$props3, ["className", "data", "config", "getPosition"]);
    var mainClasses = (0, _classnames["default"])(prefix, (_classNames = {}, _classNames[className] = !!className, _classNames));
    return /*#__PURE__*/React.createElement("canvas", (0, _extends2["default"])({
      className: mainClasses
    }, otherProps, {
      ref: function ref(c) {
        return _this2.canvas = c;
      }
    }));
  };

  return Wshoot;
}(React.Component);

exports["default"] = Wshoot;
Wshoot.defaultProps = {
  width: 800,
  height: 600,
  config: {}
};