'use strict';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutPropertiesLoose"));

var _inheritsLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/inheritsLoose"));

var _react = _interopRequireDefault(require("react"));

var _classnames = _interopRequireDefault(require("classnames"));

var _log = _interopRequireDefault(require("../common/log"));

var _locale = _interopRequireDefault(require("./locale"));

require("./index.scss");

var prefix = 'cloud-wplaceholder'; // 默认显示的图标

var svgWidth = 36,
    svgHeight = 32,
    itemHeight1 = 20,
    itemHeight2 = 26,
    itemHeight3 = 32;

var svg = /*#__PURE__*/_react["default"].createElement("svg", {
  width: svgWidth,
  height: svgHeight,
  className: "placeholder-box"
}, /*#__PURE__*/_react["default"].createElement("rect", {
  className: "placeholder-item item-1",
  width: "8",
  height: itemHeight1,
  x: "0",
  y: svgHeight - itemHeight1
}), /*#__PURE__*/_react["default"].createElement("rect", {
  className: "placeholder-item item-2",
  width: "8",
  height: itemHeight3,
  x: "14",
  y: svgHeight - itemHeight3
}), /*#__PURE__*/_react["default"].createElement("rect", {
  className: "placeholder-item item-3",
  width: "8",
  height: itemHeight2,
  x: "28",
  y: svgHeight - itemHeight2
})); // 异常状态显示的图标


var errorSvg = /*#__PURE__*/_react["default"].createElement("svg", {
  width: "43px",
  height: "36px",
  viewBox: "0 0 43 36"
}, /*#__PURE__*/_react["default"].createElement("rect", {
  className: "placeholder-item",
  x: "0",
  y: "12",
  width: "8",
  height: "20"
}), /*#__PURE__*/_react["default"].createElement("path", {
  className: "placeholder-item",
  d: "M21,16.0139985 C19.1238002,18.3325877 18,21.285055 18,24.5 C18,27.27522 18.8374075,29.8548529 20.2733236,32 L13,32 L13,0 L21,0 L21,16.0139985 Z"
}), /*#__PURE__*/_react["default"].createElement("path", {
  className: "placeholder-item",
  d: "M34,11.2310283 C33.1898394,11.0793314 32.3541841,11 31.5,11 C29.5412332,11 27.6799005,11.4171646 26,12.1674956 L26,5 L34,5 L34,11.2310283 Z"
}), /*#__PURE__*/_react["default"].createElement("path", {
  className: "placeholder-item",
  d: "M31.5,36 C25.1487254,36 20,30.8512746 20,24.5 C20,18.1487254 25.1487254,13 31.5,13 C37.8512746,13 43,18.1487254 43,24.5 C43,30.8512746 37.8512746,36 31.5,36 Z M31.5,34 C36.7467051,34 41,29.7467051 41,24.5 C41,19.2532949 36.7467051,15 31.5,15 C26.2532949,15 22,19.2532949 22,24.5 C22,29.7467051 26.2532949,34 31.5,34 Z",
  fillRule: "nonzero"
}), /*#__PURE__*/_react["default"].createElement("rect", {
  className: "placeholder-item",
  x: "30",
  y: "17",
  width: "3",
  height: "9"
}), /*#__PURE__*/_react["default"].createElement("rect", {
  className: "placeholder-item",
  x: "30",
  y: "28",
  width: "3",
  height: "3"
})); // 无数据状态显示的图标


var noDataSvg = /*#__PURE__*/_react["default"].createElement("svg", {
  width: "43px",
  height: "36px",
  viewBox: "0 0 43 36",
  style: {
    marginLeft: 5
  }
}, /*#__PURE__*/_react["default"].createElement("polygon", {
  className: "placeholder-item",
  points: "0 12 8 12 8 32 0 32"
}), /*#__PURE__*/_react["default"].createElement("path", {
  className: "placeholder-item",
  d: "M21,16.0139985 C19.1238002,18.3325877 18,21.285055 18,24.5 C18,27.27522 18.8374075,29.8548529 20.2733236,32 L13,32 L13,0 L21,0 L21,16.0139985 Z"
}), /*#__PURE__*/_react["default"].createElement("path", {
  className: "placeholder-item",
  d: "M34,11.2310283 C33.1898394,11.0793314 32.3541841,11 31.5,11 C29.5412332,11 27.6799005,11.4171646 26,12.1674956 L26,5 L34,5 L34,11.2310283 Z"
}), /*#__PURE__*/_react["default"].createElement("path", {
  className: "placeholder-item",
  d: "M23.8056018,18.9269221 C22.6697689,20.4923786 22,22.4179728 22,24.5 C22,29.7467051 26.2532949,34 31.5,34 C33.5820272,34 35.5076214,33.3302311 37.0730779,32.1943982 L23.8056018,18.9269221 Z M25.9269221,16.8056018 L39.1943982,30.0730779 C40.3302311,28.5076214 41,26.5820272 41,24.5 C41,19.2532949 36.7467051,15 31.5,15 C29.4179728,15 27.4923786,15.6697689 25.9269221,16.8056018 Z M31.5,36 C25.1487254,36 20,30.8512746 20,24.5 C20,18.1487254 25.1487254,13 31.5,13 C37.8512746,13 43,18.1487254 43,24.5 C43,30.8512746 37.8512746,36 31.5,36 Z",
  fillRule: "nonzero"
})); // 获取显示文案


function getLocaleText(locale, loading, error, noData) {
  if (locale === void 0) {
    locale = {};
  }

  // 优先取error状态
  if (error) {
    return locale.error;
  } // 其次取loading状态


  if (loading) {
    return locale.loading;
  } // 其次取loading状态


  if (noData) {
    return locale.noData;
  }
}

var Wplaceholder = /*#__PURE__*/function (_React$Component) {
  (0, _inheritsLoose2["default"])(Wplaceholder, _React$Component);

  function Wplaceholder(props) {
    var _this;

    _this = _React$Component.call(this, props) || this; // 图表初始化时记录日志

    (0, _log["default"])('Wplaceholder', 'init');
    return _this;
  }

  var _proto = Wplaceholder.prototype;

  _proto.renderText = function renderText(loading, error, noData) {
    var _this$props = this.props,
        locale = _this$props.locale,
        language = _this$props.language,
        children = _this$props.children; // text 优先判断传入的locale，其次判断传入的language，最后取中文locale

    var text = getLocaleText(locale || _locale["default"][language] || _locale["default"]['zh-cn'], loading, error, noData) || '';

    if (children) {
      // 优先渲染children
      return /*#__PURE__*/_react["default"].createElement("div", {
        className: prefix + '-children-text'
      }, children);
    } else if (text) {
      return /*#__PURE__*/_react["default"].createElement("div", {
        className: prefix + '-children-text'
      }, text);
    } else {
      return null;
    }
  };

  _proto.render = function render() {
    var _classNames;

    var _this$props2 = this.props,
        className = _this$props2.className,
        width = _this$props2.width,
        _this$props2$height = _this$props2.height,
        height = _this$props2$height === void 0 ? '100%' : _this$props2$height,
        style = _this$props2.style,
        loading = _this$props2.loading,
        error = _this$props2.error,
        noData = _this$props2.noData,
        otherProps = (0, _objectWithoutPropertiesLoose2["default"])(_this$props2, ["className", "width", "height", "style", "loading", "error", "noData"]);
    var mainClasses = (0, _classnames["default"])(prefix, (_classNames = {
      'cloud-charts': true
    }, _classNames[prefix + '-loading'] = !error && loading, _classNames[prefix + '-no-data'] = !error && !loading && noData, _classNames[prefix + '-error'] = !!error, _classNames[className] = !!className, _classNames));
    var renderSvg = svg;

    if (error) {
      renderSvg = errorSvg;
    } else if (!loading && noData) {
      renderSvg = noDataSvg;
    }

    return /*#__PURE__*/_react["default"].createElement("div", (0, _extends2["default"])({
      className: mainClasses,
      style: (0, _extends2["default"])({
        width: width,
        height: height
      }, style)
    }, otherProps), /*#__PURE__*/_react["default"].createElement("div", {
      className: prefix + '-children'
    }, renderSvg, this.renderText(loading, error, noData)));
  };

  return Wplaceholder;
}(_react["default"].Component);

exports["default"] = Wplaceholder;
Wplaceholder.displayName = 'Wplaceholder';