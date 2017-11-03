'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _class, _temp2;
// 暂时无需样式
// import './index.scss';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _shoot = require('./shoot');

var _shoot2 = _interopRequireDefault(_shoot);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var prefix = 'aisc-wshoot';

var Wshoot = (_temp2 = _class = function (_React$Component) {
  _inherits(Wshoot, _React$Component);

  function Wshoot() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, Wshoot);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Wshoot.__proto__ || Object.getPrototypeOf(Wshoot)).call.apply(_ref, [this].concat(args))), _this), _this.canvas = null, _this.shoot = null, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(Wshoot, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _props = this.props,
          width = _props.width,
          height = _props.height,
          config = _props.config;

      this.shoot = new _shoot2.default(this.canvas, {}, _extends({
        width: width,
        height: height
      }, config));
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      var newData = nextProps.data;
      var oldData = this.props.data;
      if (newData !== oldData) {
        this.shoot.draw(newData);
      }
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.shoot && this.shoot.destroy();
    }
  }, {
    key: 'render',
    value: function render() {
      var _classNames,
          _this2 = this;

      var className = this.props.className;


      var mainClasses = (0, _classnames2.default)((_classNames = {}, _defineProperty(_classNames, '' + prefix, true), _defineProperty(_classNames, className, !!className), _classNames));

      return _react2.default.createElement('canvas', { className: mainClasses, ref: function ref(c) {
          return _this2.canvas = c;
        } });
    }
  }]);

  return Wshoot;
}(_react2.default.Component), _class.propTypes = {
  config: _propTypes2.default.object,
  data: _propTypes2.default.array
}, _class.defaultProps = {
  width: 800,
  height: 600,
  config: {},
  data: []
}, _temp2);
Wshoot.displayName = 'Wshoot';
exports.default = Wshoot;
module.exports = exports['default'];