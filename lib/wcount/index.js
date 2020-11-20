'use strict';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutPropertiesLoose"));

var _inheritsLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/inheritsLoose"));

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _classnames = _interopRequireDefault(require("classnames"));

var _CountUp = _interopRequireDefault(require("./dep/CountUp"));

var _common = require("../common/common");

require("./index.scss");

var _log = _interopRequireDefault(require("../common/log"));

var prefix = 'cloud-wcount';
var checkKey = ['start', 'decimals', 'duration', 'useEasing', 'useGrouping', 'separator', 'decimal', 'placeholder']; // 检查 a, b 两个对象中某些key是否有变化

function configChange(a, b) {
  return checkKey.some(function (key) {
    return a[key] !== b[key];
  });
}
/**
 * 数字切片函数
 *
 * @param {number} start 起始值
 * @param {number} end 结束值
 * @param {number} clipNum 切片数
 * @param {number} slipScale 幅度数组
 *
 * @return {array} 切片后的数值数组
 * */


function clipValue(start, end, clipNum, slipScale) {
  var result = [];
  var delta = end - start;
  var step = delta / clipNum; // 循环次数为 clipNum - 1， 最后一次直接添加end，防止计算精度误差

  for (var i = 1; i < clipNum; i++) {
    if (slipScale[i]) {
      // 自定义切片
      result.push(start + slipScale[i] * delta);
    } else {
      // 平均切片
      result.push(start + step * i);
    }
  }

  result.push(end);
  return result;
}

var Wcount = /*#__PURE__*/function (_React$Component) {
  (0, _inheritsLoose2["default"])(Wcount, _React$Component);

  function Wcount(props) {
    var _this;

    _this = _React$Component.call(this, props) || this; // 图表初始化时记录日志

    _this.dom = null;
    _this.countUp = null;
    _this.clipTimer = null;
    (0, _log["default"])('Wcount', 'init');
    return _this;
  }

  var _proto = Wcount.prototype;

  _proto.componentDidMount = function componentDidMount() {
    if (!this.dom) {
      return;
    }

    this.createCountUp(this.props);
  };

  _proto.componentDidUpdate = function componentDidUpdate(prevProps) {
    var _this$props = this.props,
        newEnd = _this$props.end,
        newOptions = (0, _objectWithoutPropertiesLoose2["default"])(_this$props, ["end"]);
    var oldEnd = prevProps.end,
        oldOptions = (0, _objectWithoutPropertiesLoose2["default"])(prevProps, ["end"]); // 大部分配置项如果改变了，直接生成新的实例

    if (configChange(newOptions, oldOptions)) {
      this.createCountUp(this.props);
    } else if (newEnd !== oldEnd && this.countUp) {
      // 如果只有 end 改变了，更新数据
      this.clipNumber(newOptions, newEnd);
    }
  };

  _proto.componentWillUnmount = function componentWillUnmount() {
    // 清空定时器
    clearInterval(this.clipTimer); // 停止 countUp 组件

    if (this.countUp) {
      this.countUp.pauseResume();
    }
  };

  _proto.clipNumber = function clipNumber(props, newEnd) {
    var _this2 = this;

    var clipNum = props.clipNum,
        clipPeriod = props.clipPeriod,
        slipScale = props.slipScale; // 清空定时器

    clearInterval(this.clipTimer);

    if (clipNum > 1) {
      // 切片
      // 生成切片列表，每个周期更新一次
      var clipArray = clipValue(this.countUp.endVal, newEnd, clipNum, slipScale);
      var loopIndex = 0; // 定时更新

      this.clipTimer = setInterval(function () {
        _this2.countUp && _this2.countUp.update(clipArray[loopIndex]);
        loopIndex += 1; // 已更新完切片列表，清空定时器

        if (loopIndex >= clipArray.length) {
          clearInterval(_this2.clipTimer);
        }
      }, clipPeriod * 1000);
    } else {
      // 直接更新
      this.countUp.update(newEnd);
    }
  };

  _proto.createCountUp = function createCountUp(props) {
    var start = props.start,
        end = props.end,
        decimals = props.decimals,
        duration = props.duration,
        options = (0, _objectWithoutPropertiesLoose2["default"])(props, ["start", "end", "decimals", "duration"]);
    var countUp = new _CountUp["default"](this.dom, start, end, decimals, duration, options);

    if (!countUp.error) {
      countUp.start();
    } else {
      console.error(countUp.error);
    }

    this.countUp = countUp;
  };

  _proto.render = function render() {
    var _classNames,
        _this3 = this;

    var _this$props2 = this.props,
        className = _this$props2.className,
        otherProps = (0, _objectWithoutPropertiesLoose2["default"])(_this$props2, ["className"]);
    var mainClasses = (0, _classnames["default"])((_classNames = {
      'cloud-charts': true
    }, _classNames[prefix] = true, _classNames[className] = !!className, _classNames));
    return /*#__PURE__*/_react["default"].createElement("span", (0, _extends2["default"])({
      ref: function ref(s) {
        return _this3.dom = s;
      },
      className: mainClasses
    }, (0, _common.filterKey)(otherProps, checkKey.concat(['end', 'clipNum', 'clipPeriod', 'slipScale']))));
  };

  return Wcount;
}(_react["default"].Component);

exports["default"] = Wcount;
Wcount.displayName = 'Wcount';
Wcount.defaultProps = {
  // 切片配置
  clipNum: 1,
  clipPeriod: 5,
  slipScale: [],
  // countUp 配置
  // 常用
  start: 0,
  end: 0,
  decimals: 0,
  duration: 1.5,
  // 额外配置
  useEasing: true,
  // toggle easing
  useGrouping: true,
  // 1,000,000 vs 1000000
  separator: ',',
  // character to use as a separator
  decimal: '.',
  // character to use as a decimal
  placeholder: "-" // 非数据时的替换

};
Wcount.propTypes = {
  clipNum: _propTypes["default"].number,
  clipPeriod: _propTypes["default"].number,
  slipScale: _propTypes["default"].arrayOf(_propTypes["default"].number),
  start: _propTypes["default"].number,
  end: _propTypes["default"].number,
  decimals: _propTypes["default"].number,
  duration: _propTypes["default"].number,
  useEasing: _propTypes["default"].bool,
  useGrouping: _propTypes["default"].bool,
  separator: _propTypes["default"].string,
  decimal: _propTypes["default"].string,
  placeholder: _propTypes["default"].string
};