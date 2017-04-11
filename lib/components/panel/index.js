'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

require('./index.scss');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults(subClass, superClass); }

var Pannel = function (_React$Component) {
  _inherits(Pannel, _React$Component);

  function Pannel() {
    _classCallCheck(this, Pannel);

    return _possibleConstructorReturn(this, _React$Component.apply(this, arguments));
  }

  Pannel.prototype.render = function render() {
    var _props = this.props,
        children = _props.children,
        title = _props.title,
        className = _props.className,
        others = _objectWithoutProperties(_props, ['children', 'title', 'className']);

    var classes = (0, _classnames2['default'])(_defineProperty({
      'p2-pannel': true
    }, className, !!className));

    var nodeTitleSub = null;
    var realChildren = [];
    var childrens = Array.isArray(children) ? children : [children];

    childrens.forEach(function (child) {
      if (child.type === PannelTitleSub) {
        nodeTitleSub = child;
      } else {
        realChildren.push(child);
      }
    });

    var nodeTitle = null;
    if (title) nodeTitle = _react2['default'].createElement(
      'h4',
      null,
      title,
      nodeTitleSub
    );

    var containerCls = 'p2-pannel-container';
    if (realChildren.length) containerCls += ' p2-pannel-share-' + realChildren.length;

    return _react2['default'].createElement(
      'div',
      { className: classes },
      nodeTitle,
      _react2['default'].createElement(
        'div',
        { className: containerCls },
        realChildren
      )
    );
  };

  return Pannel;
}(_react2['default'].Component);

var PannelItem = function (_React$Component2) {
  _inherits(PannelItem, _React$Component2);

  function PannelItem() {
    _classCallCheck(this, PannelItem);

    return _possibleConstructorReturn(this, _React$Component2.apply(this, arguments));
  }

  PannelItem.prototype.render = function render() {
    var _props2 = this.props,
        children = _props2.children,
        className = _props2.className,
        others = _objectWithoutProperties(_props2, ['children', 'className']);

    var classes = (0, _classnames2['default'])(_defineProperty({
      'p2-pannel-item': true
    }, className, !!className));
    return _react2['default'].createElement(
      'div',
      _extends({ className: classes }, others),
      children
    );
  };

  return PannelItem;
}(_react2['default'].Component);

var PannelTitleSub = function (_React$Component3) {
  _inherits(PannelTitleSub, _React$Component3);

  function PannelTitleSub() {
    _classCallCheck(this, PannelTitleSub);

    return _possibleConstructorReturn(this, _React$Component3.apply(this, arguments));
  }

  PannelTitleSub.prototype.render = function render() {
    var _props3 = this.props,
        children = _props3.children,
        className = _props3.className,
        others = _objectWithoutProperties(_props3, ['children', 'className']);

    var classes = (0, _classnames2['default'])(_defineProperty({
      'p2-pannel-titlesub': true
    }, className, !!className));
    return _react2['default'].createElement(
      'div',
      _extends({ className: classes }, others),
      children
    );
  };

  return PannelTitleSub;
}(_react2['default'].Component);

Pannel.Item = PannelItem;
Pannel.TitleSub = PannelTitleSub;

exports['default'] = Pannel;
module.exports = exports['default'];