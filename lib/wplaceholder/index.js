'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

require('./index.scss');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var prefix = 'aisc-wplaceholder';

var Wplaceholder = function (_React$Component) {
  _inherits(Wplaceholder, _React$Component);

  function Wplaceholder() {
    _classCallCheck(this, Wplaceholder);

    return _possibleConstructorReturn(this, (Wplaceholder.__proto__ || Object.getPrototypeOf(Wplaceholder)).apply(this, arguments));
  }

  _createClass(Wplaceholder, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          className = _props.className,
          _props$height = _props.height,
          height = _props$height === undefined ? '100%' : _props$height,
          style = _props.style,
          otherProps = _objectWithoutProperties(_props, ['className', 'height', 'style']);

      var mainClasses = (0, _classnames2.default)(prefix, _defineProperty({}, className, !!className));

      return _react2.default.createElement(
        'div',
        _extends({ className: mainClasses,
          style: _extends({
            height: height
          }, style)
        }, otherProps),
        _react2.default.createElement(
          'svg',
          { width: '44', height: '40', className: 'placeholder-box' },
          _react2.default.createElement('rect', { className: 'placeholder-item', width: '10', height: '25', x: '0', y: '15' }),
          _react2.default.createElement('rect', { className: 'placeholder-item', width: '10', height: '32', x: '17', y: '8' }),
          _react2.default.createElement('rect', { className: 'placeholder-item', width: '10', height: '40', x: '34', y: '0' })
        )
      );
    }
  }]);

  return Wplaceholder;
}(_react2.default.Component);

Wplaceholder.displayName = 'Wplaceholder';
exports.default = Wplaceholder;
module.exports = exports['default'];