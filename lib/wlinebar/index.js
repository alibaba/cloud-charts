'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WHighLineBar = undefined;

var _highFactory = require('../chartCommon/highFactory');

var _highFactory2 = _interopRequireDefault(_highFactory);

var _HighLineBar = require('./HighLineBar');

var _HighLineBar2 = _interopRequireDefault(_HighLineBar);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import G2Line from './G2Line';

// const WG2Line = g2Factory('G2Line', G2Line);
var WHighLineBar = (0, _highFactory2.default)('HighLineBar', _HighLineBar2.default);
// import g2Factory from '../chartCommon/g2Factory';
exports.WHighLineBar = WHighLineBar;