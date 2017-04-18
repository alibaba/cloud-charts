'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

require('./index.scss');

var _aisc = require('@alife/aisc');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults(subClass, superClass); }

var IconLinkButtonMini = function (_React$Component) {
  _inherits(IconLinkButtonMini, _React$Component);

  function IconLinkButtonMini(props) {
    _classCallCheck(this, IconLinkButtonMini);

    var _this = _possibleConstructorReturn(this, _React$Component.call(this, props));

    _this.onClick = _this.onClick.bind(_this);
    return _this;
  }

  IconLinkButtonMini.prototype.onClick = function onClick() {
    if (this.props.url) {
      var win = window.open(this.props.url, '_blank');
      win.focus();
    }
  };

  IconLinkButtonMini.prototype.render = function render() {
    var title = this.props.title || '';
    var subTitle = this.props.subTitle || '';
    var icon = this.props.icon || _react2['default'].createElement(_aisc.Icon, { type: 'ais', size: 'large' });
    var urlClass = (0, _classnames2['default'])({
      "cursor-p": this.props.url !== undefined
    });
    return _react2['default'].createElement(
      'div',
      { className: 'rect-link ' + urlClass, onClick: this.onClick },
      _react2['default'].createElement(
        'div',
        { className: 'rect-link-left' },
        _react2['default'].createElement(
          'div',
          { className: 'rect-link-icon' },
          icon
        )
      ),
      _react2['default'].createElement(
        'div',
        { className: 'rect-link-right' },
        _react2['default'].createElement(
          'div',
          { className: 'rect-link-title overflow-ellipsis' },
          title
        ),
        _react2['default'].createElement(
          'div',
          { className: 'rect-link-sub-title overflow-ellipsis' },
          subTitle
        )
      )
    );
  };

  return IconLinkButtonMini;
}(_react2['default'].Component);

IconLinkButtonMini.propTypes = {
  url: _react2['default'].PropTypes.string,
  icon: _react2['default'].PropTypes.string,
  title: _react2['default'].PropTypes.string,
  subTitle: _react2['default'].PropTypes.string
};
exports['default'] = IconLinkButtonMini;
module.exports = exports['default'];