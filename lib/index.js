'use strict';

exports.__esModule = true;
exports.track = exports.COLORS = exports.Wdashboard = exports.Wcount = exports.Wperline = exports.Wplaceholder = exports.Wshoot = exports.Wminicontainer = exports.Wcircle = exports.Wicon = exports.Wcontainer = exports.Wnumber = exports.VERSION = exports.version = undefined;

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

require('./index.scss');

var _index2 = require('./wnumber/index');

var _index3 = _interopRequireDefault(_index2);

var _index4 = require('./wcontainer/index');

var _index5 = _interopRequireDefault(_index4);

var _index6 = require('./wicon/index');

var _index7 = _interopRequireDefault(_index6);

var _index8 = require('./wcircle/index');

var _index9 = _interopRequireDefault(_index8);

var _index10 = require('./wminicontainer/index');

var _index11 = _interopRequireDefault(_index10);

var _index12 = require('./wshoot/index');

var _index13 = _interopRequireDefault(_index12);

var _index14 = require('./wplaceholder/index');

var _index15 = _interopRequireDefault(_index14);

var _index16 = require('./wperline/index');

var _index17 = _interopRequireDefault(_index16);

var _index18 = require('./wcount/index');

var _index19 = _interopRequireDefault(_index18);

var _index20 = require('./wdashboard/index');

var _index21 = _interopRequireDefault(_index20);

var _track2 = require('./track');

var _track3 = _interopRequireDefault(_track2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var version = exports.version = __VERSION__;
var VERSION = exports.VERSION = __VERSION__;

// 业务组件，没有依赖其它图表库
exports.Wnumber = _index3.default;
exports.Wcontainer = _index5.default;
exports.Wicon = _index7.default;
exports.Wcircle = _index9.default;
exports.Wminicontainer = _index11.default;
exports.Wshoot = _index13.default;
exports.Wplaceholder = _index15.default;
exports.Wperline = _index17.default;
exports.Wcount = _index19.default;
exports.Wdashboard = _index21.default;

// 暴露颜色值

var COLORS = exports.COLORS = _index.color;

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