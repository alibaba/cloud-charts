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

var _createG = require("./createG2");

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

var color = ["#4AD051", "#F6A71F", "#EF5350"];
// 自定义Shape 部分
var Shape = _g2.default.Shape;
Shape.registShape("point", "dashBoard", {
  drawShape: function drawShape(cfg, group) {
    var origin = cfg.origin; // 原始数据
    var value = origin.value;
    var point = cfg.points[0]; // 获取第一个标记点
    point = this.parsePoint({
      // 将标记点转换到画布坐标
      x: point.x,
      y: 0.95
    });
    var center = this.parsePoint({
      // 获取极坐标系下画布中心点
      x: 0,
      y: 0
    });
    var r = 15;
    var ra = 0.8 * r;
    var X1 = center.x;
    var Y1 = center.y;
    var X2 = point.x;
    var Y2 = point.y;
    var B = 150 / 180;
    var Xa = void 0,
        Xb = void 0,
        Xc = void 0,
        Ya = void 0,
        Yb = void 0,
        Yc = void 0; // 绘制小箭头需要的三个点
    var shape = void 0;
    if (Y1 == Y2) {
      if (X1 > X2) {
        Xa = X2 + Math.cos(B) * ra;
        Ya = Y2 - Math.sin(B) * ra;
        Xb = X2 + Math.cos(B) * ra;
        Yb = Y2 + Math.sin(B) * ra;
        Xc = X2 + 2 * ra;
        Yc = Y2;
      } else {
        Xa = X2 - Math.cos(B) * ra;
        Ya = Y2 - Math.sin(B) * ra;
        Xb = X2 - Math.cos(B) * ra;
        Yb = Y2 + Math.sin(B) * ra;
        Xc = X2 - 2 * ra;
        Yc = Y2;
      }
    } else if (Y1 > Y2) {
      var A = Math.atan((X1 - X2) / (Y1 - Y2));
      Xa = X2 + ra * Math.sin(A + B);
      Ya = Y2 + ra * Math.cos(A + B);
      Xb = X2 + ra * Math.sin(A - B);
      Yb = Y2 + ra * Math.cos(A - B);
      Xc = X2 + 2 * ra * Math.sin(A);
      Yc = Y2 + 2 * ra * Math.cos(A);
    } else {
      if (X1 > X2) {
        var _A = Math.atan((Y2 - Y1) / (X1 - X2));
        Xa = X2 + ra * Math.cos(_A + B);
        Ya = Y2 - ra * Math.sin(_A + B);
        Xb = X2 + ra * Math.cos(_A - B);
        Yb = Y2 - ra * Math.sin(_A - B);
        Xc = X2 + 2 * ra * Math.cos(_A);
        Yc = Y2 - 2 * ra * Math.sin(_A);
      } else {
        var _A2 = Math.atan((Y2 - Y1) / (X2 - X1));
        Xa = X2 - ra * Math.cos(_A2 - B);
        Ya = Y2 - ra * Math.sin(_A2 - B);
        Xb = X2 - ra * Math.cos(_A2 + B);
        Yb = Y2 - ra * Math.sin(_A2 + B);
        Xc = X2 - 2 * ra * Math.cos(_A2);
        Yc = Y2 - 2 * ra * Math.sin(_A2);
      }
    }
    shape = group.addShape("circle", {
      attrs: {
        x: X2,
        y: Y2,
        r: r,
        fill: cfg.color
      }
    });
    group.addShape("circle", {
      attrs: {
        x: X2,
        y: Y2,
        r: r / 2,
        fill: "white"
      }
    });
    // 添加文本1
    group.addShape("text", {
      attrs: {
        x: X1,
        y: Y1 - 25,
        text: "PUE",
        fontSize: 18,
        fill: "#CCCCCC",
        textAlign: "center"
      }
    });
    // 添加文本2
    group.addShape("text", {
      attrs: {
        x: X1,
        y: Y1 + 25,
        text: value,
        fontSize: 18,
        fill: "#F75B5B",
        textAlign: "center"
      }
    });
    group.addShape("polygon", {
      attrs: {
        points: [[Xa, Ya], [Xc, Yc], [Xb, Yb], [Xa, Ya]],
        fill: cfg.color
      }
    });
    return shape;
  }
});

var Dashboard = (_class = function (_React$Component) {
  _inherits(Dashboard, _React$Component);

  function Dashboard(props) {
    _classCallCheck(this, Dashboard);

    return _possibleConstructorReturn(this, (Dashboard.__proto__ || Object.getPrototypeOf(Dashboard)).call(this, props));
  }

  _createClass(Dashboard, [{
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
    key: "drawGuide",
    value: function drawGuide(chart) {
      var data = this.props.data;

      var val = data[0].value;
      var pueList = data.map(function (item) {
        return +item.value;
      });
      var maxPue = Math.max.apply(Math, pueList);
      var maxPueNormal = this.getAmountLevel(maxPue);
      var maxPueAxis = maxPueNormal.amount * Math.pow(10, maxPueNormal.level);
      var lineWidth = 30;
      chart.guide().clear();
      chart.guide().arc([1, 0.95], [maxPueAxis, 0.95], {
        // 底灰色
        stroke: "#CCCCCC",
        lineWidth: lineWidth
      });
      val - 1 > (maxPueAxis - 1) / 3 && chart.guide().arc([1, 0.95], [(maxPueAxis - 1) / 3 + 1, 0.95], {
        // 低PUE
        stroke: color[0],
        lineWidth: lineWidth
      });
      val - 1 > (maxPueAxis - 1) / 3 * 2 && chart.guide().arc([(maxPueAxis - 1) / 3 + 1, 0.95], [(maxPueAxis - 1) / 3 * 2 + 1, 0.95], {
        // 中PUE
        stroke: color[1],
        lineWidth: lineWidth
      });
      val - 1 > 0 && val - 1 <= (maxPueAxis - 1) / 3 && chart.guide().arc([1, 0.95], [val, 0.95], {
        // 低PUE
        stroke: color[0],
        lineWidth: lineWidth
      });
      val - 1 > (maxPueAxis - 1) / 3 && val - 1 <= (maxPueAxis - 1) / 3 * 2 && chart.guide().arc([(maxPueAxis - 1) / 3 + 1, 0.95], [val, 0.95], {
        // 中PUE
        stroke: color[1],
        lineWidth: lineWidth
      });
      val - 1 > (maxPueAxis - 1) / 3 * 2 && val - 1 <= maxPueAxis - 1 && chart.guide().arc([(maxPueAxis - 1) / 3 * 2 + 1, 0.95], [val, 0.95], {
        // 高PUE
        stroke: color[2],
        lineWidth: lineWidth
      });
      chart.changeData(data);
    }
  }, {
    key: "renderChart",
    value: function renderChart() {
      var _this2 = this;

      var data = this.props.data;

      var pueList = data.map(function (item) {
        return +item.value;
      });
      var maxPue = Math.max.apply(Math, pueList);
      var maxPueNormal = this.getAmountLevel(maxPue);
      var maxPueAxis = maxPueNormal.amount * Math.pow(10, maxPueNormal.level);
      var Chart = (0, _createG2.default)(function (chart) {
        chart.coord("gauge", {
          startAngle: Math.PI,
          endAngle: 2 * Math.PI
        });
        chart.col("value", {
          min: 1,
          max: maxPueAxis,
          tickInterval: 0.5
        });
        chart.axis("value", {
          tickLine: {
            stroke: "#EEEEEE"
          },
          labelOffset: -26
        });
        chart.point().position("value").shape("dashBoard").color("value", function (v) {
          // 根据值的大小确定标记的颜色
          var rst = void 0;
          if (v - 1 < (maxPueAxis - 1) / 3) {
            rst = color[0];
          } else if (v - 1 < (maxPueAxis - 1) / 3 * 2) {
            rst = color[1];
          } else {
            rst = color[2];
          }
          return rst;
        });
        chart.legend(false);
        _this2.drawGuide(chart);
        chart.changeData();
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
        { className: "dashboard-container" },
        data && data.length ? _react2.default.createElement(Chart, { data: data, width: 600, height: 550, forceFit: true }) : "无数据"
      );
    }
  }]);

  return Dashboard;
}(_react2.default.Component), (_applyDecoratedDescriptor(_class.prototype, "drawGuide", [_coreDecorators.autobind], Object.getOwnPropertyDescriptor(_class.prototype, "drawGuide"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "renderChart", [_coreDecorators.autobind], Object.getOwnPropertyDescriptor(_class.prototype, "renderChart"), _class.prototype)), _class);
Dashboard.displayName = "Dashboard";
exports.default = Dashboard;
module.exports = exports["default"];