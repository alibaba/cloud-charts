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

var _common = require("../common/common");

var _log = _interopRequireDefault(require("../common/log"));

require("./index.scss");

var prefix = 'cloud-wcircle';

var Wcircle = /*#__PURE__*/function (_React$Component) {
  (0, _inheritsLoose2["default"])(Wcircle, _React$Component);

  function Wcircle(props) {
    var _this;

    _this = _React$Component.call(this, props) || this; // 图表初始化时记录日志

    (0, _log["default"])('Wcircle', 'init');
    return _this;
  }

  var _proto = Wcircle.prototype;

  _proto.renderBottom = function renderBottom(bottomTitle, bottomUnit, bottomNumber, bottomTrend) {
    var numberTrendIcon;
    var numberClasses = prefix + "-bottom-number";

    if (bottomTrend === 'raise') {
      numberClasses += ' raise';
      numberTrendIcon = /*#__PURE__*/_react["default"].createElement(_arrow["default"], {
        type: "up"
      });
    } else if (bottomTrend === 'drop') {
      numberClasses += ' drop';
      numberTrendIcon = /*#__PURE__*/_react["default"].createElement(_arrow["default"], {
        type: "down"
      });
    }

    if (!!bottomTitle || !!bottomUnit || !!bottomNumber || !!bottomTrend) {
      return /*#__PURE__*/_react["default"].createElement("div", {
        className: prefix + "-bottom-block"
      }, bottomTrend && /*#__PURE__*/_react["default"].createElement("span", {
        className: prefix + "-leftIcon"
      }, numberTrendIcon), /*#__PURE__*/_react["default"].createElement("span", {
        className: numberClasses
      }, bottomNumber, bottomUnit && /*#__PURE__*/_react["default"].createElement("span", {
        className: prefix + "-bottom-unit"
      }, bottomUnit)), /*#__PURE__*/_react["default"].createElement("p", {
        className: prefix + "-title"
      }, bottomTitle));
    }
  };

  _proto.renderMain = function renderMain(_ref) {
    var title = _ref.title,
        unit = _ref.unit,
        children = _ref.children,
        trend = _ref.trend,
        type = _ref.type,
        percent = _ref.percent,
        radius = _ref.radius,
        strokeWidth = _ref.strokeWidth,
        status = _ref.status,
        customColor = _ref.color,
        backgroundColor = _ref.backgroundColor,
        bottomTitle = _ref.bottomTitle,
        bottomUnit = _ref.bottomUnit,
        bottomNumber = _ref.bottomNumber,
        bottomTrend = _ref.bottomTrend,
        linecap = _ref.linecap;
    var numberTrendIcon;
    var numberClasses = prefix + "-number";
    var style = {};

    if (customColor) {
      style.color = customColor;
    }

    if (trend === 'raise') {
      numberClasses += ' raise';
      numberTrendIcon = /*#__PURE__*/_react["default"].createElement(_arrow["default"], {
        type: "up"
      });
    } else if (trend === 'drop') {
      numberClasses += ' drop';
      numberTrendIcon = /*#__PURE__*/_react["default"].createElement(_arrow["default"], {
        type: "down"
      });
    }

    var radiusInner = radius - strokeWidth / 2;
    var pathString = "M " + radius + "," + radius + " m 0," + radiusInner + "\n     a " + radiusInner + "," + radiusInner + " 0 1 1 0,-" + 2 * radiusInner + "\n     a " + radiusInner + "," + radiusInner + " 0 1 1 0," + 2 * radiusInner;
    var circleLengh = Math.PI * 2 * radiusInner;
    var openWidth, pathDashoffset, strokeDashoffset, strokePathStyle;

    if (type === 'circle') {
      openWidth = 0;
      pathDashoffset = '0px';
      strokeDashoffset = "-" + circleLengh / 2 + "px";
      strokePathStyle = {
        strokeDasharray: percent * (circleLengh - openWidth) + "px " + (1 - percent) * (circleLengh - openWidth) + "px",
        strokeDashoffset: strokeDashoffset
      };
    } else if (type === 'gauge') {
      openWidth = Math.PI * 0.45 * radiusInner;
      pathDashoffset = "-" + openWidth / 2 + "px";
      strokeDashoffset = "-" + openWidth / 2 + "px";
      strokePathStyle = {
        strokeDasharray: percent * (circleLengh - openWidth) + "px " + circleLengh + "px",
        strokeDashoffset: strokeDashoffset
      };
    }

    var pathStyle = {
      strokeDasharray: circleLengh - openWidth + "px " + circleLengh + "px",
      strokeDashoffset: pathDashoffset
    };

    if (backgroundColor) {
      pathStyle.stroke = backgroundColor;
    }

    var svgStyle = {
      height: radius * 2,
      width: radius * 2
    };
    return /*#__PURE__*/_react["default"].createElement("div", {
      className: prefix + "-main " + (0, _common.getStatusColorName)(status),
      style: style
    }, /*#__PURE__*/_react["default"].createElement("div", {
      className: prefix + "-ratio"
    }, /*#__PURE__*/_react["default"].createElement("div", {
      className: prefix + "-ratio-svg",
      style: svgStyle
    }, /*#__PURE__*/_react["default"].createElement("svg", {
      width: "100%",
      height: "100%",
      xmlns: "http://www.w3.org/2000/svg",
      version: "1.1",
      className: linecap
    }, /*#__PURE__*/_react["default"].createElement("path", {
      className: prefix + "-svg-bg",
      d: pathString,
      strokeWidth: strokeWidth,
      style: pathStyle
    }), /*#__PURE__*/_react["default"].createElement("path", {
      className: prefix + "-svg-ring",
      d: pathString,
      strokeWidth: strokeWidth,
      style: strokePathStyle
    }))), /*#__PURE__*/_react["default"].createElement("div", {
      className: prefix + "-number-block"
    }, /*#__PURE__*/_react["default"].createElement("div", {
      className: prefix + "-number-middle"
    }, trend && /*#__PURE__*/_react["default"].createElement("span", {
      className: prefix + "-leftIcon"
    }, numberTrendIcon), /*#__PURE__*/_react["default"].createElement("span", {
      className: numberClasses
    }, children, unit && /*#__PURE__*/_react["default"].createElement("span", {
      className: prefix + "-unit"
    }, unit)), title && /*#__PURE__*/_react["default"].createElement("p", {
      className: prefix + "-title"
    }, title))), type === 'gauge' && this.renderBottom(bottomTitle, bottomUnit, bottomNumber, bottomTrend)));
  };

  _proto.render = function render() {
    var _classNames;

    var _this$props = this.props,
        className = _this$props.className,
        style = _this$props.style,
        trend = _this$props.trend,
        type = _this$props.type,
        percent = _this$props.percent,
        title = _this$props.title,
        unit = _this$props.unit,
        children = _this$props.children,
        radius = _this$props.radius,
        strokeWidth = _this$props.strokeWidth,
        status = _this$props.status,
        color = _this$props.color,
        backgroundColor = _this$props.backgroundColor,
        linecap = _this$props.linecap,
        bottomTitle = _this$props.bottomTitle,
        bottomUnit = _this$props.bottomUnit,
        bottomNumber = _this$props.bottomNumber,
        bottomTrend = _this$props.bottomTrend,
        otherProps = (0, _objectWithoutPropertiesLoose2["default"])(_this$props, ["className", "style", "trend", "type", "percent", "title", "unit", "children", "radius", "strokeWidth", "status", "color", "backgroundColor", "linecap", "bottomTitle", "bottomUnit", "bottomNumber", "bottomTrend"]);
    var mainClasses = (0, _classnames["default"])((_classNames = {
      'cloud-charts': true
    }, _classNames[prefix] = true, _classNames[className] = !!className, _classNames));
    return /*#__PURE__*/_react["default"].createElement("div", (0, _extends2["default"])({
      className: mainClasses,
      style: style
    }, otherProps), this.renderMain({
      title: title,
      unit: unit,
      children: children,
      trend: trend,
      percent: percent,
      type: type,
      radius: radius,
      strokeWidth: strokeWidth,
      status: status,
      color: color,
      backgroundColor: backgroundColor,
      linecap: linecap,
      bottomTitle: bottomTitle,
      bottomUnit: bottomUnit,
      bottomNumber: bottomNumber,
      bottomTrend: bottomTrend
    }));
  };

  return Wcircle;
}(_react["default"].Component);

exports["default"] = Wcircle;
Wcircle.displayName = 'Wcircle';
Wcircle.defaultProps = {
  type: 'circle',
  title: '',
  percent: 0,
  unit: '',
  status: 'normal',
  radius: 70,
  strokeWidth: 6,
  linecap: 'round'
};
Wcircle.propTypes = {
  type: _propTypes["default"].oneOf(['gauge', 'circle']),
  title: _propTypes["default"].node,
  percent: function percent(props, propName) {
    if (!(props[propName] >= 0 && props[propName] <= 1)) {
      return new Error('percent Validation failed!');
    }
  },
  unit: _propTypes["default"].node,
  status: _propTypes["default"].oneOf(['normal', 'warning', 'error', 'blue', 'orange', 'red']),
  // 半径
  radius: function radius(props, propName) {
    if (!(props[propName] >= 10 && props[propName] <= 100)) {
      return new Error('radius Validation failed!');
    }
  },
  // 粗细
  strokeWidth: function strokeWidth(props, propName) {
    if (!(props[propName] >= 2 && props[propName] <= 10)) {
      return new Error('strokeWidth Validation failed!');
    }
  },
  // 趋势
  trend: _propTypes["default"].oneOf(['raise', 'drop']),
  bottomTitle: _propTypes["default"].node,
  bottomUnit: _propTypes["default"].node,
  bottomNumber: _propTypes["default"].node,
  bottomTrend: _propTypes["default"].oneOf(['raise', 'drop'])
};