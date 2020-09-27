'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _common = require('../common/common');

var _log = require('../common/log');

var _log2 = _interopRequireDefault(_log);

require('./index.css');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults(subClass, superClass); }

var prefix = 'cloud-wicon';

var Wicon = function (_React$Component) {
  _inherits(Wicon, _React$Component);

  function Wicon(props) {
    _classCallCheck(this, Wicon);

    // 图表初始化时记录日志
    var _this = _possibleConstructorReturn(this, _React$Component.call(this, props));

    (0, _log2.default)('Wicon', 'init');
    return _this;
  }

  Wicon.prototype.render = function render() {
    var _classNames;

    var _props = this.props,
        type = _props.type,
        size = _props.size,
        className = _props.className,
        status = _props.status,
        reverse = _props.reverse,
        other = _objectWithoutProperties(_props, ['type', 'size', 'className', 'status', 'reverse']);

    var classes = (0, _classnames2.default)((_classNames = {
      'cloud-charts': true
    }, _classNames[prefix + '-' + type] = !!type, _classNames['' + prefix] = true, _classNames[prefix + '-' + size] = !!size, _classNames[prefix + '-' + (0, _common.getStatusColorName)(status)] = !!status, _classNames[prefix + '-reverse'] = !!reverse, _classNames[className] = !!className, _classNames));

    return _react2.default.createElement('i', _extends({ className: classes }, other));
  };

  return Wicon;
}(_react2.default.Component);

Wicon.displayName = 'Wicon';
Wicon.defaultProps = {
  size: 'big',
  type: 'monitor',
  status: 'none'
};
Wicon.displayName = 'Wicon';
exports.default = Wicon;


Wicon.propTypes = {
  type: _propTypes2.default.string
};