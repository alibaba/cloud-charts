'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Wlinebar = exports.Wpie = exports.Wbar = exports.Wline = exports.WHighLineBar = exports.WHighPie = exports.WHighBar = exports.WHighLine = exports.Highcharts = undefined;

require('./index.scss');

var _highcharts = require('highcharts');

var _highcharts2 = _interopRequireDefault(_highcharts);

var _index = require('./wline/index');

var _index2 = require('./wbar/index');

var _index3 = require('./wpie/index');

var _index4 = require('./wlinebar/index');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//暴露基础图表库


//基础图表
exports.Highcharts = _highcharts2.default;

//暴露所有包含的基础图表

exports.WHighLine = _index.WHighLine;
exports.WHighBar = _index2.WHighBar;
exports.WHighPie = _index3.WHighPie;
exports.WHighLineBar = _index4.WHighLineBar;
var Wline = exports.Wline = _index.WHighLine;
var Wbar = exports.Wbar = _index2.WHighBar;
var Wpie = exports.Wpie = _index3.WHighPie;
var Wlinebar = exports.Wlinebar = _index4.WHighLineBar;