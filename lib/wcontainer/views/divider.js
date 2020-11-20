'use strict';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = void 0;

var _inheritsLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/inheritsLoose"));

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var prefix = 'cloud-wcontainer';

var Divider = /*#__PURE__*/function (_React$Component) {
  (0, _inheritsLoose2["default"])(Divider, _React$Component);

  function Divider(props) {
    return _React$Component.call(this, props) || this;
  }

  var _proto = Divider.prototype;

  _proto.render = function render() {
    return /*#__PURE__*/_react["default"].createElement("div", {
      className: prefix + "-divider"
    });
  };

  return Divider;
}(_react["default"].Component);

exports["default"] = Divider;
Divider.displayName = 'Divider';