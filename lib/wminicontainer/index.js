'use strict';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutPropertiesLoose"));

var _inheritsLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/inheritsLoose"));

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _classnames = _interopRequireDefault(require("classnames"));

var _common = require("../common/common");

var _log = _interopRequireDefault(require("../common/log"));

var _platform = require("../common/platform");

require("./index.scss");

var prefix = 'cloud-wminicontainer';

var Wminicontainer = /*#__PURE__*/function (_React$Component) {
  (0, _inheritsLoose2["default"])(Wminicontainer, _React$Component);

  function Wminicontainer(props) {
    var _this;

    _this = _React$Component.call(this, props) || this; // 图表初始化时记录日志

    (0, _log["default"])('Wminicontainer', 'init');
    return _this;
  }

  var _proto = Wminicontainer.prototype;

  _proto.render = function render() {
    var _classNames;

    var _this$props = this.props,
        _this$props$height = _this$props.height,
        height = _this$props$height === void 0 ? 80 : _this$props$height,
        className = _this$props.className,
        status = _this$props.status,
        style = _this$props.style,
        isMobile = _this$props.isMobile,
        otherProps = (0, _objectWithoutPropertiesLoose2["default"])(_this$props, ["height", "className", "status", "style", "isMobile"]);
    var mainClasses = (0, _classnames["default"])((_classNames = {
      'cloud-charts': true
    }, _classNames["" + prefix] = true, _classNames[prefix + "-mobile"] = (0, _platform.isMobileWithProps)(otherProps, isMobile), _classNames[prefix + "-" + (0, _common.getStatusColorName)(status)] = !!status, _classNames[className] = !!className, _classNames));
    return /*#__PURE__*/_react["default"].createElement("div", (0, _extends2["default"])({
      className: mainClasses,
      style: (0, _extends2["default"])({
        minHeight: height,
        height: height
      }, style)
    }, otherProps), this.props.children);
  };

  return Wminicontainer;
}(_react["default"].Component);

exports["default"] = Wminicontainer;
Wminicontainer.displayName = 'Wminicontainer';
Wminicontainer.defaultProps = {
  status: ''
};
Wminicontainer.propTypes = {
  height: _propTypes["default"].oneOfType([_propTypes["default"].string, _propTypes["default"].number])
};