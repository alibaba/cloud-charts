'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _dashboard = require('./dashboard');

var _dashboard2 = _interopRequireDefault(_dashboard);

require('./index.css');

var _log = require('../common/log');

var _log2 = _interopRequireDefault(_log);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults(subClass, superClass); }

var prefix = 'cloud-wdashboard';

var Wdashboard = function (_React$Component) {
  _inherits(Wdashboard, _React$Component);

  // static defaultProps = {
  //   range: [0, 100],
  //   pointCount: 6,
  // };

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
        config = _props.config;

    if (!this.dom) {
      return;
    }
    this.dashboard = new _dashboard2.default(this.dom, _extends({}, config));
    this.dashboard.setData(data);
  };

  Wdashboard.prototype.componentDidUpdate = function componentDidUpdate(prevProps) {
    var _props2 = this.props,
        newData = _props2.data,
        newOptions = _props2.config;
    var oldData = prevProps.data,
        oldOptions = prevProps.config;


    if (newOptions !== oldOptions) {
      this.dashboard.setOption(_extends({}, newOptions));
    }
    if (newData !== oldData && this.dashboard) {
      this.dashboard.setData(newData);
    }
  };

  Wdashboard.prototype.render = function render() {
    var _classNames,
        _this2 = this;

    var _props3 = this.props,
        className = _props3.className,
        otherProps = _objectWithoutProperties(_props3, ['className']);

    var mainClasses = (0, _classnames2.default)((_classNames = {
      'cloud-charts': true
    }, _classNames[prefix] = true, _classNames[className] = !!className, _classNames));

    return _react2.default.createElement(
      'div',
      { className: 'doa-dashoboard-out' },
      _react2.default.createElement('div', { ref: function ref(s) {
          return _this2.dom = s;
        }, className: mainClasses })
    );
  };

  return Wdashboard;
}(_react2.default.Component);

// Wdashboard.propTypes = {
//   range: PropTypes.array, //取值范围
//   pointCount: PropTypes.number, // 刻度个数
// };


Wdashboard.displayName = 'Wdashboard';
Wdashboard.displayName = 'Wdashboard';
exports.default = Wdashboard;