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

var _common = require('../common');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var NumberMiniE = (_temp = _class = function (_React$Component) {
  _inherits(NumberMiniE, _React$Component);

  function NumberMiniE() {
    _classCallCheck(this, NumberMiniE);

    return _possibleConstructorReturn(this, (NumberMiniE.__proto__ || Object.getPrototypeOf(NumberMiniE)).apply(this, arguments));
  }

  _createClass(NumberMiniE, [{
    key: 'render',
    value: function render() {
      var title = this.props.title || '';
      var iconType = this.props.iconType;
      var iconUrl = this.props.iconUrl;
      var dataSource = this.props.dataSource;
      var icon = void 0;
      if (iconType !== undefined) {
        icon = _react2.default.createElement(_aisc.Icon, { type: iconType, size: 'large' });
      } else if (iconUrl !== undefined) {
        icon = _react2.default.createElement('img', { src: iconUrl, width: '22', height: '22', className: 'vam' });
      } else {
        icon = this.props.iconHtml;
      }

      var titleStatus = '';
      if (title.compare !== undefined && title.key !== undefined && dataSource[title.key] !== undefined) {
        titleStatus = (0, _classnames2.default)({
          "orange-threshold": title.orangeThreshold !== undefined && (0, _common.compareComputed)(title.compare, dataSource[title.key], title.orangeThreshold) ? true : false,
          "red-threshold": title.redThreshold !== undefined && (0, _common.compareComputed)(title.compare, dataSource[title.key], title.redThreshold) ? true : false
        });
      }

      var titleData = dataSource[title.key] === undefined ? '-' : dataSource[title.key];

      return _react2.default.createElement(
        'div',
        { className: 'icon-title-mini' },
        _react2.default.createElement(
          'div',
          { className: 'icon-title-mini-icon-bg' },
          _react2.default.createElement(
            'div',
            { className: 'icon-title-mini-icon' },
            icon
          )
        ),
        _react2.default.createElement(
          'div',
          { className: 'icon-title-mini-title' },
          _react2.default.createElement(
            'div',
            { className: 'icon-title-mini-title-data healthy ' + titleStatus },
            titleData
          ),
          _react2.default.createElement(
            'div',
            { className: 'icon-title-mini-title-text' },
            title.label
          )
        )
      );
    }
  }]);

  return NumberMiniE;
}(_react2.default.Component), _class.propTypes = {
  iconType: _react2.default.PropTypes.string,
  iconUrl: _react2.default.PropTypes.string,
  iconHtml: _react2.default.PropTypes.element,
  title: _react2.default.PropTypes.shape({
    label: _react2.default.PropTypes.string,
    orangeThreshold: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.string, _react2.default.PropTypes.number]),
    redThreshold: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.string, _react2.default.PropTypes.number]),
    compare: _react2.default.PropTypes.oneOf(['<', '<=', '>', '>=', '==', '===', '!=', '!==']),
    key: _react2.default.PropTypes.string.isRequired
  }),
  dataSource: _react2.default.PropTypes.object
}, _class.defaultProps = {

  dataSource: {},
  title: {
    "label": "Title",
    "key": "title"
  },
  iconHtml: _react2.default.createElement(_aisc.Icon, { type: 'ais', size: 'large' })
}, _temp);
NumberMiniE.displayName = 'NumberMiniE';
exports.default = NumberMiniE;
module.exports = exports['default'];