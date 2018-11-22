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

var _dashboard = require('./dashboard');

var _dashboard2 = _interopRequireDefault(_dashboard);

require('./index.scss');

var _log = require('../common/log');

var _log2 = _interopRequireDefault(_log);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults(subClass, superClass); }

var prefix = 'aisc-wdashboard';

var Wdashboard = (_temp = _class = function (_React$Component) {
  _inherits(Wdashboard, _React$Component);

  function Wdashboard(props) {
    _classCallCheck(this, Wdashboard);

    // 图表初始化时记录日志
    var _this = _possibleConstructorReturn(this, _React$Component.call(this, props));

    (0, _log2.default)('Wdashboard', 'init');
    return _this;
  }

  Wdashboard.prototype.componentDidMount = function componentDidMount() {
    var _props = this.props,
        data = _props.data,
        options = _objectWithoutProperties(_props, ['data']);

    if (!this.dom) {
      return;
    }
    this.dashboard = new _dashboard2.default(this.dom, _extends({}, options));
    this.dashboard.setData(data);
  };

  Wdashboard.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
    var newData = nextProps.data,
        newOptions = nextProps.config;
    var _props2 = this.props,
        oldData = _props2.data,
        oldOptions = _props2.config;


    if (newOptions !== oldOptions) {
      this.dashboard.setOption(_extends({}, newOptions));
    } else if (newData !== oldData && this.dashboard) {
      this.dashboard.setData(newData);
    }
  };

  Wdashboard.prototype.render = function render() {
    var _classNames,
        _this2 = this;

    var _props3 = this.props,
        className = _props3.className,
        otherProps = _objectWithoutProperties(_props3, ['className']);

    var mainClasses = (0, _classnames2.default)((_classNames = {}, _classNames[prefix] = true, _classNames[className] = !!className, _classNames));

    return _react2.default.createElement(
      'div',
      { className: 'doa-dashoboard-out' },
      _react2.default.createElement('div', { ref: function ref(s) {
          return _this2.dom = s;
        }, className: mainClasses })
    );
  };

  return Wdashboard;
}(_react2.default.Component), _class.displayName = 'Wdashboard', _class.defaultProps = {
  range: [0, 100],
  pointCount: 5
}, _temp);
Wdashboard.displayName = 'Wdashboard';
exports.default = Wdashboard;


Wdashboard.propTypes = {
  range: _propTypes2.default.array, //取值范围
  pointCount: _propTypes2.default.number // 刻度个数
};
module.exports = exports['default'];