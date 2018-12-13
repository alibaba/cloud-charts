'use strict';

exports.__esModule = true;
exports.default = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _class, _temp;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _log = require('../common/log');

var _log2 = _interopRequireDefault(_log);

var _locale = require('./locale');

var _locale2 = _interopRequireDefault(_locale);

require('./index.scss');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults(subClass, superClass); }

var prefix = 'aisc-wplaceholder';

// 默认显示的图标
var svgWidth = 36,
    svgHeight = 32,
    itemHeight1 = 20,
    itemHeight2 = 26,
    itemHeight3 = 32;
var svg = _react2.default.createElement(
  'svg',
  { width: svgWidth, height: svgHeight, className: 'placeholder-box' },
  _react2.default.createElement('rect', { className: 'placeholder-item item-1', width: '8', height: itemHeight1, x: '0', y: svgHeight - itemHeight1 }),
  _react2.default.createElement('rect', { className: 'placeholder-item item-2', width: '8', height: itemHeight3, x: '14', y: svgHeight - itemHeight3 }),
  _react2.default.createElement('rect', { className: 'placeholder-item item-3', width: '8', height: itemHeight2, x: '28', y: svgHeight - itemHeight2 })
);

// 异常状态显示的图标
var errorSvg = _react2.default.createElement(
  'svg',
  { width: '43px', height: '36px', viewBox: '0 0 43 36' },
  _react2.default.createElement('rect', { className: 'placeholder-item', x: '0', y: '12', width: '8', height: '20' }),
  _react2.default.createElement('path', { className: 'placeholder-item', d: 'M21,16.0139985 C19.1238002,18.3325877 18,21.285055 18,24.5 C18,27.27522 18.8374075,29.8548529 20.2733236,32 L13,32 L13,0 L21,0 L21,16.0139985 Z' }),
  _react2.default.createElement('path', { className: 'placeholder-item', d: 'M34,11.2310283 C33.1898394,11.0793314 32.3541841,11 31.5,11 C29.5412332,11 27.6799005,11.4171646 26,12.1674956 L26,5 L34,5 L34,11.2310283 Z' }),
  _react2.default.createElement('path', { className: 'placeholder-item', d: 'M31.5,36 C25.1487254,36 20,30.8512746 20,24.5 C20,18.1487254 25.1487254,13 31.5,13 C37.8512746,13 43,18.1487254 43,24.5 C43,30.8512746 37.8512746,36 31.5,36 Z M31.5,34 C36.7467051,34 41,29.7467051 41,24.5 C41,19.2532949 36.7467051,15 31.5,15 C26.2532949,15 22,19.2532949 22,24.5 C22,29.7467051 26.2532949,34 31.5,34 Z', 'fill-rule': 'nonzero' }),
  _react2.default.createElement('rect', { className: 'placeholder-item', x: '30', y: '17', width: '3', height: '9' }),
  _react2.default.createElement('rect', { className: 'placeholder-item', x: '30', y: '28', width: '3', height: '3' })
);

// 无数据状态显示的图标
var noDataSvg = _react2.default.createElement(
  'svg',
  { width: '43px', height: '36px', viewBox: '0 0 43 36' },
  _react2.default.createElement('polygon', { className: 'placeholder-item', points: '0 12 8 12 8 32 0 32' }),
  _react2.default.createElement('path', { className: 'placeholder-item', d: 'M21,16.0139985 C19.1238002,18.3325877 18,21.285055 18,24.5 C18,27.27522 18.8374075,29.8548529 20.2733236,32 L13,32 L13,0 L21,0 L21,16.0139985 Z' }),
  _react2.default.createElement('path', { className: 'placeholder-item', d: 'M34,11.2310283 C33.1898394,11.0793314 32.3541841,11 31.5,11 C29.5412332,11 27.6799005,11.4171646 26,12.1674956 L26,5 L34,5 L34,11.2310283 Z' }),
  _react2.default.createElement('path', { className: 'placeholder-item', d: 'M23.8056018,18.9269221 C22.6697689,20.4923786 22,22.4179728 22,24.5 C22,29.7467051 26.2532949,34 31.5,34 C33.5820272,34 35.5076214,33.3302311 37.0730779,32.1943982 L23.8056018,18.9269221 Z M25.9269221,16.8056018 L39.1943982,30.0730779 C40.3302311,28.5076214 41,26.5820272 41,24.5 C41,19.2532949 36.7467051,15 31.5,15 C29.4179728,15 27.4923786,15.6697689 25.9269221,16.8056018 Z M31.5,36 C25.1487254,36 20,30.8512746 20,24.5 C20,18.1487254 25.1487254,13 31.5,13 C37.8512746,13 43,18.1487254 43,24.5 C43,30.8512746 37.8512746,36 31.5,36 Z', 'fill-rule': 'nonzero' })
);

// 获取显示文案
function getLocaleText() {
  var locale = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var loading = arguments[1];
  var error = arguments[2];
  var noData = arguments[3];

  // 优先取error状态
  if (error) {
    return locale.error;
  }
  // 其次取loading状态
  if (loading) {
    return locale.loading;
  }
  // 其次取loading状态
  if (noData) {
    return locale.noData;
  }
}

var Wplaceholder = (_temp = _class = function (_React$Component) {
  _inherits(Wplaceholder, _React$Component);

  function Wplaceholder(props) {
    _classCallCheck(this, Wplaceholder);

    // 图表初始化时记录日志
    var _this = _possibleConstructorReturn(this, _React$Component.call(this, props));

    (0, _log2.default)('Wplaceholder', 'init');
    return _this;
  }

  Wplaceholder.prototype.renderText = function renderText(loading, error, noData) {
    var _props = this.props,
        locale = _props.locale,
        language = _props.language,
        children = _props.children;
    // text 优先判断传入的locale，其次判断传入的language，最后取中文locale

    var text = getLocaleText(locale || _locale2.default[language] || _locale2.default['zh-cn'], loading, error, noData) || '';
    if (children) {
      // 优先渲染children
      return _react2.default.createElement(
        'div',
        { className: prefix + '-children-text' },
        children
      );
    } else if (text) {
      return _react2.default.createElement(
        'div',
        { className: prefix + '-children-text' },
        text
      );
    } else {
      return null;
    }
  };

  Wplaceholder.prototype.render = function render() {
    var _classNames;

    var _props2 = this.props,
        className = _props2.className,
        _props2$height = _props2.height,
        height = _props2$height === undefined ? '100%' : _props2$height,
        style = _props2.style,
        loading = _props2.loading,
        error = _props2.error,
        noData = _props2.noData,
        otherProps = _objectWithoutProperties(_props2, ['className', 'height', 'style', 'loading', 'error', 'noData']);

    var mainClasses = (0, _classnames2.default)(prefix, (_classNames = {}, _classNames[prefix + '-loading'] = !error && loading, _classNames[prefix + '-no-data'] = !error && !loading && noData, _classNames[prefix + '-error'] = !!error, _classNames[className] = !!className, _classNames));

    var renderSvg = svg;
    if (error) {
      renderSvg = errorSvg;
    } else if (!loading && noData) {
      renderSvg = noDataSvg;
    }

    return _react2.default.createElement(
      'div',
      _extends({ className: mainClasses,
        style: _extends({
          height: height
        }, style)
      }, otherProps),
      _react2.default.createElement(
        'div',
        { className: prefix + '-children' },
        renderSvg,
        this.renderText(loading, error, noData)
      )
    );
  };

  return Wplaceholder;
}(_react2.default.Component), _class.displayName = 'Wplaceholder', _temp);
Wplaceholder.displayName = 'Wplaceholder';
exports.default = Wplaceholder;
module.exports = exports['default'];