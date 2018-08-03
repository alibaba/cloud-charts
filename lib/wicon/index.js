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

var _common = require('../common/common');

var _log = require('../common/log');

var _log2 = _interopRequireDefault(_log);

require('./index.scss');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var prefix = 'aisc-wicon';

var Wicon = (_temp = _class = function (_React$Component) {
  _inherits(Wicon, _React$Component);

  function Wicon(props) {
    _classCallCheck(this, Wicon);

    // 图表初始化时记录日志
    var _this = _possibleConstructorReturn(this, (Wicon.__proto__ || Object.getPrototypeOf(Wicon)).call(this, props));

    (0, _log2.default)('Wicon', 'init');
    return _this;
  }

  _createClass(Wicon, [{
    key: 'render',
    value: function render() {
      var _classNames;

      var _props = this.props,
          type = _props.type,
          size = _props.size,
          classname = _props.classname,
          status = _props.status,
          reverse = _props.reverse,
          other = _objectWithoutProperties(_props, ['type', 'size', 'classname', 'status', 'reverse']);

      var classes = (0, _classnames2.default)((_classNames = {}, _defineProperty(_classNames, 'next-icon', true), _defineProperty(_classNames, 'next-icon-' + type, !!type), _defineProperty(_classNames, '' + prefix, true), _defineProperty(_classNames, prefix + '-' + size, !!size), _defineProperty(_classNames, prefix + '-' + (0, _common.getStatusColorName)(status), !!status), _defineProperty(_classNames, prefix + '-reverse', !!reverse), _defineProperty(_classNames, classname, !!classname), _classNames));

      return _react2.default.createElement('i', _extends({ className: classes }, other));
    }
  }]);

  return Wicon;
}(_react2.default.Component), _class.displayName = 'Wicon', _class.defaultProps = {
  size: 'big',
  type: 'monitor',
  status: 'none'
}, _temp);
Wicon.displayName = 'Wicon';
exports.default = Wicon;


Wicon.propTypes = {
  type: _propTypes2.default.string
};
module.exports = exports['default'];