'use strict';

exports.__esModule = true;
exports.default = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _class, _temp;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

require('./index.scss');

var _log = require('../common/log');

var _log2 = _interopRequireDefault(_log);

var _shoot = require('./shoot');

var _shoot2 = _interopRequireDefault(_shoot);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults(subClass, superClass); }

var prefix = 'aisc-wshoot';

var Wshoot = (_temp = _class = function (_React$Component) {
  _inherits(Wshoot, _React$Component);

  function Wshoot(props) {
    _classCallCheck(this, Wshoot);

    // 图表初始化时记录日志
    var _this = _possibleConstructorReturn(this, _React$Component.call(this, props));

    _this.canvas = null;
    _this.shoot = null;
    (0, _log2.default)('Wshoot', 'init');
    return _this;
  }

  Wshoot.prototype.componentDidMount = function componentDidMount() {
    var _props = this.props,
        width = _props.width,
        height = _props.height,
        config = _props.config,
        getPosition = _props.getPosition;

    this.shoot = new _shoot2.default(this.canvas, getPosition, _extends({
      width: width,
      height: height
    }, config));
  };

  Wshoot.prototype.componentDidUpdate = function componentDidUpdate(prevProps) {
    var _props2 = this.props,
        newData = _props2.data,
        newWidth = _props2.width,
        newHeight = _props2.height;
    var oldData = prevProps.data,
        oldWidth = prevProps.width,
        oldHeight = prevProps.height;

    if (newData !== oldData) {
      this.shoot.draw(newData);
    }

    if (newWidth !== oldWidth || newHeight !== oldHeight) {
      this.shoot.changeSize(newWidth, newHeight);
    }
  };

  Wshoot.prototype.componentWillUnmount = function componentWillUnmount() {
    this.shoot && this.shoot.destroy();
  };

  Wshoot.prototype.render = function render() {
    var _classNames,
        _this2 = this;

    var _props3 = this.props,
        className = _props3.className,
        data = _props3.data,
        config = _props3.config,
        otherProps = _objectWithoutProperties(_props3, ['className', 'data', 'config']);

    var mainClasses = (0, _classnames2.default)(prefix, (_classNames = {}, _classNames[className] = !!className, _classNames));

    return _react2.default.createElement('canvas', _extends({ className: mainClasses }, otherProps, { ref: function ref(c) {
        return _this2.canvas = c;
      } }));
  };

  return Wshoot;
}(_react2.default.Component), _class.displayName = 'Wshoot', _class.propTypes = {
  config: _propTypes2.default.object,
  data: _propTypes2.default.array
}, _class.defaultProps = {
  width: 800,
  height: 600,
  config: {},
  data: []
}, _temp);
Wshoot.displayName = 'Wshoot';
exports.default = Wshoot;
module.exports = exports['default'];