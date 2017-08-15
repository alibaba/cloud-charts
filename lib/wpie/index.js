'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WHighPie = undefined;

var _highFactory = require('../chartCommon/highFactory');

var _highFactory2 = _interopRequireDefault(_highFactory);

var _HighPie = require('./HighPie');

var _HighPie2 = _interopRequireDefault(_HighPie);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import G2Pie from './G2Pie';

// const WG2Pie = g2Factory('G2Pie', G2Pie);
var WHighPie = (0, _highFactory2.default)('HighPie', _HighPie2.default);
// import g2Factory from '../chartCommon/g2Factory';
exports.WHighPie = WHighPie;