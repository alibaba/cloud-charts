'use strict';

exports.__esModule = true;
exports.default = undefined;

var _class, _temp;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

require('./index.scss');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults(subClass, superClass); }

var prefix = 'aisc-warrow';

var Wcircle = (_temp = _class = function (_React$Component) {
  _inherits(Wcircle, _React$Component);

  function Wcircle() {
    _classCallCheck(this, Wcircle);

    return _possibleConstructorReturn(this, _React$Component.apply(this, arguments));
  }

  Wcircle.prototype.render = function render() {
    var type = this.props.type;

    var mainClasses = (0, _classnames2.default)(prefix, prefix + '-' + type);

    return _react2.default.createElement('i', { className: mainClasses });
  };

  return Wcircle;
}(_react2.default.Component), _class.defaultProps = {
  type: 'up'
}, _temp);
Wcircle.displayName = 'Wcircle';
exports.default = Wcircle;
module.exports = exports['default'];