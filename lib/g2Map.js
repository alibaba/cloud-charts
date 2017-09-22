'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Wcustom = exports.Wmap = exports.Wpie = exports.Wbar = exports.Wline = exports.WG2Custom = exports.WG2Map = exports.WG2Pie = exports.WG2Bar = exports.WG2Line = exports.G2 = undefined;

require('./index.scss');

var _g = require('g2');

var _g2 = _interopRequireDefault(_g);

var _index = require('./wline/index');

var _index2 = require('./wbar/index');

var _index3 = require('./wpie/index');

var _index4 = require('./wmap/index');

var _index5 = require('./wcustom/index');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//暴露基础图表库
exports.G2 = _g2.default;

//暴露所有包含的基础图表


//基础图表

exports.WG2Line = _index.WG2Line;
exports.WG2Bar = _index2.WG2Bar;
exports.WG2Pie = _index3.WG2Pie;
exports.WG2Map = _index4.WG2Map;
exports.WG2Custom = _index5.WG2Custom;
var Wline = exports.Wline = _index.WG2Line;
var Wbar = exports.Wbar = _index2.WG2Bar;
var Wpie = exports.Wpie = _index3.WG2Pie;
var Wmap = exports.Wmap = _index4.WG2Map;
var Wcustom = exports.Wcustom = _index5.WG2Custom;