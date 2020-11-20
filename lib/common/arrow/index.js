'use strict';

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = void 0;

var _inheritsLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/inheritsLoose"));

var React = _interopRequireWildcard(require("react"));

var _classnames = _interopRequireDefault(require("classnames"));

require("./index.scss");

var prefix = 'cloud-warrow';

var Wcircle = /*#__PURE__*/function (_React$Component) {
  (0, _inheritsLoose2["default"])(Wcircle, _React$Component);

  function Wcircle() {
    return _React$Component.apply(this, arguments) || this;
  }

  var _proto = Wcircle.prototype;

  _proto.render = function render() {
    var type = this.props.type;
    var mainClasses = (0, _classnames["default"])(prefix, prefix + "-" + type);
    return /*#__PURE__*/React.createElement("i", {
      className: mainClasses
    });
  };

  return Wcircle;
}(React.Component);

exports["default"] = Wcircle;
Wcircle.defaultProps = {
  type: 'up'
};