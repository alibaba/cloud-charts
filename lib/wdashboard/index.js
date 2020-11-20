'use strict';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = void 0;

var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutPropertiesLoose"));

var _inheritsLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/inheritsLoose"));

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _classnames = _interopRequireDefault(require("classnames"));

var _dashboard = _interopRequireDefault(require("./dashboard"));

require("./index.scss");

var _log = _interopRequireDefault(require("../common/log"));

var prefix = 'cloud-wdashboard';

var Wdashboard = /*#__PURE__*/function (_React$Component) {
  (0, _inheritsLoose2["default"])(Wdashboard, _React$Component);

  // static defaultProps = {
  //   range: [0, 100],
  //   pointCount: 6,
  // };
  function Wdashboard(props) {
    var _this;

    _this = _React$Component.call(this, props) || this; // 图表初始化时记录日志

    (0, _log["default"])('Wdashboard', 'init');
    return _this;
  }

  var _proto = Wdashboard.prototype;

  _proto.componentDidMount = function componentDidMount() {
    var _this$props = this.props,
        data = _this$props.data,
        config = _this$props.config;

    if (!this.dom) {
      return;
    }

    this.dashboard = new _dashboard["default"](this.dom, Object.assign({}, config));
    this.dashboard.setData(data);
  };

  _proto.componentDidUpdate = function componentDidUpdate(prevProps) {
    var _this$props2 = this.props,
        newData = _this$props2.data,
        newOptions = _this$props2.config;
    var oldData = prevProps.data,
        oldOptions = prevProps.config;

    if (newOptions !== oldOptions) {
      this.dashboard.setOption(Object.assign({}, newOptions));
    }

    if (newData !== oldData && this.dashboard) {
      this.dashboard.setData(newData);
    }
  };

  _proto.render = function render() {
    var _classNames,
        _this2 = this;

    var _this$props3 = this.props,
        className = _this$props3.className,
        otherProps = (0, _objectWithoutPropertiesLoose2["default"])(_this$props3, ["className"]);
    var mainClasses = (0, _classnames["default"])((_classNames = {
      'cloud-charts': true
    }, _classNames[prefix] = true, _classNames[className] = !!className, _classNames));
    return /*#__PURE__*/_react["default"].createElement("div", {
      className: "doa-dashoboard-out"
    }, /*#__PURE__*/_react["default"].createElement("div", {
      ref: function ref(s) {
        return _this2.dom = s;
      },
      className: mainClasses
    }));
  };

  return Wdashboard;
}(_react["default"].Component); // Wdashboard.propTypes = {
//   range: PropTypes.array, //取值范围
//   pointCount: PropTypes.number, // 刻度个数
// };


exports["default"] = Wdashboard;
Wdashboard.displayName = 'Wdashboard';