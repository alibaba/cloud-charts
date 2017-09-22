'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Wcustom = exports.Wmap = exports.Wpie = exports.Wbar = exports.Wline = exports.G2 = exports.WG2Custom = exports.WG2Map = exports.WG2Pie = exports.WG2Bar = exports.WG2Line = undefined;

var _g = require('g2');

var _g2 = _interopRequireDefault(_g);

var _g2Factory = require('./chartCommon/g2Factory');

var _g2Factory2 = _interopRequireDefault(_g2Factory);

var _G2Line = require('./wline/G2Line');

var _G2Line2 = _interopRequireDefault(_G2Line);

var _G2Bar = require('./wbar/G2Bar');

var _G2Bar2 = _interopRequireDefault(_G2Bar);

var _G2Pie = require('./wpie/G2Pie');

var _G2Pie2 = _interopRequireDefault(_G2Pie);

var _G2Map = require('./wmap/G2Map');

var _G2Map2 = _interopRequireDefault(_G2Map);

var _G2Custom = require('./wcustom/G2Custom');

var _G2Custom2 = _interopRequireDefault(_G2Custom);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//暴露所有基础图表
var WG2Line = exports.WG2Line = (0, _g2Factory2.default)('G2Line', _G2Line2.default);
var WG2Bar = exports.WG2Bar = (0, _g2Factory2.default)('G2Bar', _G2Bar2.default);
var WG2Pie = exports.WG2Pie = (0, _g2Factory2.default)('G2Pie', _G2Pie2.default);
var WG2Map = exports.WG2Map = (0, _g2Factory2.default)('G2Map', _G2Map2.default, false);
var WG2Custom = exports.WG2Custom = (0, _g2Factory2.default)('G2Custom', _G2Custom2.default);

//暴露基础图表库
exports.G2 = _g2.default;
var Wline = exports.Wline = WG2Line;
var Wbar = exports.Wbar = WG2Bar;
var Wpie = exports.Wpie = WG2Pie;
var Wmap = exports.Wmap = WG2Map;
var Wcustom = exports.Wcustom = WG2Custom;