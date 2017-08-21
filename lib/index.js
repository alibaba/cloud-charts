'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Wpie = exports.Wbar = exports.Wline = exports.WHighPie = exports.WHighBar = exports.WHighLine = exports.Wminicontainer = exports.Wcircle = exports.Wminiline = exports.Wicon = exports.Wcontainer = exports.Wnumber = undefined;

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

var _index13 = require('./wline/index');

var _index14 = require('./wbar/index');

var _index15 = require('./wpie/index');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.Wnumber = _index2.default;
exports.Wcontainer = _index4.default;
exports.Wicon = _index6.default;
exports.Wminiline = _index8.default;
exports.Wcircle = _index10.default;
exports.Wminicontainer = _index12.default;

//基础图表

//暴露所有包含的基础图表
exports.WHighLine = _index13.WHighLine;
exports.WHighBar = _index14.WHighBar;
exports.WHighPie = _index15.WHighPie;


//根据设置的library名字暴露默认的图表组件
var chartLibraryName = 'Highcharts';
var chartMap = {
  Highcharts: {
    line: _index13.WHighLine,
    bar: _index14.WHighBar,
    pie: _index15.WHighPie
  }
  // G2: {
  //   line: WG2Line,
  //   bar: WG2Bar,
  //   pie: WG2Pie
  // }
};
var Wline = exports.Wline = chartMap[chartLibraryName].line;
var Wbar = exports.Wbar = chartMap[chartLibraryName].bar;
var Wpie = exports.Wpie = chartMap[chartLibraryName].pie;