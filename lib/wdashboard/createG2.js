"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.default = createG2;

var _g = require("g2");

var _g2 = _interopRequireDefault(_g);

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _propTypes = require("prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var uniqueId = 0;
function generateUniqueId() {
  return "rc-g2-" + uniqueId++;
}

function createG2(__operation) {
  var _class, _temp;

  var Component = (_temp = _class = function (_React$Component) {
    _inherits(Component, _React$Component);

    function Component(props, context) {
      _classCallCheck(this, Component);

      var _this = _possibleConstructorReturn(this, (Component.__proto__ || Object.getPrototypeOf(Component)).call(this, props, context));

      _this.chart = null;
      _this.chartId = generateUniqueId();
      return _this;
    }

    _createClass(Component, [{
      key: "componentDidMount",
      value: function componentDidMount() {
        this.initChart(this.props);
      }
    }, {
      key: "componentWillReceiveProps",
      value: function componentWillReceiveProps(newProps) {
        var newData = newProps.data,
            newWidth = newProps.width,
            newHeight = newProps.height,
            newPlotCfg = newProps.plotCfg;
        var _props = this.props,
            oldData = _props.data,
            oldWidth = _props.width,
            oldHeight = _props.height,
            oldPlotCfg = _props.plotCfg;


        if (newPlotCfg !== oldPlotCfg) {
          console.warn("plotCfg 不支持修改");
        }

        if (newData !== oldData) {
          this.chart.changeData(newData);
        }
        if (newWidth !== oldWidth || newHeight !== oldHeight) {
          this.chart.changeSize(newWidth, newHeight);
        }
      }
    }, {
      key: "componentWillUnmount",
      value: function componentWillUnmount() {
        this.chart.destroy();
        this.chart = null;
        this.chartId = null;
      }
    }, {
      key: "initChart",
      value: function initChart(props) {
        var width = props.width,
            height = props.height,
            data = props.data,
            plotCfg = props.plotCfg,
            forceFit = props.forceFit,
            configs = props.configs;

        var chart = new _g2.default.Chart({
          id: this.chartId,
          width: width,
          height: height,
          plotCfg: plotCfg,
          forceFit: forceFit
        });
        chart.source(data);
        __operation(chart, configs);
        this.chart = chart;
      }
    }, {
      key: "render",
      value: function render() {
        return _react2.default.createElement("div", { id: this.chartId });
      }
    }]);

    return Component;
  }(_react2.default.Component), _class.propTypes = {
    data: _propTypes2.default.oneOfType([_propTypes2.default.arrayOf(_propTypes2.default.object), _propTypes2.default.instanceOf(_g2.default.Frame)]).isRequired,
    width: _propTypes2.default.number.isRequired,
    height: _propTypes2.default.number.isRequired,
    plotCfg: _propTypes2.default.object,
    forceFit: _propTypes2.default.bool,
    configs: _propTypes2.default.object
  }, _temp);
  Component.displayName = "Component";


  return Component;
}
module.exports = exports["default"];