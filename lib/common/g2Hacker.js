"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _g = _interopRequireDefault(require("@antv/g2"));

var _common = require("./common");

var _themes = _interopRequireDefault(require("../themes"));

/**
 * 在G2初始化前，替换 G.Canvas.getPointByClient 函数，适配CSS缩放的场景。
 * */
var rawGetPointByClient = _g["default"].G.Canvas.prototype.getPointByClient; // 由于需要运行时this指针，这个函数不可改为箭头函数。

_g["default"].G.Canvas.prototype.getPointByClient = function (clientX, clientY) {
  // 获取原函数返回的坐标值
  var raw = rawGetPointByClient.call(this, clientX, clientY); // 获取设定高宽和真实高宽。
  // 当设定的高宽不等于getBoundingClientRect获取的高宽时，说明存在缩放。

  var el = this.get('el');
  var bbox = el.getBoundingClientRect();
  var setWidth = Number(this.get('width'));
  var setHeight = Number(this.get('height'));
  var realWidth = bbox.width,
      realHeight = bbox.height; // 除以缩放比（真实高宽 / 设定高宽）获得真实的坐标。

  return {
    x: raw.x / (realWidth / setWidth),
    y: raw.y / (realHeight / setHeight)
  };
};
/**
 * 在G2初始化前，替换 G2.Chart._getAutoPadding 函数，适配html图例自动计算padding的功能。
 * */


var rawGet = _g["default"].Chart.prototype._getAutoPadding;

_g["default"].Chart.prototype._getAutoPadding = function () {
  // console.log('autoPadding');
  var legendController = this.get('legendController');

  if (legendController && legendController.legends) {
    var frontPlot = this.get('frontPlot'); // 建立新的group专门存放图例占位区

    var legendPlot = this.get('legendPlot');

    if (!legendPlot) {
      legendPlot = frontPlot.addGroup();
      this.set('legendPlot', legendPlot);
    } else {
      // changeData 时清空 legendPlot
      legendPlot.clear();
    } // console.log('before', frontPlot.getBBox());


    var _this$get$getBounding = this.get('wrapperEl').getBoundingClientRect(),
        top = _this$get$getBounding.top,
        right = _this$get$getBounding.right,
        bottom = _this$get$getBounding.bottom,
        left = _this$get$getBounding.left; // console.log('canvas ', 'top:', top, 'left:', left, 'width:', right - left, 'height:', bottom - top);


    var chartWidth = Number(this.get('width'));
    var chartHeight = Number(this.get('height'));
    var widthRadio = (right - left) / chartWidth;
    var heightRadio = (bottom - top) / chartHeight; // console.log('set ', 'width:', chartWidth, 'height:', chartHeight, widthRadio, heightRadio);

    Object.keys(legendController.legends).forEach(function (position) {
      var legendPosition = position.split('-')[0] || 'top';
      legendController.legends[position].forEach(function (legend) {
        // 通过自定义的属性 paddingIgnore 判断是否需要响应自动计算padding
        if (legend.get('useHtml') && legend.get('legendWrapper') && !legend.get('paddingIgnore')) {
          var legendRect = legend.get('legendWrapper').getBoundingClientRect(); // 由于默认开启图例自动折叠，图例高度不高于整个图表高度的 三分之一，这里是一个粗略的估算值

          var h = Math.min(legendRect.bottom - legendRect.top, Math.round(chartHeight / 3));
          legendPlot.addShape('rect', {
            // visible: false,
            attrs: {
              x: (legendRect.left - left) / widthRadio,
              // 由于 axis label 不计算 auto padding，所以需要单独加上 axis label 的 offset
              y: (legendRect.top - top + (legendPosition === 'top' ? -h : h + (0, _common.pxToNumber)(_themes["default"]['widgets-font-size-1']) * 1.5)) / heightRadio,
              width: (legendRect.right - legendRect.left) / widthRadio,
              height: h / heightRadio,
              lineWidth: 0 // fill: 'rgba(200, 100, 100, 0.3)',
              // stroke: 'red',
              // radius: 2

            }
          }); // console.log('legend', 'x:', legendRect.left - left, 'y:', legendRect.top - top + (legendPosition === 'top' ? -h : (h + pxToNumber(themes['widgets-font-size-1']) * 1.5)), 'width:', legendRect.right - legendRect.left, 'height:', h);
        }
      });
    }); // console.log('after', frontPlot.getBBox());
  }

  return rawGet.call(this);
};