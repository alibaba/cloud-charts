'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _class, _temp;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

require('./index.scss');

var _aisc = require('@alife/aisc');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var IconLinkButtonMini = (_temp = _class = function (_React$Component) {
  _inherits(IconLinkButtonMini, _React$Component);

  function IconLinkButtonMini(props) {
    _classCallCheck(this, IconLinkButtonMini);

    var _this = _possibleConstructorReturn(this, (IconLinkButtonMini.__proto__ || Object.getPrototypeOf(IconLinkButtonMini)).call(this, props));

    _this.onClick = _this.onClick.bind(_this);
    return _this;
  }

  _createClass(IconLinkButtonMini, [{
    key: 'onClick',
    value: function onClick() {
      var view = this.props.isBlank ? '_blank' : '_self';
      if (this.props.url) {
        var win = window.open(this.props.url, view);
        win.focus();
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var title = this.props.title || '';
      var subTitle = this.props.subTitle || '';
      var iconType = this.props.iconType;
      var iconUrl = this.props.iconUrl;
      var icon = void 0;
      if (iconType !== undefined) {
        icon = _react2.default.createElement(_aisc.Icon, { type: iconType, size: 'large' });
      } else if (iconUrl !== undefined) {
        icon = _react2.default.createElement('img', { src: iconUrl, width: '22', height: '22', className: 'vam' });
      } else {
        icon = this.props.iconHtml;
      }
      var urlClass = (0, _classnames2.default)({
        "cursor-p": this.props.url !== undefined
      });
      return _react2.default.createElement(
        'div',
        { className: 'rect-link ' + urlClass, onClick: this.onClick },
        _react2.default.createElement(
          'div',
          { className: 'rect-link-left' },
          _react2.default.createElement(
            'div',
            { className: 'rect-link-icon' },
            icon
          )
        ),
        _react2.default.createElement(
          'div',
          { className: 'rect-link-right' },
          _react2.default.createElement(
            'div',
            { className: 'rect-link-title overflow-ellipsis' },
            title
          ),
          _react2.default.createElement(
            'div',
            { className: 'rect-link-sub-title overflow-ellipsis' },
            subTitle
          )
        )
      );
    }
  }]);

  return IconLinkButtonMini;
}(_react2.default.Component), _class.propTypes = {
  url: _react2.default.PropTypes.string,
  iconType: _react2.default.PropTypes.string,
  iconUrl: _react2.default.PropTypes.string,
  iconHtml: _react2.default.PropTypes.element,
  title: _react2.default.PropTypes.string,
  subTitle: _react2.default.PropTypes.string
}, _class.defaultProps = {
  iconHtml: _react2.default.createElement(_aisc.Icon, { type: 'ais', size: 'large' }),
  isBlank: true
}, _temp);
IconLinkButtonMini.displayName = 'IconLinkButtonMini';
exports.default = IconLinkButtonMini;
module.exports = exports['default'];