'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = errorWrap;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults(subClass, superClass); }

/*#__PURE__*/

/**
 * errorWrap 错误捕获HOC
 *
 * @param {React.Component} Component 组件
 *
 * @return {React.Component}
 * */
function errorWrap(Component) {
  var ErrorBoundary = function (_React$Component) {
    _inherits(ErrorBoundary, _React$Component);

    function ErrorBoundary(props) {
      _classCallCheck(this, ErrorBoundary);

      var _this = _possibleConstructorReturn(this, _React$Component.call(this, props));

      _this.oldReactRef = function (chartInstance) {
        if (chartInstance) {
          // 复制旧版本可能用到的属性
          _this.chart = chartInstance.chart;
          _this.chartId = chartInstance.chartId;
          _this.chartDom = chartInstance.chartDom;
          _this._size = chartInstance._size;
        }
      };

      _this.state = { error: null };
      return _this;
    }

    ErrorBoundary.prototype.shouldComponentUpdate = function shouldComponentUpdate() {
      if (this.state.error) {
        // 在update前重置error标记
        // 为顾及React16.3之前的用户，因此没有将该逻辑放在getDerivedStateFromProps里
        this.setState({ error: null });
      }
      return true;
    };

    ErrorBoundary.prototype.componentDidCatch = function componentDidCatch(error, info) {
      // Display fallback UI
      this.setState({ error: error.stack });
    };

    // 低版本React中，复制可能用到的属性。


    ErrorBoundary.prototype.render = function render() {
      if (this.state.error) {
        var _props = this.props,
            _props$className = _props.className,
            className = _props$className === undefined ? '' : _props$className,
            style = _props.style;
        // You can render any custom fallback UI

        return _react2.default.createElement(
          'pre',
          { className: Component.baseClassName + ' widgets-error-info ' + className, style: style },
          this.state.error
        );
      }

      var _props2 = this.props,
          _props2$forwardedRef = _props2.forwardedRef,
          forwardedRef = _props2$forwardedRef === undefined ? this.oldReactRef : _props2$forwardedRef,
          rest = _objectWithoutProperties(_props2, ['forwardedRef']);

      // 将自定义的 prop 属性 “forwardedRef” 定义为 ref


      return _react2.default.createElement(Component, _extends({ ref: forwardedRef }, rest));
    };

    return ErrorBoundary;
  }(_react2.default.Component);

  ErrorBoundary.displayName = 'ErrorBoundary';


  if (_react2.default.forwardRef) {
    var forwardRefFunc = function forwardRefFunc(props, ref) {
      return _react2.default.createElement(ErrorBoundary, _extends({}, props, { forwardedRef: ref }));
    };
    var result = _react2.default.forwardRef(forwardRefFunc);
    result.isG2Chart = true;
    result.displayName = Component.displayName;
    result.propTypes = Component.propTypes;
    result.defaultProps = Component.defaultProps;

    return result;
  }

  ErrorBoundary.isG2Chart = true;
  ErrorBoundary.displayName = Component.displayName;
  ErrorBoundary.propTypes = Component.propTypes;
  ErrorBoundary.defaultProps = Component.defaultProps;

  return ErrorBoundary;
}