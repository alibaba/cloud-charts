'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _aisc = require('@alife/aisc');

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

require('./index.scss');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults(subClass, superClass); }

var NextRow = _aisc.Grid.Row,
    NextCol = _aisc.Grid.Col;

var Row = function (_React$Component) {
  _inherits(Row, _React$Component);

  function Row() {
    _classCallCheck(this, Row);

    return _possibleConstructorReturn(this, _React$Component.apply(this, arguments));
  }

  Row.prototype.render = function render() {
    var _classNames;

    var _props = this.props,
        children = _props.children,
        className = _props.className,
        others = _objectWithoutProperties(_props, ['children', 'className']);

    var classes = (0, _classnames2['default'])((_classNames = {}, _defineProperty(_classNames, className, !!className), _defineProperty(_classNames, 'p2-row', true), _classNames));
    return _react2['default'].createElement(
      NextRow,
      _extends({ className: classes }, others),
      children
    );
  };

  return Row;
}(_react2['default'].Component);

var Col = function (_React$Component2) {
  _inherits(Col, _React$Component2);

  function Col() {
    _classCallCheck(this, Col);

    return _possibleConstructorReturn(this, _React$Component2.apply(this, arguments));
  }

  Col.prototype.render = function render() {
    var _classNames2;

    var _props2 = this.props,
        children = _props2.children,
        className = _props2.className,
        others = _objectWithoutProperties(_props2, ['children', 'className']);

    var classes = (0, _classnames2['default'])((_classNames2 = {}, _defineProperty(_classNames2, className, !!className), _defineProperty(_classNames2, 'p2-col', true), _classNames2));
    return _react2['default'].createElement(
      NextCol,
      _extends({ className: classes }, others),
      children
    );
  };

  return Col;
}(_react2['default'].Component);

exports['default'] = {
  Row: Row,
  Col: Col
};
module.exports = exports['default'];