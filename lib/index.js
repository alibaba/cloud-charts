'use strict';

exports.__esModule = true;
exports.track = exports.THEMES = exports.COLORS = exports.Wdashboard = exports.Wcount = exports.Wperline = exports.Wplaceholder = exports.Wshoot = exports.Wminicontainer = exports.Wcircle = exports.Wicon = exports.Wcontainer = exports.Wnumber = exports.VERSION = exports.version = undefined;

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

var _index = require('./theme/index');

var _index2 = _interopRequireDefault(_index);

require('./index.scss');

var _index3 = require('./wnumber/index');

var _index4 = _interopRequireDefault(_index3);

var _index5 = require('./wcontainer/index');

var _index6 = _interopRequireDefault(_index5);

var _index7 = require('./wicon/index');

var _index8 = _interopRequireDefault(_index7);

var _index9 = require('./wcircle/index');

var _index10 = _interopRequireDefault(_index9);

var _index11 = require('./wminicontainer/index');

var _index12 = _interopRequireDefault(_index11);

var _index13 = require('./wshoot/index');

var _index14 = _interopRequireDefault(_index13);

var _index15 = require('./wplaceholder/index');

var _index16 = _interopRequireDefault(_index15);

var _index17 = require('./wperline/index');

var _index18 = _interopRequireDefault(_index17);

var _index19 = require('./wcount/index');

var _index20 = _interopRequireDefault(_index19);

var _index21 = require('./wdashboard/index');

var _index22 = _interopRequireDefault(_index21);

var _track2 = require('./track');

var _track3 = _interopRequireDefault(_track2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var version = exports.version = __VERSION__;
var VERSION = exports.VERSION = __VERSION__;

// 业务组件，没有依赖其它图表库
exports.Wnumber = _index4.default;
exports.Wcontainer = _index6.default;
exports.Wicon = _index8.default;
exports.Wcircle = _index10.default;
exports.Wminicontainer = _index12.default;
exports.Wshoot = _index14.default;
exports.Wplaceholder = _index16.default;
exports.Wperline = _index18.default;
exports.Wcount = _index20.default;
exports.Wdashboard = _index22.default;

// 暴露颜色值

var COLORS = exports.COLORS = _index2.default;
var THEMES = exports.THEMES = _index2.default;

// 暴露所有图表组件、底层依赖的G2、工具类


// 打点控制
exports.track = _track3.default;
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