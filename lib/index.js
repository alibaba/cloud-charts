'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Wpie = exports.Wbar = exports.Wline = exports.WG2Pie = exports.WG2Bar = exports.WG2Line = exports.WHighPie = exports.WHighBar = exports.WHighLine = exports.Wminiline = exports.Wicon = exports.Wcontainer = exports.Wnumber = undefined;

require('./index.scss');

var _index = require('./wnumber/index');

var _index2 = _interopRequireDefault(_index);

var _index3 = require('./wcontainer/index');

var _index4 = _interopRequireDefault(_index3);

var _index5 = require('./wicon/index');

var _index6 = _interopRequireDefault(_index5);

var _index7 = require('./wminiline/index');

var _index8 = _interopRequireDefault(_index7);

var _index9 = require('./wline/index');

var _index10 = require('./wbar/index');

var _index11 = require('./wpie/index');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.Wnumber = _index2.default;
exports.Wcontainer = _index4.default;
exports.Wicon = _index6.default;
exports.Wminiline = _index8.default;

//基础图表

//暴露所有包含的基础图表
exports.WHighLine = _index9.WHighLine;
exports.WHighBar = _index10.WHighBar;
exports.WHighPie = _index11.WHighPie;
exports.WG2Line = _index9.WG2Line;
exports.WG2Bar = _index10.WG2Bar;
exports.WG2Pie = _index11.WG2Pie;

//根据设置的library名字暴露默认的图表组件

var chartLibraryName = 'Highcharts';
var chartMap = {
  Highcharts: {
    line: _index9.WHighLine,
    bar: _index10.WHighBar,
    pie: _index11.WHighPie
  },
  G2: {
    line: _index9.WG2Line,
    bar: _index10.WG2Bar,
    pie: _index11.WG2Pie
  }
};
var Wline = exports.Wline = chartMap[chartLibraryName].line;
var Wbar = exports.Wbar = chartMap[chartLibraryName].bar;
var Wpie = exports.Wpie = chartMap[chartLibraryName].pie;