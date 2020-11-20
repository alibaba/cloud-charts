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

require("./index.scss");

var prefix = 'cloud-wicon';

var Wicon = /*#__PURE__*/function (_React$Component) {
  (0, _inheritsLoose2["default"])(Wicon, _React$Component);

  function Wicon(props) {
    var _this;

    _this = _React$Component.call(this, props) || this; // 图表初始化时记录日志

    (0, _log["default"])('Wicon', 'init');
    return _this;
  }

  var _proto = Wicon.prototype;

  _proto.render = function render() {
    var _classNames;

    var _this$props = this.props,
        type = _this$props.type,
        size = _this$props.size,
        className = _this$props.className,
        status = _this$props.status,
        reverse = _this$props.reverse,
        other = (0, _objectWithoutPropertiesLoose2["default"])(_this$props, ["type", "size", "className", "status", "reverse"]);
    var classes = (0, _classnames["default"])((_classNames = {
      'cloud-charts': true
    }, _classNames[prefix + "-" + type] = !!type, _classNames["" + prefix] = true, _classNames[prefix + "-" + size] = !!size, _classNames[prefix + "-" + (0, _common.getStatusColorName)(status)] = !!status, _classNames[prefix + "-reverse"] = !!reverse, _classNames[className] = !!className, _classNames));
    return /*#__PURE__*/_react["default"].createElement("i", (0, _extends2["default"])({
      className: classes
    }, other));
  };

  return Wicon;
}(_react["default"].Component);

exports["default"] = Wicon;
Wicon.displayName = 'Wicon';
Wicon.defaultProps = {
  size: 'big',
  type: 'monitor',
  status: 'none'
};
Wicon.propTypes = {
  type: _propTypes["default"].string
};