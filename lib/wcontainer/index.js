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

var _divider = _interopRequireDefault(require("./views/divider"));

var _log = _interopRequireDefault(require("../common/log"));

var _platform = require("../common/platform");

require("./index.scss");

var prefix = 'cloud-wcontainer';

var Wcontainer = /*#__PURE__*/function (_React$Component) {
  (0, _inheritsLoose2["default"])(Wcontainer, _React$Component);

  function Wcontainer(props) {
    var _this;

    _this = _React$Component.call(this, props) || this;
    _this.state = {
      criticalError: null
    }; // 图表初始化时记录日志

    (0, _log["default"])('Wcontainer', 'init');

    if (props.catchError) {
      _this.componentDidCatch = function (error, info) {
        var onError = _this.props.onError;
        var customError = null;

        if (onError) {
          customError = onError(error, info);
        }

        if (customError !== false) {
          _this.setState({
            criticalError: error
          });
        }
      };
    }

    return _this;
  } // componentDidCatch


  var _proto = Wcontainer.prototype;

  _proto.renderTitle = function renderTitle(title, titleBorder, operation, titleStyle) {
    var titleBorderCls = titleBorder ? prefix + "-title-border" : '';
    return /*#__PURE__*/_react["default"].createElement("div", {
      className: prefix + "-title " + titleBorderCls,
      style: titleStyle
    }, title, operation ? /*#__PURE__*/_react["default"].createElement("div", {
      className: prefix + "-operation"
    }, operation) : null);
  };

  _proto.renderMainNormal = function renderMainNormal(contentStyle, fullContent) {
    var _this$props = this.props,
        propsChildren = _this$props.children,
        title = _this$props.title;
    var oneChild = _react["default"].Children.count(propsChildren) === 1;

    if (oneChild && propsChildren && propsChildren.type && propsChildren.type.isG2Chart || fullContent) {
      return /*#__PURE__*/_react["default"].createElement("div", {
        className: prefix + "-main " + prefix + "-main-one-chart " + (title ? '' : 'no-title'),
        style: contentStyle
      }, propsChildren);
    }

    return /*#__PURE__*/_react["default"].createElement("div", {
      className: prefix + "-main " + (title ? '' : 'no-title'),
      style: contentStyle
    }, /*#__PURE__*/_react["default"].createElement("div", {
      className: prefix + "-row " + prefix + "-row-no-padding " + prefix + "-row-align-center"
    }, _react["default"].Children.map(propsChildren, function (child, i) {
      if (!child) {
        return child;
      }

      if (oneChild) {
        return /*#__PURE__*/_react["default"].createElement("div", {
          className: prefix + "-col " + prefix + "-col-24",
          key: i
        }, child);
      }

      if (child.type.displayName === 'Wicon' || child.type.displayName === 'Wcircle') {
        return /*#__PURE__*/_react["default"].createElement("div", {
          className: prefix + "-col " + prefix + "-col-fixed-2",
          key: i
        }, child);
      }

      if (child.type.displayName === 'CloudChartsG2MiniLine') {
        return /*#__PURE__*/_react["default"].createElement("div", {
          className: prefix + "-col " + prefix + "-col-fixed-4",
          key: i
        }, child);
      }

      if (child.type.displayName === 'Divider') {
        return /*#__PURE__*/_react["default"].createElement("div", {
          className: prefix + "-col " + prefix + "-col-fixed-1",
          key: i
        }, child);
      }

      return /*#__PURE__*/_react["default"].createElement("div", {
        className: prefix + "-col",
        key: i
      }, child);
    })));
  };

  _proto.renderMainCross = function renderMainCross(contentStyle) {
    var maxColPerRow = 0;
    var currentColPerRow = 0; // 计算栅格的ColSpan

    _react["default"].Children.forEach(this.props.children, function (child) {
      if (child.type.displayName !== 'Divider') {
        currentColPerRow += 1;
      } else if (child.type && child.type !== 'combiner') {
        if (currentColPerRow > maxColPerRow) {
          maxColPerRow = currentColPerRow;
        }

        currentColPerRow = 0;
      }
    });

    var ColPerRow = ~~(24 / maxColPerRow);
    return /*#__PURE__*/_react["default"].createElement("div", {
      className: prefix + "-main " + prefix + "-cross",
      style: contentStyle
    }, /*#__PURE__*/_react["default"].createElement("div", {
      className: prefix + "-multi-row-container"
    }, chunks(this.props.children, ColPerRow)));
  };

  _proto.renderError = function renderError() {
    var title = this.props.title;
    var stack = this.state.criticalError.stack;
    return /*#__PURE__*/_react["default"].createElement("div", {
      className: prefix + "-main " + prefix + "-main-critical-error " + (title ? '' : 'no-title')
    }, /*#__PURE__*/_react["default"].createElement("pre", null, stack ? stack : this.state.criticalError.toString()));
  };

  _proto.render = function render() {
    var _classNames,
        _this2 = this;

    var _this$props2 = this.props,
        width = _this$props2.width,
        height = _this$props2.height,
        arrange = _this$props2.arrange,
        title = _this$props2.title,
        titleBorder = _this$props2.titleBorder,
        operation = _this$props2.operation,
        className = _this$props2.className,
        style = _this$props2.style,
        titleStyle = _this$props2.titleStyle,
        contentStyle = _this$props2.contentStyle,
        fullContent = _this$props2.fullContent,
        isMobile = _this$props2.isMobile,
        catchError = _this$props2.catchError,
        otherProps = (0, _objectWithoutPropertiesLoose2["default"])(_this$props2, ["width", "height", "arrange", "title", "titleBorder", "operation", "className", "style", "titleStyle", "contentStyle", "fullContent", "isMobile", "catchError"]);
    var mainClasses = (0, _classnames["default"])((_classNames = {
      'cloud-charts': true
    }, _classNames["" + prefix] = true, _classNames[prefix + "-mobile"] = (0, _platform.isMobileWithProps)(this.props, isMobile), _classNames[className] = !!className, _classNames));
    var criticalError = catchError && this.state.criticalError;
    return /*#__PURE__*/_react["default"].createElement("div", (0, _extends2["default"])({
      className: mainClasses,
      style: (0, _extends2["default"])({
        width: width,
        minHeight: height,
        height: height
      }, style)
    }, otherProps, {
      ref: function ref(o) {
        _this2.container = o;
      }
    }), title && this.renderTitle(title, titleBorder, operation, titleStyle), criticalError && this.renderError(), !criticalError && arrange === 'normal' && this.renderMainNormal(contentStyle, fullContent), !criticalError && arrange === 'cross' && this.renderMainCross(contentStyle));
  };

  return Wcontainer;
}(_react["default"].Component);

exports["default"] = Wcontainer;
Wcontainer.displayName = 'Wcontainer';
Wcontainer.defaultProps = {
  arrange: 'normal',
  height: '100%',
  operation: '',
  titleBorder: true,
  catchError: true
};
Wcontainer.propTypes = {
  title: _propTypes["default"].oneOfType([_propTypes["default"].string, _propTypes["default"].bool]),
  height: _propTypes["default"].oneOfType([_propTypes["default"].string, _propTypes["default"].number])
};

function chunks(arr, maxSpan) {
  var rs = [];
  var oneRow = [];

  _react["default"].Children.forEach(arr, function (child, i) {
    if (child.type && child.type.displayName === 'Divider') {
      rs.push( /*#__PURE__*/_react["default"].createElement("div", {
        className: prefix + "-row " + prefix + "-row-across " + prefix + "-row-align-center",
        key: i
      }, oneRow));
      oneRow = [];
    } else if (child.type === 'combiner' && oneRow.length) {
      var lastChild = oneRow[oneRow.length - 1].props.children;
      var lastSpan = oneRow[oneRow.length - 1].props.span;
      oneRow[oneRow.length - 1] = /*#__PURE__*/_react["default"].createElement("div", {
        className: prefix + "-col " + prefix + "-col-" + (lastSpan + maxSpan),
        key: i
      }, lastChild);
    } else if (i === arr.length - 1) {
      oneRow.push( /*#__PURE__*/_react["default"].createElement("div", {
        className: prefix + "-col " + prefix + "-col-" + maxSpan,
        key: i
      }, child));
      rs.push( /*#__PURE__*/_react["default"].createElement("div", {
        className: prefix + "-row " + prefix + "-row-across " + prefix + "-row-align-center",
        key: i
      }, oneRow));
    } else {
      oneRow.push( /*#__PURE__*/_react["default"].createElement("div", {
        className: prefix + "-col " + prefix + "-col-" + maxSpan,
        key: i
      }, child));
    }
  });

  return rs;
}

Wcontainer.divider = _divider["default"];
Wcontainer.combiner = 'combiner';