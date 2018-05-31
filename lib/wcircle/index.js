'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _class, _temp;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _arrow = require('../common/arrow');

var _arrow2 = _interopRequireDefault(_arrow);

var _common = require('../common/common');

require('./index.scss');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var prefix = 'aisc-wcircle';

var Wcircle = (_temp = _class = function (_React$Component) {
  _inherits(Wcircle, _React$Component);

  function Wcircle() {
    _classCallCheck(this, Wcircle);

    return _possibleConstructorReturn(this, (Wcircle.__proto__ || Object.getPrototypeOf(Wcircle)).apply(this, arguments));
  }

  _createClass(Wcircle, [{
    key: 'renderBottom',
    value: function renderBottom() {
      var bottomTitle = this.props.bottomTitle;
      var bottomUnit = this.props.bottomUnit;
      var bottomNumber = this.props.bottomNumber;
      var bottomTrend = this.props.bottomTrend;

      var bottomClasses = (0, _classnames2.default)(_defineProperty({}, prefix + '-bottom-block', true));

      var numberTrendIcon = void 0;
      var numberClasses = prefix + '-bottom-number';
      if (bottomTrend === 'raise') {
        numberClasses += ' raise';
        numberTrendIcon = _react2.default.createElement(_arrow2.default, { type: 'up' });
      } else if (bottomTrend === 'drop') {
        numberClasses += ' drop';
        numberTrendIcon = _react2.default.createElement(_arrow2.default, { type: 'down' });
      }

      if (!!bottomTitle || !!bottomUnit || !!bottomNumber || !!bottomTrend) {
        return _react2.default.createElement(
          'div',
          { className: bottomClasses },
          bottomTrend && _react2.default.createElement(
            'span',
            { className: prefix + '-leftIcon' },
            numberTrendIcon
          ),
          _react2.default.createElement(
            'span',
            { className: numberClasses },
            bottomNumber,
            bottomUnit && _react2.default.createElement(
              'span',
              { className: prefix + '-bottom-unit' },
              bottomUnit
            )
          ),
          _react2.default.createElement(
            'p',
            { className: prefix + '-title' },
            bottomTitle
          )
        );
      }
    }
  }, {
    key: 'renderMain',
    value: function renderMain() {
      var _this2 = this;

      var numberTrendIcon = void 0;
      var numberClasses = prefix + '-number';
      var radius = this.props.radius;
      var strokeWidth = this.props.strokeWidth;

      if (this.props.trend === 'raise') {
        numberClasses += ' raise';
        numberTrendIcon = _react2.default.createElement(_arrow2.default, { type: 'up' });
      } else if (this.props.trend === 'drop') {
        numberClasses += ' drop';
        numberTrendIcon = _react2.default.createElement(_arrow2.default, { type: 'down' });
      }

      var radiusInner = radius - strokeWidth / 2;
      var pathString = 'M ' + radius + ',' + radius + ' m 0,' + radiusInner + '\n     a ' + radiusInner + ',' + radiusInner + ' 0 1 1 0,-' + 2 * radiusInner + '\n     a ' + radiusInner + ',' + radiusInner + ' 0 1 1 0,' + 2 * radiusInner;
      var circleLengh = Math.PI * 2 * radiusInner;

      var openWidth = void 0,
          pathDashoffset = void 0,
          strokeDashoffset = void 0,
          strokePathStyle = void 0;
      if (this.props.type === 'circle') {
        openWidth = 0;
        pathDashoffset = '0px';
        strokeDashoffset = '-' + circleLengh / 2 + 'px';
        strokePathStyle = {
          strokeDasharray: this.props.percent * (circleLengh - openWidth) + 'px ' + (1 - this.props.percent) * (circleLengh - openWidth) + 'px',
          strokeDashoffset: strokeDashoffset
        };
      } else if (this.props.type === 'gauge') {
        openWidth = Math.PI * 0.45 * radiusInner;
        pathDashoffset = '-' + openWidth / 2 + 'px';
        strokeDashoffset = '-' + openWidth / 2 + 'px';
        strokePathStyle = {
          strokeDasharray: this.props.percent * (circleLengh - openWidth) + 'px ' + circleLengh + 'px',
          strokeDashoffset: strokeDashoffset
        };
      }

      var pathStyle = {
        strokeDasharray: circleLengh - openWidth + 'px ' + circleLengh + 'px',
        strokeDashoffset: pathDashoffset
      };

      var svgStyle = {
        height: radius * 2,
        width: radius * 2
      };

      return _react2.default.createElement(
        'div',
        { className: prefix + '-main ' + (0, _common.getStatusColorName)(this.props.status) },
        _react2.default.createElement(
          'div',
          { className: prefix + '-ratio' },
          _react2.default.createElement(
            'div',
            { className: prefix + '-ratio-svg', style: svgStyle },
            _react2.default.createElement(
              'svg',
              { width: '100%', height: '100%', xmlns: 'http://www.w3.org/2000/svg', version: '1.1' },
              _react2.default.createElement('path', {
                className: prefix + '-svg-bg',
                d: pathString,
                strokeWidth: strokeWidth,
                style: pathStyle
              }),
              _react2.default.createElement('path', {
                className: prefix + '-svg-ring',
                d: pathString,
                strokeWidth: strokeWidth,
                ref: function ref(path) {
                  _this2.path = path;
                },
                style: strokePathStyle
              })
            )
          ),
          _react2.default.createElement(
            'div',
            { className: prefix + '-number-block' },
            _react2.default.createElement(
              'div',
              { className: prefix + '-number-middle' },
              this.props.trend && _react2.default.createElement(
                'span',
                { className: prefix + '-leftIcon' },
                numberTrendIcon
              ),
              _react2.default.createElement(
                'span',
                { className: numberClasses },
                this.props.children,
                this.props.unit && _react2.default.createElement(
                  'span',
                  { className: prefix + '-unit' },
                  this.props.unit
                )
              ),
              _react2.default.createElement(
                'p',
                { className: prefix + '-title' },
                this.props.title
              )
            )
          ),
          this.props.type === 'gauge' && this.renderBottom()
        )
      );
    }
  }, {
    key: 'render',
    value: function render() {
      var _classNames2;

      var _props = this.props,
          className = _props.className,
          otherProps = _objectWithoutProperties(_props, ['className']);

      var mainClasses = (0, _classnames2.default)((_classNames2 = {}, _defineProperty(_classNames2, prefix, true), _defineProperty(_classNames2, className, !!className), _classNames2));

      return _react2.default.createElement(
        'div',
        _extends({ className: mainClasses }, otherProps),
        this.renderMain()
      );
    }
  }]);

  return Wcircle;
}(_react2.default.Component), _class.displayName = 'Wcircle', _class.defaultProps = {
  type: 'circle',
  title: '',
  percent: 0,
  unit: '',
  status: 'normal',
  radius: 70,
  strokeWidth: 6
}, _temp);
Wcircle.displayName = 'Wcircle';
exports.default = Wcircle;


Wcircle.propTypes = {
  type: _propTypes2.default.oneOf(['gauge', 'circle']),
  title: _propTypes2.default.node,
  percent: function percent(props, propName) {
    if (!(props[propName] >= 0 && props[propName] <= 1)) {
      return new Error('Validation failed!');
    }
  },
  unit: _propTypes2.default.node,
  status: _propTypes2.default.oneOf(['normal', 'warning', 'error', 'blue', 'orange', 'red']),
  // 半径
  radius: function radius(props, propName) {
    if (!(props[propName] >= 10 && props[propName] <= 100)) {
      return new Error('Validation failed!');
    }
  },
  // 粗细
  strokeWidth: function strokeWidth(props, propName) {
    if (!(props[propName] >= 2 && props[propName] <= 10)) {
      return new Error('Validation failed!');
    }
  },
  // 趋势
  trend: _propTypes2.default.oneOf(['raise', 'drop']),
  bottomTitle: _propTypes2.default.node,
  bottomUnit: _propTypes2.default.node,
  bottomNumber: _propTypes2.default.node,
  bottomTrend: _propTypes2.default.oneOf(['raise', 'drop'])
};
module.exports = exports['default'];