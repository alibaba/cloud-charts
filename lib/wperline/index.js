'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _class, _temp;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _log = require('../common/log');

var _log2 = _interopRequireDefault(_log);

require('./index.scss');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var prefix = 'aisc-wperline';

var Wperline = (_temp = _class = function (_React$Component) {
  _inherits(Wperline, _React$Component);

  function Wperline(props) {
    _classCallCheck(this, Wperline);

    // 图表初始化时记录日志
    var _this = _possibleConstructorReturn(this, (Wperline.__proto__ || Object.getPrototypeOf(Wperline)).call(this, props));

    (0, _log2.default)('Wperline', 'init');
    return _this;
  }

  _createClass(Wperline, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          className = _props.className,
          style = _props.style,
          percent = _props.percent,
          status = _props.status,
          others = _objectWithoutProperties(_props, ['className', 'style', 'percent', 'status']);

      var barStyle = { width: percent + '%' };
      var textStyle = {};

      if (percent < 15) {
        textStyle.marginRight = 0;
        textStyle.marginLeft = '100%';
        textStyle.paddingLeft = 7;
      }

      var cls = (0, _classnames2.default)(prefix, prefix + '-status-' + status, className);

      return _react2.default.createElement(
        'div',
        _extends({ className: cls, style: style }, others),
        _react2.default.createElement(
          'div',
          { className: prefix + '-num', style: barStyle },
          _react2.default.createElement(
            'span',
            { style: textStyle },
            percent,
            '%'
          )
        )
      );
    }
  }]);

  return Wperline;
}(_react2.default.Component), _class.displayName = 'Wperline', _class.defaultProps = {
  percent: 0,
  status: ''
}, _temp);
Wperline.displayName = 'Wperline';
exports.default = Wperline;


Wperline.propTypes = {
  percent: _propTypes2.default.number,
  status: _propTypes2.default.string
};
module.exports = exports['default'];