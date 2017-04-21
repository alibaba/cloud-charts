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

var _common = require('../utils/common');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults(subClass, superClass); }

var IconTitleMini = function (_React$Component) {
  _inherits(IconTitleMini, _React$Component);

  function IconTitleMini() {
    _classCallCheck(this, IconTitleMini);

    return _possibleConstructorReturn(this, _React$Component.apply(this, arguments));
  }

  IconTitleMini.prototype.render = function render() {
    var title = this.props.title || '';
    var iconType = this.props.iconType;
    var iconUrl = this.props.iconUrl;
    var dataSource = this.props.dataSource;
    var icon = void 0;
    if (iconType !== undefined) {
      icon = _react2['default'].createElement(_aisc.Icon, { type: iconType, size: 'large' });
    } else if (iconUrl !== undefined) {
      icon = _react2['default'].createElement('img', { src: iconUrl, width: '22', height: '22', className: 'vam' });
    } else {
      icon = this.props.iconHtml;
    }

    var titleStatus = '';
    if (title.compare !== undefined && title.key !== undefined && dataSource[title.key] !== undefined) {
      titleStatus = (0, _classnames2['default'])({
        "orange-threshold": title.orangeThreshold !== undefined && (0, _common.compareComputed)(title.compare, dataSource[title.key], title.orangeThreshold) ? true : false,
        "red-threshold": title.redThreshold !== undefined && (0, _common.compareComputed)(title.compare, dataSource[title.key], title.redThreshold) ? true : false
      });
    }

    var titleData = dataSource[title.key] === undefined ? '-' : dataSource[title.key];

    return _react2['default'].createElement(
      'div',
      { className: 'icon-title-mini' },
      _react2['default'].createElement(
        'div',
        { className: 'icon-title-mini-icon-bg' },
        _react2['default'].createElement(
          'div',
          { className: 'icon-title-mini-icon' },
          icon
        )
      ),
      _react2['default'].createElement(
        'div',
        { className: 'icon-title-mini-title' },
        _react2['default'].createElement(
          'div',
          { className: 'icon-title-mini-title-data healthy ' + titleStatus },
          titleData
        ),
        _react2['default'].createElement(
          'div',
          { className: 'icon-title-mini-title-text' },
          title.label
        )
      )
    );
  };

  return IconTitleMini;
}(_react2['default'].Component);

IconTitleMini.propTypes = {
  iconType: _react2['default'].PropTypes.string,
  iconUrl: _react2['default'].PropTypes.string,
  iconHtml: _react2['default'].PropTypes.element,
  title: _react2['default'].PropTypes.shape({
    label: _react2['default'].PropTypes.string,
    orangeThreshold: _react2['default'].PropTypes.oneOfType([_react2['default'].PropTypes.string, _react2['default'].PropTypes.number]),
    redThreshold: _react2['default'].PropTypes.oneOfType([_react2['default'].PropTypes.string, _react2['default'].PropTypes.number]),
    compare: _react2['default'].PropTypes.oneOf(['<', '<=', '>', '>=', '==', '===', '!=', '!==']),
    key: _react2['default'].PropTypes.string.isRequired
  }),
  dataSource: _react2['default'].PropTypes.object
};
IconTitleMini.defaultProps = {

  dataSource: {},
  title: {
    "label": "Title",
    "key": "title"
  },
  iconHtml: _react2['default'].createElement(_aisc.Icon, { type: 'ais', size: 'large' })
};
exports['default'] = IconTitleMini;
module.exports = exports['default'];