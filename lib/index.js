'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.g2Map = exports.Wshoot = exports.Wminicontainer = exports.Wcircle = exports.Wminiline = exports.Wicon = exports.Wcontainer = exports.Wnumber = undefined;

require('./index.scss');

var _index = require('./wnumber/index');

var _index2 = _interopRequireDefault(_index);

var _index3 = require('./wcontainer/index');

var _index4 = _interopRequireDefault(_index3);

var _index5 = require('./wicon/index');

var _index6 = _interopRequireDefault(_index5);

var _index7 = require('./wminiline/index');

var _index8 = _interopRequireDefault(_index7);

var _index9 = require('./wcircle/index');

var _index10 = _interopRequireDefault(_index9);

var _index11 = require('./wminicontainer/index');

var _index12 = _interopRequireDefault(_index11);

var _index13 = require('./wshoot/index');

var _index14 = _interopRequireDefault(_index13);

var _g2Map2 = require('./g2Map');

var _g2Map = _interopRequireWildcard(_g2Map2);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.Wnumber = _index2.default;
exports.Wcontainer = _index4.default;
exports.Wicon = _index6.default;
exports.Wminiline = _index8.default;
exports.Wcircle = _index10.default;
exports.Wminicontainer = _index12.default;
exports.Wshoot = _index14.default;
exports.g2Map = _g2Map;
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