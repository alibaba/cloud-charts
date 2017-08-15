'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WHighBar = undefined;

var _highFactory = require('../chartCommon/highFactory');

var _highFactory2 = _interopRequireDefault(_highFactory);

var _HighBar = require('./HighBar');

var _HighBar2 = _interopRequireDefault(_HighBar);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import G2Bar from './G2Bar';

// const WG2Bar = g2Factory('G2Bar', G2Bar);
var WHighBar = (0, _highFactory2.default)('HighBar', _HighBar2.default);
// import g2Factory from '../chartCommon/g2Factory';
exports.WHighBar = WHighBar;