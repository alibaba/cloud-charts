'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WHighLine = undefined;

var _highFactory = require('../chartCommon/highFactory');

var _highFactory2 = _interopRequireDefault(_highFactory);

var _HighLine = require('./HighLine');

var _HighLine2 = _interopRequireDefault(_HighLine);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import G2Line from './G2Line';

// const WG2Line = g2Factory('G2Line', G2Line);
var WHighLine = (0, _highFactory2.default)('HighLine', _HighLine2.default);
// import g2Factory from '../chartCommon/g2Factory';
exports.WHighLine = WHighLine;