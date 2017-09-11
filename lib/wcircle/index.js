'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _class, _temp;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _wicon = require('../wicon');

var _wicon2 = _interopRequireDefault(_wicon);

require('./index.scss');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var prefix = 'aisc-wcircle';
var strokeWidth = 6;
var radius = 60;

var Wcircle = (_temp = _class = function (_React$Component) {
  _inherits(Wcircle, _React$Component);

  function Wcircle(props) {
    _classCallCheck(this, Wcircle);

    return _possibleConstructorReturn(this, (Wcircle.__proto__ || Object.getPrototypeOf(Wcircle)).call(this, props));
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
        numberTrendIcon = _react2.default.createElement(_wicon2.default, { type: 'arrow-up-filling', size: 'small', classname: 'raise' });
      } else if (bottomTrend === 'drop') {
        numberClasses += ' drop';
        numberTrendIcon = _react2.default.createElement(_wicon2.default, { type: 'arrow-down-filling', size: 'small', classname: 'drop' });
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
      if (this.props.trend === 'raise') {
        numberClasses += ' raise';
        numberTrendIcon = _react2.default.createElement(_wicon2.default, { type: 'arrow-up-filling', size: 'small', classname: 'raise' });
      } else if (this.props.trend === 'drop') {
        numberClasses += ' drop';
        numberTrendIcon = _react2.default.createElement(_wicon2.default, { type: 'arrow-down-filling', size: 'small', classname: 'drop' });
      }

      var radiusInner = radius - strokeWidth / 2;
      var pathString = 'M ' + radius + ',' + radius + ' m 0,' + radiusInner + '\n     a ' + radiusInner + ',' + radiusInner + ' 0 1 1 0,-' + 2 * radiusInner + '\n     a ' + radiusInner + ',' + radiusInner + ' 0 1 1 0,' + 2 * radiusInner;
      var circleLengh = Math.PI * 2 * radiusInner;

      var openWidth = void 0,
          pathDashoffset = void 0,
          strokeDashoffset = void 0;
      if (this.props.type === 'circle') {
        openWidth = 0;
        pathDashoffset = '0px';
        strokeDashoffset = '-' + circleLengh / 2 + 'px';
      } else if (this.props.type === 'gauge') {
        openWidth = Math.PI * 0.4 * radiusInner;
        pathDashoffset = '-' + openWidth / 2 + 'px';
        strokeDashoffset = '-' + openWidth / 2 + 'px';
      }

      var pathStyle = {
        strokeDasharray: circleLengh - openWidth + 'px ' + circleLengh + 'px',
        strokeDashoffset: pathDashoffset
      };
      var strokePathStyle = {
        strokeDasharray: this.props.percent * (circleLengh - openWidth) + 'px ' + circleLengh + 'px',
        strokeDashoffset: strokeDashoffset
      };

      var svgStyle = {
        height: (radius + strokeWidth / 2) * 2,
        width: (radius + strokeWidth / 2) * 2
      };

      return _react2.default.createElement(
        'div',
        { className: prefix + '-main ' + this.props.status },
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
          ),
          this.props.type === 'gauge' && this.renderBottom()
        )
      );
    }
  }, {
    key: 'render',
    value: function render() {
      var _classNames2;

      var className = this.props.className;


      var mainClasses = (0, _classnames2.default)((_classNames2 = {}, _defineProperty(_classNames2, '' + prefix, true), _defineProperty(_classNames2, className, !!className), _classNames2));

      return _react2.default.createElement(
        'div',
        { className: mainClasses },
        this.renderMain()
      );
    }
  }]);

  return Wcircle;
}(_react2.default.Component), _class.defaultProps = {
  type: 'circle',
  title: '',
  percent: 0,
  unit: '',
  status: 'blue',
  height: radius * 2
}, _temp);
Wcircle.displayName = 'Wcircle';
exports.default = Wcircle;


Wcircle.propTypes = {
  type: _react2.default.PropTypes.oneOf(['gauge', 'circle']),
  title: _propTypes2.default.string,
  percent: function percent(props, propName, componentName) {
    if (!(props[propName] >= 0 && props[propName] <= 1)) {
      return new Error('Validation failed!');
    }
  },
  unit: _propTypes2.default.string,
  status: _react2.default.PropTypes.oneOf(['blue', 'orange', 'red']),
  trend: _react2.default.PropTypes.oneOf(['raise', 'drop']),
  bottomTitle: _propTypes2.default.string,
  bottomUnit: _propTypes2.default.string,
  bottomNumber: _propTypes2.default.number,
  bottomTrend: _react2.default.PropTypes.oneOf(['raise', 'drop'])
};
module.exports = exports['default'];