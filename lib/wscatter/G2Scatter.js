"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _desc, _value, _class;

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _g = require("g2");

var _g2 = _interopRequireDefault(_g);

var _createG = require("utils/createG2");

var _createG2 = _interopRequireDefault(_createG);

var _coreDecorators = require("core-decorators");

require("./index.scss");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
  var desc = {};
  Object['ke' + 'ys'](descriptor).forEach(function (key) {
    desc[key] = descriptor[key];
  });
  desc.enumerable = !!desc.enumerable;
  desc.configurable = !!desc.configurable;

  if ('value' in desc || desc.initializer) {
    desc.writable = true;
  }

  desc = decorators.slice().reverse().reduce(function (desc, decorator) {
    return decorator(target, property, desc) || desc;
  }, desc);

  if (context && desc.initializer !== void 0) {
    desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
    desc.initializer = undefined;
  }

  if (desc.initializer === void 0) {
    Object['define' + 'Property'](target, property, desc);
    desc = null;
  }

  return desc;
}

var scatterPlot = (_class = function (_React$Component) {
  _inherits(scatterPlot, _React$Component);

  function scatterPlot(props) {
    _classCallCheck(this, scatterPlot);

    return _possibleConstructorReturn(this, (scatterPlot.__proto__ || Object.getPrototypeOf(scatterPlot)).call(this, props));
  }

  _createClass(scatterPlot, [{
    key: "getAmountLevel",
    value: function getAmountLevel(num) {
      num = +num;
      var eStr = num.toExponential(2);
      var temp = eStr.split("e");
      var amount = Math.floor(+temp[0]) + 1;
      var level = +temp[1];
      return { amount: amount, level: level };
    }
  }, {
    key: "renderChart",
    value: function renderChart() {
      var _this2 = this;

      var data = this.props.data;

      var scaleList = data.map(function (item) {
        return +item.scale;
      }),
          pueList = data.map(function (item) {
        return +item.pue;
      });
      var maxScale = Math.max.apply(Math, scaleList),
          maxPue = Math.max.apply(Math, pueList);
      var maxScaleNormal = this.getAmountLevel(maxScale),
          maxPueNormal = this.getAmountLevel(maxPue);
      var maxScaleAxis = maxScaleNormal.amount * Math.pow(10, maxScaleNormal.level),
          maxPueAxis = maxPueNormal.amount * Math.pow(10, maxPueNormal.level);
      _g2.default.Global.setTheme("cheery"); // 切换默认主题
      var Chart = (0, _createG2.default)(function (chart) {
        chart.col("scale", {
          tickCount: 8,
          min: 0,
          max: maxScaleAxis,
          alias: "服务器数量"
        });
        chart.col("pue", {
          min: 0,
          max: maxPueAxis,
          alias: "PUE"
        });
        chart.tooltip(true, {
          map: {
            title: "idc",
            name: "scale",
            value: "pue"
          }
        });
        chart.point().position("scale*pue").color("idc").shape("idc", ["circle", "triangle-down", "square", "diamond"]).size(5);
        // 添加辅助元素
        chart.guide().text([Math.floor(maxScaleAxis / 3 / 2 * 1), maxPueAxis - 1], "0 - " + Math.floor(maxScaleAxis / 3 / 2 * 2), {
          fontSize: "15px"
        });
        chart.guide().text([Math.floor(maxScaleAxis / 3 / 2 * 3), maxPueAxis - 1], Math.floor(maxScaleAxis / 3 / 2 * 2) + " - " + Math.floor(maxScaleAxis / 3 / 2 * 4), {
          fontSize: "15px"
        });
        chart.guide().text([Math.floor(maxScaleAxis / 3 / 2 * 5), maxPueAxis - 1], Math.floor(maxScaleAxis / 3 / 2 * 4) + " - " + Math.floor(maxScaleAxis / 3 / 2 * 6), {
          fontSize: "15px"
        });
        chart.guide().rect([0, 0], [Math.floor(maxScaleAxis / 3 / 2 * 2), maxPueAxis]);
        chart.guide().rect([Math.floor(maxScaleAxis / 3 / 2 * 2), 0], [Math.floor(maxScaleAxis / 3 / 2 * 4), maxPueAxis], {
          fillOpacity: 0.2
        });
        chart.guide().rect([Math.floor(maxScaleAxis / 3 / 2 * 4), 0], [Math.floor(maxScaleAxis / 3 / 2 * 6), maxPueAxis], {
          fillOpacity: 0.3
        });
        chart.on("plotclick", _this2.props.onClick);
        chart.render();
      });
      return Chart;
    }
  }, {
    key: "render",
    value: function render() {
      var data = this.props.data;

      var Chart = void 0;
      if (data && data.length) {
        Chart = this.renderChart();
      }
      return _react2.default.createElement(
        "div",
        { className: "scatter-plot-container" },
        data && data.length ? _react2.default.createElement(Chart, { data: data, width: 600, height: 450, forceFit: true }) : "无数据"
      );
    }
  }]);

  return scatterPlot;
}(_react2.default.Component), (_applyDecoratedDescriptor(_class.prototype, "renderChart", [_coreDecorators.autobind], Object.getOwnPropertyDescriptor(_class.prototype, "renderChart"), _class.prototype)), _class);
scatterPlot.displayName = "scatterPlot";
exports.default = scatterPlot;
module.exports = exports["default"];