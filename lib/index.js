'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WPieG2 = exports.Wpie = exports.WBarG2 = exports.Wbar = exports.WLineG2 = exports.Wline = exports.Wminiline = exports.Wicon = exports.Wcontainer = exports.Wnumber = undefined;

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

exports.Wline = _index9.WHighLine;
exports.WLineG2 = _index9.WG2Line;
exports.Wbar = _index10.WHighBar;
exports.WBarG2 = _index10.WG2Bar;
exports.Wpie = _index11.WHighPie;
exports.WPieG2 = _index11.WG2Pie;

// let chartLibrary = 'G2';