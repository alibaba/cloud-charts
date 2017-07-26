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

var prefix = 'aisc-wnumber';

var Wnumber = (_temp = _class = function (_React$Component) {
  _inherits(Wnumber, _React$Component);

  function Wnumber(props) {
    _classCallCheck(this, Wnumber);

    return _possibleConstructorReturn(this, (Wnumber.__proto__ || Object.getPrototypeOf(Wnumber)).call(this, props));
  }

  _createClass(Wnumber, [{
    key: 'renderBottomTitle',
    value: function renderBottomTitle() {
      var bottomTitle = this.props.bottomTitle;
      var bottomTitleClasses = (0, _classnames2.default)(_defineProperty({}, prefix + '-bottomTitle', true));
      if (!!bottomTitle) {
        return _react2.default.createElement(
          'div',
          { className: bottomTitleClasses },
          bottomTitle
        );
      }
    }
  }, {
    key: 'renderMain',
    value: function renderMain() {
      var numberTrendIcon = void 0;
      var numberClasses = prefix + '-number';
      if (this.props.numberTrend === 'raise') {
        numberClasses += ' raise';
        numberTrendIcon = _react2.default.createElement(_wicon2.default, { type: 'arrow-up-filling', size: 'small', classname: 'raise' });
      } else if (this.props.numberTrend === 'drop') {
        numberClasses += ' drop';
        numberTrendIcon = _react2.default.createElement(_wicon2.default, { type: 'arrow-down-filling', size: 'small', classname: 'drop' });
      }

      return _react2.default.createElement(
        'div',
        { className: prefix + '-main' },
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
      var _classNames2;

      var _props = this.props,
          className = _props.className,
          bottomTitle = _props.bottomTitle;


      var mainClasses = (0, _classnames2.default)((_classNames2 = {}, _defineProperty(_classNames2, '' + prefix, true), _defineProperty(_classNames2, className, !!className), _classNames2));

      return _react2.default.createElement(
        'div',
        { className: mainClasses },
        this.renderMain(),
        bottomTitle && this.renderBottomTitle()
      );
    }
  }]);

  return Wnumber;
}(_react2.default.Component), _class.defaultProps = {
  numberTrend: ''
}, _temp);
Wnumber.displayName = 'Wnumber';
exports.default = Wnumber;


Wnumber.propTypes = {
  bottomTitle: _propTypes2.default.string,
  unit: _propTypes2.default.string,
  trend: _propTypes2.default.func
};
module.exports = exports['default'];