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

var _arrow = _interopRequireDefault(require("../common/arrow"));

var _log = _interopRequireDefault(require("../common/log"));

require("./index.scss");

var prefix = 'cloud-wnumber';

function getTrendIcon(trend) {
  if (trend === 'raise') {
    return /*#__PURE__*/_react["default"].createElement(_arrow["default"], {
      type: "up"
    });
  } else if (trend === 'drop') {
    return /*#__PURE__*/_react["default"].createElement(_arrow["default"], {
      type: "down"
    });
  }
}

var Wnumber = /*#__PURE__*/function (_React$Component) {
  (0, _inheritsLoose2["default"])(Wnumber, _React$Component);

  function Wnumber(props) {
    var _this;

    _this = _React$Component.call(this, props) || this; // 图表初始化时记录日志

    (0, _log["default"])('Wnumber', 'init');
    return _this;
  }

  var _proto = Wnumber.prototype;

  _proto.renderBottom = function renderBottom(bottomTitle) {
    if (!!bottomTitle) {
      return /*#__PURE__*/_react["default"].createElement("div", {
        className: prefix + "-bottomTitle"
      }, bottomTitle);
    }
  };

  _proto.renderMain = function renderMain(status, unit, numberTrend, rightRatioTrend, rightTitle, rightRatio, trend, children) {
    var numberTrendIcon = getTrendIcon(numberTrend);
    var numberClasses = prefix + "-number";
    var rightRatioTrendIcon = getTrendIcon(rightRatioTrend);
    var rightRatioTrendClasses = prefix + "-rightRatio " + rightRatioTrend;
    return /*#__PURE__*/_react["default"].createElement("div", {
      className: prefix + "-main " + numberTrend + " " + status
    }, numberTrend && /*#__PURE__*/_react["default"].createElement("span", {
      className: prefix + "-leftIcon"
    }, numberTrendIcon), /*#__PURE__*/_react["default"].createElement("span", {
      className: numberClasses
    }, children), unit && /*#__PURE__*/_react["default"].createElement("span", {
      className: prefix + "-unit"
    }, unit), rightTitle && /*#__PURE__*/_react["default"].createElement("span", {
      className: prefix + "-rightTitle"
    }, rightTitle), rightRatio && /*#__PURE__*/_react["default"].createElement("span", {
      className: rightRatioTrendClasses
    }, rightRatioTrend && /*#__PURE__*/_react["default"].createElement("span", {
      className: prefix + "-rightRatioIcon"
    }, rightRatioTrendIcon), rightRatio), trend && /*#__PURE__*/_react["default"].createElement("span", {
      className: prefix + "-trend"
    }, trend()));
  };

  _proto.render = function render() {
    var _classNames;

    var _this$props = this.props,
        className = _this$props.className,
        style = _this$props.style,
        status = _this$props.status,
        unit = _this$props.unit,
        numberTrend = _this$props.numberTrend,
        rightRatioTrend = _this$props.rightRatioTrend,
        rightTitle = _this$props.rightTitle,
        rightRatio = _this$props.rightRatio,
        trend = _this$props.trend,
        children = _this$props.children,
        bottomTitle = _this$props.bottomTitle,
        otherProps = (0, _objectWithoutPropertiesLoose2["default"])(_this$props, ["className", "style", "status", "unit", "numberTrend", "rightRatioTrend", "rightTitle", "rightRatio", "trend", "children", "bottomTitle"]);
    var mainClasses = (0, _classnames["default"])((_classNames = {
      'cloud-charts': true
    }, _classNames["" + prefix] = true, _classNames[className] = !!className, _classNames));
    return /*#__PURE__*/_react["default"].createElement("div", (0, _extends2["default"])({
      className: mainClasses,
      style: style
    }, otherProps), this.renderMain(status, unit, numberTrend, rightRatioTrend, rightTitle, rightRatio, trend, children), this.renderBottom(bottomTitle));
  };

  return Wnumber;
}(_react["default"].Component);

exports["default"] = Wnumber;
Wnumber.displayName = 'Wnumber';
Wnumber.defaultProps = {
  numberTrend: '',
  rightRatioTrend: '',
  status: ''
};
Wnumber.propTypes = {
  bottomTitle: _propTypes["default"].node,
  unit: _propTypes["default"].node,
  trend: _propTypes["default"].func
};