"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = errorWrap;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutPropertiesLoose"));

var _inheritsLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/inheritsLoose"));

var React = _interopRequireWildcard(require("react"));

/*#__PURE__*/

/**
 * errorWrap 错误捕获HOC
 *
 * @param {React.Component} Component 组件
 *
 * @return {React.Component}
 * */
function errorWrap(Component) {
  var ErrorBoundary = /*#__PURE__*/function (_React$Component) {
    (0, _inheritsLoose2["default"])(ErrorBoundary, _React$Component);

    function ErrorBoundary() {
      var _this;

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _React$Component.call.apply(_React$Component, [this].concat(args)) || this;
      _this.state = {
        errorStack: null
      };
      _this.chart = void 0;
      _this.chartDom = void 0;
      _this.chartId = void 0;
      _this.size = void 0;

      _this.oldReactRef = function (chartInstance) {
        if (chartInstance) {
          // 复制旧版本可能用到的属性
          _this.chart = chartInstance.chart;
          _this.chartId = chartInstance.chartId;
          _this.chartDom = chartInstance.chartDom;
          _this.size = chartInstance.size;
        }
      };

      return _this;
    }

    var _proto = ErrorBoundary.prototype;

    _proto.shouldComponentUpdate = function shouldComponentUpdate() {
      if (this.state.errorStack) {
        // 在update前重置error标记
        // 为顾及React16.3之前的用户，因此没有将该逻辑放在getDerivedStateFromProps里
        this.setState({
          errorStack: null
        });
      }

      return true;
    };

    _proto.componentDidCatch = function componentDidCatch(error)
    /*, info*/
    {
      // Display fallback UI
      this.setState({
        errorStack: error.stack
      });
    } // 低版本React中，复制可能用到的属性。
    ;

    _proto.render = function render() {
      if (this.state.errorStack) {
        var _this$props = this.props,
            _this$props$className = _this$props.className,
            className = _this$props$className === void 0 ? '' : _this$props$className,
            style = _this$props.style; // You can render any custom fallback UI

        return /*#__PURE__*/React.createElement("pre", {
          className: "widgets-error-info " + className,
          style: style
        }, this.state.errorStack);
      }

      var _this$props2 = this.props,
          _this$props2$forwarde = _this$props2.forwardedRef,
          forwardedRef = _this$props2$forwarde === void 0 ? this.oldReactRef : _this$props2$forwarde,
          rest = (0, _objectWithoutPropertiesLoose2["default"])(_this$props2, ["forwardedRef"]); // 将自定义的 prop 属性 “forwardedRef” 定义为 ref

      return /*#__PURE__*/React.createElement(Component, (0, _extends2["default"])({
        ref: forwardedRef
      }, rest));
    };

    return ErrorBoundary;
  }(React.Component);

  ErrorBoundary.isG2Chart = true;
  ErrorBoundary.displayName = Component.displayName;
  ErrorBoundary.propTypes = Component.propTypes;
  ErrorBoundary.defaultProps = Component.defaultProps;

  if (React.forwardRef) {
    var forwardRefFunc = function forwardRefFunc(props, ref) {
      return /*#__PURE__*/React.createElement(ErrorBoundary, (0, _extends2["default"])({}, props, {
        forwardedRef: ref
      }));
    };

    var result = /*#__PURE__*/React.forwardRef(forwardRefFunc); // @ts-ignore

    result.isG2Chart = true;
    result.displayName = Component.displayName;
    result.propTypes = Component.propTypes;
    result.defaultProps = Component.defaultProps;
    return result;
  }

  return ErrorBoundary;
}