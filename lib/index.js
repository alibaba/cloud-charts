'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Wcustom = exports.Wmap = exports.Wlinebar = exports.Wpie = exports.Wbar = exports.Wline = exports.WHighLineBar = exports.WHighPie = exports.WHighBar = exports.WHighLine = exports.WG2Custom = exports.WG2Map = exports.WG2Pie = exports.WG2Bar = exports.WG2Line = exports.Wshoot = exports.Wminicontainer = exports.Wcircle = exports.Wminiline = exports.Wicon = exports.Wcontainer = exports.Wnumber = undefined;

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

var _g2Map = require('./g2Map');

var g2Map = _interopRequireWildcard(_g2Map);

var _highchartsMap = require('./highchartsMap');

var highchartsMap = _interopRequireWildcard(_highchartsMap);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.Wnumber = _index2.default;
exports.Wcontainer = _index4.default;
exports.Wicon = _index6.default;
exports.Wminiline = _index8.default;
exports.Wcircle = _index10.default;
exports.Wminicontainer = _index12.default;
exports.Wshoot = _index14.default;
var WG2Line = exports.WG2Line = g2Map.WG2Line;
var WG2Bar = exports.WG2Bar = g2Map.WG2Bar;
var WG2Pie = exports.WG2Pie = g2Map.WG2Pie;
var WG2Map = exports.WG2Map = g2Map.WG2Map;
var WG2Custom = exports.WG2Custom = g2Map.WG2Custom;

var WHighLine = exports.WHighLine = highchartsMap.WHighLine;
var WHighBar = exports.WHighBar = highchartsMap.WHighBar;
var WHighPie = exports.WHighPie = highchartsMap.WHighPie;
var WHighLineBar = exports.WHighLineBar = highchartsMap.WHighLineBar;

//根据设置的library名字暴露默认的图表组件
var chartLibraryName = 'Highcharts';
var chartMap = {
  Highcharts: {
    line: highchartsMap.WHighLine,
    bar: highchartsMap.WHighBar,
    pie: highchartsMap.WHighPie,
    linebar: highchartsMap.WHighLineBar,
    map: g2Map.WG2Map,
    custom: g2Map.WG2Custom
  },
  G2: {
    line: g2Map.WG2Line,
    bar: g2Map.WG2Bar,
    pie: g2Map.WG2Pie,
    linebar: highchartsMap.WHighLineBar,
    map: g2Map.WG2Map,
    custom: g2Map.WG2Custom
  }
};
var Wline = exports.Wline = chartMap[chartLibraryName].line;
var Wbar = exports.Wbar = chartMap[chartLibraryName].bar;
var Wpie = exports.Wpie = chartMap[chartLibraryName].pie;
var Wlinebar = exports.Wlinebar = chartMap[chartLibraryName].linebar;
var Wmap = exports.Wmap = chartMap[chartLibraryName].map;
var Wcustom = exports.Wcustom = chartMap[chartLibraryName].custom;