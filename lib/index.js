'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.COLORS = exports.Wperline = exports.Wplaceholder = exports.Wshoot = exports.Wminicontainer = exports.Wcircle = exports.Wicon = exports.Wcontainer = exports.Wnumber = undefined;

var _g2Charts = require('./g2Charts');

Object.keys(_g2Charts).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _g2Charts[key];
    }
  });
});

var _normal = require('./theme/normal');

require('./index.scss');

var _index = require('./wnumber/index');

var _index2 = _interopRequireDefault(_index);

var _index3 = require('./wcontainer/index');

var _index4 = _interopRequireDefault(_index3);

var _index5 = require('./wicon/index');

var _index6 = _interopRequireDefault(_index5);

var _index7 = require('./wcircle/index');

var _index8 = _interopRequireDefault(_index7);

var _index9 = require('./wminicontainer/index');

var _index10 = _interopRequireDefault(_index9);

var _index11 = require('./wshoot/index');

var _index12 = _interopRequireDefault(_index11);

var _index13 = require('./wplaceholder/index');

var _index14 = _interopRequireDefault(_index13);

var _index15 = require('./wperline/index');

var _index16 = _interopRequireDefault(_index15);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.Wnumber = _index2.default;

// 业务组件，组成没有依赖图表库

exports.Wcontainer = _index4.default;
exports.Wicon = _index6.default;
// export Wminiline from './wminiline/index';

exports.Wcircle = _index8.default;
exports.Wminicontainer = _index10.default;
exports.Wshoot = _index12.default;
exports.Wplaceholder = _index14.default;
exports.Wperline = _index16.default;

// 暴露颜色值

// import * as highchartsMap from './highchartsMap';
//
// export const WG2Line = g2Map.WG2Line;
// export const WG2Bar = g2Map.WG2Bar;
// export const WG2Pie = g2Map.WG2Pie;
// export const WG2Map = g2Map.WG2Map;
// export const WG2Custom = g2Map.WG2Custom;
//
// export const WHighLine = highchartsMap.WHighLine;
// export const WHighBar = highchartsMap.WHighBar;
// export const WHighPie = highchartsMap.WHighPie;
// export const WHighLineBar = highchartsMap.WHighLineBar;
//
// //根据设置的library名字暴露默认的图表组件
// const chartLibraryName = 'G2';
// const chartMap = {
//   // Highcharts: {
//   //   line: highchartsMap.WHighLine,
//   //   bar: highchartsMap.WHighBar,
//   //   pie: highchartsMap.WHighPie,
//   //   linebar: highchartsMap.WHighLineBar,
//   //   map: g2Map.WG2Map,
//   //   custom: g2Map.WG2Custom
//   // },
//   G2: {
//     line: g2Map.WG2Line,
//     bar: g2Map.WG2Bar,
//     pie: g2Map.WG2Pie,
//     linebar: highchartsMap.WHighLineBar,
//     map: g2Map.WG2Map,
//     custom: g2Map.WG2Custom
//   }
// };
// export const Wline = chartMap[chartLibraryName].line;
// export const Wbar = chartMap[chartLibraryName].bar;
// export const Wpie = chartMap[chartLibraryName].pie;
// export const Wlinebar = chartMap[chartLibraryName].linebar;
// export const Wmap = chartMap[chartLibraryName].map;
// export const Wcustom = chartMap[chartLibraryName].custom;
var COLORS = exports.COLORS = _normal.color;

// 所有图表组件，这里底层依赖G2