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

var Panel = function (_React$Component) {
  _inherits(Panel, _React$Component);

  function Panel() {
    var _temp, _this, _ret;

    _classCallCheck(this, Panel);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, _React$Component.call.apply(_React$Component, [this].concat(args))), _this), _this.state = {
      activeKey: _this.props.activeKey || ''
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  //点击顶部tab
  Panel.prototype.handleTabClick = function handleTabClick(key, isActive, e) {
    if (isActive) {
      return;
    }

    this.setState({
      activeKey: key
    });
  };

  Panel.prototype.renderTab = function renderTab(tabMode, children) {
    var _this2 = this;

    if (tabMode) {
      return _react2['default'].createElement(
        'div',
        { className: 'p2-panel-tab' },
        children.map(function (child, i) {
          if (!child) {
            return child;
          }
          var _child$props = child.props,
              title = _child$props.title,
              tabKey = _child$props.tabKey;

          var key = tabKey || title || i;
          var isActive = key === _this2.state.activeKey || !_this2.state.activeKey && i === 0;

          var tabCls = (0, _classnames2['default'])('p2-panel-tab-key', {
            'active': isActive
          });

          return _react2['default'].createElement(
            'div',
            { className: tabCls, key: key, onClick: _this2.handleTabClick.bind(_this2, key, isActive) },
            title
          );
        })
      );
    } else {
      return null;
    }
  };

  Panel.prototype.render = function render() {
    var _this3 = this;

    var _props = this.props,
        children = _props.children,
        title = _props.title,
        className = _props.className,
        tabMode = _props.tabMode,
        others = _objectWithoutProperties(_props, ['children', 'title', 'className', 'tabMode']);

    var classes = (0, _classnames2['default'])(_defineProperty({
      'p2-panel': true
    }, className, !!className));

    var nodeTitleSub = null;
    var realChildren = [];
    var childrens = Array.isArray(children) ? children : [children];

    childrens.forEach(function (child) {
      if (child.type === PanelTitleSub) {
        nodeTitleSub = child;
      } else {
        realChildren.push(child);
      }
    });

    var nodeTitle = null;
    if (title) {
      nodeTitle = _react2['default'].createElement(
        'h4',
        null,
        _react2['default'].createElement(
          'span',
          { className: 'p2-panel-title' },
          title
        ),
        this.renderTab(tabMode, realChildren),
        nodeTitleSub
      );

      if (tabMode) {
        realChildren = realChildren.filter(function (child, i) {
          if (!child) {
            return child;
          }
          var _child$props2 = child.props,
              title = _child$props2.title,
              tabKey = _child$props2.tabKey;

          var key = tabKey || title || i;

          return key === _this3.state.activeKey || !_this3.state.activeKey && i === 0;
        });
      }
    }

    var containerCls = 'p2-panel-container';
    if (realChildren.length) containerCls += ' p2-panel-share-' + realChildren.length;

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

  return Panel;
}(_react2['default'].Component);

var PanelItem = function (_React$Component2) {
  _inherits(PanelItem, _React$Component2);

  function PanelItem() {
    _classCallCheck(this, PanelItem);

    return _possibleConstructorReturn(this, _React$Component2.apply(this, arguments));
  }

  PanelItem.prototype.render = function render() {
    var _props2 = this.props,
        children = _props2.children,
        className = _props2.className,
        others = _objectWithoutProperties(_props2, ['children', 'className']);

    var classes = (0, _classnames2['default'])(_defineProperty({
      'p2-panel-item': true
    }, className, !!className));
    return _react2['default'].createElement(
      'div',
      _extends({ className: classes }, others),
      children
    );
  };

  return PanelItem;
}(_react2['default'].Component);

PanelItem.displayName = 'PanelItem';

var PanelTitleSub = function (_React$Component3) {
  _inherits(PanelTitleSub, _React$Component3);

  function PanelTitleSub() {
    _classCallCheck(this, PanelTitleSub);

    return _possibleConstructorReturn(this, _React$Component3.apply(this, arguments));
  }

  PanelTitleSub.prototype.render = function render() {
    var _props3 = this.props,
        children = _props3.children,
        className = _props3.className,
        others = _objectWithoutProperties(_props3, ['children', 'className']);

    var classes = (0, _classnames2['default'])(_defineProperty({
      'p2-panel-titlesub': true
    }, className, !!className));
    return _react2['default'].createElement(
      'div',
      _extends({ className: classes }, others),
      children
    );
  };

  return PanelTitleSub;
}(_react2['default'].Component);

PanelTitleSub.displayName = 'PanelTitleSub';


Panel.Item = PanelItem;
Panel.TitleSub = PanelTitleSub;

exports['default'] = Panel;
module.exports = exports['default'];