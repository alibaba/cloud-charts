var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

// 引入依赖库
import G2 from '@antv/g2';
import * as DataSet from '@antv/data-set';
import g2Connect from '@alife/g2-connect';
import * as common from './common/common';
import g2Factory from './common/g2Factory';
// import { autoSelect } from './common/platform';

// 引入组件
// import G2Line from './wline/G2Line';
// import G2MiniLine from './wminiline/G2MiniLine';
// import G2Bar from './wbar/G2Bar';
// import G2Histogram from './whistogram/G2Histogram';
// import G2LineBar from './wlinebar/G2LineBar';
// import G2Pie from './wpie/G2Pie';
// import G2Scatter from './wscatter/G2Scatter';
// import G2Map from './wmap/index';
// import G2Custom from './wcustom/G2Custom';
// import G2Sankey from './wsankey/G2Sankey';
// import G2Nightingale from './wnightingale/G2Nightingale';
// import G2Radar from './wradar/G2Radar';
// import G2Rectangle from './wrectangle/G2Rectangle';
// import G2Funnel from './wfunnel/G2Funnel';
// import G2MultiPie from './wmultipie/G2MultiPie';
// import G2Box from './wbox/G2Box';
// import G2Candlestick from './wcandlestick/G2Candlestick';
// import G2Heatmap from './wheatmap/G2Heatmap';

// import F2Line from './wline/F2Line';
// import F2Pie from './wpie/F2Pie';
// import F2Bar from './wbar/F2Bar';
// import F2RangeLine from './wrangeline/F2RangeLine';
// 未实现，空白占位
// import G2RangeLine from './wrangeline/G2RangeLine';

/**
 * 在G2初始化前，替换 G.Canvas.getPointByClient 函数，适配CSS缩放的场景。
 * */
var rawGetPointByClient = G2.G.Canvas.prototype.getPointByClient;
// 由于需要运行时this指针，这个函数不可改为箭头函数。
G2.G.Canvas.prototype.getPointByClient = function (clientX, clientY) {
  // 获取原函数返回的坐标值
  var raw = rawGetPointByClient.call(this, clientX, clientY);
  // 获取设定高宽和真实高宽。
  // 当设定的高宽不等于getBoundingClientRect获取的高宽时，说明存在缩放。
  var el = this.get('el');
  var bbox = el.getBoundingClientRect();
  var setWidth = Number(this.get('width'));
  var setHeight = Number(this.get('height'));
  var realWidth = bbox.width,
      realHeight = bbox.height;
  // 除以缩放比（真实高宽 / 设定高宽）获得真实的坐标。

  return {
    x: raw.x / (realWidth / setWidth),
    y: raw.y / (realHeight / setHeight)
  };
};

var rawGet = G2.Chart.prototype._getAutoPadding;
G2.Chart.prototype._getAutoPadding = function () {
  // console.log('autoPadding');
  var legendController = this.get('legendController');
  if (legendController && legendController.legends) {
    var frontPlot = this.get('frontPlot');
    // console.log('before', frontPlot.getBBox());

    var _get$getBoundingClien = this.get('wrapperEl').getBoundingClientRect(),
        top = _get$getBoundingClien.top,
        right = _get$getBoundingClien.right,
        bottom = _get$getBoundingClien.bottom,
        left = _get$getBoundingClien.left;

    var chartHeight = Number(this.get('height'));
    Object.keys(legendController.legends).forEach(function (position) {
      legendController.legends[position].forEach(function (legend) {
        if (legend.get('useHtml') && legend.get('legendWrapper')) {
          // console.log(legend.get('legendWrapper').getBoundingClientRect());
          var legendRect = legend.get('legendWrapper').getBoundingClientRect();
          // 由于默认开启图例自动折叠，图例高度不高于整个图表高度的 三分之一，这里是一个粗略的估算值
          var h = Math.min(legendRect.bottom - legendRect.top, Math.round(chartHeight / 3));
          frontPlot.addShape('rect', {
            // visible: false,
            attrs: {
              x: legendRect.left - left,
              y: legendRect.top - top - h,
              width: legendRect.right - legendRect.left,
              height: h,
              lineWidth: 0
              // stroke: 'black',
              // radius: 2
            }
          });
        }
      });
    });

    // console.log('after', frontPlot.getBBox());
  }

  return rawGet.call(this);
};

// 暴露所有基础图表
// export const WG2Line = g2Factory('G2Line', G2Line);
// export const WG2MiniLine = g2Factory('G2MiniLine', G2MiniLine);
// export const WG2Bar = g2Factory('G2Bar', G2Bar);
// export const WG2Histogram = g2Factory('G2Histogram', G2Histogram);
// export const WG2LineBar = g2Factory('G2LineBar', G2LineBar, false);
// export const WG2Pie = g2Factory('G2Pie', G2Pie);
// export const WG2Scatter = g2Factory('G2Scatter', G2Scatter);
// export const WG2Map = G2Map;
// export const WG2Custom = g2Factory('G2Custom', G2Custom);
// export const WG2Sankey = g2Factory('G2Sankey', G2Sankey, false);
// export const WG2Nightingale = g2Factory('G2Nightingale', G2Nightingale);
// export const WG2Radar = g2Factory('G2Radar', G2Radar);
// export const WG2Rectangle = g2Factory('G2Rectangle', G2Rectangle, false);
// export const WG2Funnel = g2Factory('G2Funnel', G2Funnel);
// export const WG2MultiPie = g2Factory('G2MultiPie', G2MultiPie, false);
// export const WG2Box = g2Factory('G2Box', G2Box);
// export const WG2Candlestick = g2Factory('G2Candlestick', G2Candlestick);
// export const WG2Heatmap = g2Factory('G2Heatmap', G2Heatmap);

// 暴露基础图表库
export { G2, DataSet };

// 暴露工具类
export var Util = _extends({}, G2.Util, {
  Connect: g2Connect, // 图表联动组件
  propertyMap: common.propertyMap,
  propertyAssign: common.propertyAssign,
  getParentSize: common.getParentSize,
  getStatusColor: common.getStatusColor,
  isInvalidNumber: common.isInvalidNumber,
  numberDecimal: common.numberDecimal,
  beautifyNumber: common.beautifyNumber,
  getRawData: common.getRawData,
  filterKey: common.filterKey,
  isEqual: common.isEqual,
  isEqualWith: common.isEqualWith,
  merge: common.merge
});
var DomUtil = G2.DomUtil;
export { DomUtil };
var MatrixUtil = G2.MatrixUtil;
export { MatrixUtil };
var PathUtil = G2.PathUtil;

// 暴露图表组件

export { PathUtil };
export { default as Wline } from './wline/G2Line';
export { default as Wminiline } from './wminiline/G2MiniLine';
export { default as Wbar } from './wbar/G2Bar';
export { default as Whistogram } from './whistogram/G2Histogram';
export { default as Wlinebar } from './wlinebar/G2LineBar';
export { default as Wpie } from './wpie/G2Pie';
export { default as Wscatter } from './wscatter/G2Scatter';
export { default as Wmap } from './wmap/index';
export { default as Wcustom } from './wcustom/G2Custom';
export { default as Wsankey } from './wsankey/G2Sankey';
export { default as Wnightingale } from './wnightingale/G2Nightingale';
export { default as Wradar } from './wradar/G2Radar';
export { default as Wrectangle } from './wrectangle/G2Rectangle';
export { default as Wfunnel } from './wfunnel/G2Funnel';
export { default as WmultiPie } from './wmultipie/G2MultiPie';
export { default as Wbox } from './wbox/G2Box';
export { default as Wcandlestick } from './wcandlestick/G2Candlestick';
export { default as Wheatmap } from './wheatmap/G2Heatmap';

// export const GFLine = autoSelect(Wline, F2Line);
// export const GFPie = autoSelect(Wpie, F2Pie);
// export const GFBar = autoSelect(Wbar, F2Bar);
// export const GFRangeLine = autoSelect(G2RangeLine, F2RangeLine);
// export const GFLine = F2Line;
// export const GFPie = F2Pie;
// export const GFBar = F2Bar;
// export const GFRangeLine = F2RangeLine;