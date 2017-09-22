'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Wlinebar = exports.Wpie = exports.Wbar = exports.Wline = exports.Highcharts = exports.WHighLineBar = exports.WHighPie = exports.WHighBar = exports.WHighLine = undefined;

var _highcharts = require('highcharts');

var _highcharts2 = _interopRequireDefault(_highcharts);

var _highFactory = require('./chartCommon/highFactory');

var _highFactory2 = _interopRequireDefault(_highFactory);

var _HighLine = require('./wline/HighLine');

var _HighLine2 = _interopRequireDefault(_HighLine);

var _HighBar = require('./wbar/HighBar');

var _HighBar2 = _interopRequireDefault(_HighBar);

var _HighPie = require('./wpie/HighPie');

var _HighPie2 = _interopRequireDefault(_HighPie);

var _HighLineBar = require('./wlinebar/HighLineBar');

var _HighLineBar2 = _interopRequireDefault(_HighLineBar);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//暴露所有基础图表
var WHighLine = exports.WHighLine = (0, _highFactory2.default)('HighLine', _HighLine2.default);
var WHighBar = exports.WHighBar = (0, _highFactory2.default)('HighBar', _HighBar2.default);
var WHighPie = exports.WHighPie = (0, _highFactory2.default)('HighPie', _HighPie2.default);
var WHighLineBar = exports.WHighLineBar = (0, _highFactory2.default)('HighLineBar', _HighLineBar2.default);

//暴露基础图表库
exports.Highcharts = _highcharts2.default;
var Wline = exports.Wline = WHighLine;
var Wbar = exports.Wbar = WHighBar;
var Wpie = exports.Wpie = WHighPie;
var Wlinebar = exports.Wlinebar = WHighLineBar;