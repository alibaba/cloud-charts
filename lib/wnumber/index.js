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

var _arrow = require('../chartCommon/arrow');

var _arrow2 = _interopRequireDefault(_arrow);

require('./index.scss');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var prefix = 'aisc-wnumber';

var Wnumber = (_temp = _class = function (_React$Component) {
  _inherits(Wnumber, _React$Component);

  function Wnumber(props) {
    _classCallCheck(this, Wnumber);

    return _possibleConstructorReturn(this, (Wnumber.__proto__ || Object.getPrototypeOf(Wnumber)).call(this, props));
  }

  _createClass(Wnumber, [{
    key: 'renderBottom',
    value: function renderBottom() {
      var bottomTitle = this.props.bottomTitle;
      if (!!bottomTitle) {
        return _react2.default.createElement(
          'div',
          { className: prefix + '-bottomTitle' },
          bottomTitle
        );
      }
    }
  }, {
    key: 'trendIconFunc',
    value: function trendIconFunc(trend) {
      if (trend === 'raise') {
        return _react2.default.createElement(_arrow2.default, { type: 'up' });
      } else if (trend === 'drop') {
        return _react2.default.createElement(_arrow2.default, { type: 'down' });
      }
    }
  }, {
    key: 'renderMain',
    value: function renderMain() {

      var numberTrendIcon = this.trendIconFunc(this.props.numberTrend);
      var numberClasses = prefix + '-number';

      var rightRatioTrendIcon = this.trendIconFunc(this.props.rightRatioTrend);
      var rightRatioTrendClasses = prefix + '-ratio ' + this.props.rightRatioTrend;

      // rightRatioTrend
      return _react2.default.createElement(
        'div',
        { className: prefix + '-main ' + this.props.numberTrend + ' ' + this.props.status },
        this.props.numberTrend && _react2.default.createElement(
          'span',
          { className: prefix + '-leftIcon' },
          numberTrendIcon
        ),
        _react2.default.createElement(
          'span',
          { className: numberClasses },
          this.props.children
        ),
        this.props.unit && _react2.default.createElement(
          'span',
          { className: prefix + '-unit' },
          this.props.unit
        ),
        this.props.rightTitle && _react2.default.createElement(
          'span',
          { className: prefix + '-rightTitle' },
          this.props.rightTitle
        ),
        this.props.rightRatio && _react2.default.createElement(
          'span',
          { className: prefix + '-rightRatio ' + this.props.rightRatioTrend },
          this.props.rightRatioTrend && _react2.default.createElement(
            'span',
            { className: prefix + '-rightRatioIcon' },
            rightRatioTrendIcon
          ),
          this.props.rightRatio
        ),
        this.props.trend && _react2.default.createElement(
          'span',
          { className: prefix + '-trend' },
          this.props.trend()
        )
      );
    }
  }, {
    key: 'render',
    value: function render() {
      var _classNames;

      var className = this.props.className;


      var mainClasses = (0, _classnames2.default)((_classNames = {}, _defineProperty(_classNames, '' + prefix, true), _defineProperty(_classNames, className, !!className), _classNames));

      return _react2.default.createElement(
        'div',
        { className: mainClasses },
        this.renderMain(),
        this.renderBottom()
      );
    }
  }]);

  return Wnumber;
}(_react2.default.Component), _class.defaultProps = {
  numberTrend: '',
  rightRatioTrend: '',
  status: ''
}, _temp);
Wnumber.displayName = 'Wnumber';
exports.default = Wnumber;


Wnumber.propTypes = {
  bottomTitle: _propTypes2.default.node,
  unit: _propTypes2.default.node,
  trend: _propTypes2.default.func
};
module.exports = exports['default'];