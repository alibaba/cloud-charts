'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WHighPie = exports.WG2Pie = undefined;

var _highFactory = require('../chartCommon/highFactory');

var _highFactory2 = _interopRequireDefault(_highFactory);

var _g2Factory = require('../chartCommon/g2Factory');

var _g2Factory2 = _interopRequireDefault(_g2Factory);

var _HighPie = require('./HighPie');

var _HighPie2 = _interopRequireDefault(_HighPie);

var _G2Pie = require('./G2Pie');

var _G2Pie2 = _interopRequireDefault(_G2Pie);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var WG2Pie = (0, _g2Factory2.default)('G2Pie', _G2Pie2.default);
var WHighPie = (0, _highFactory2.default)('HighPie', _HighPie2.default);

exports.WG2Pie = WG2Pie;
exports.WHighPie = WHighPie;