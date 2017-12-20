'use strict';

// import highFactory from '../chartCommon/highFactory';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WG2Map = undefined;

var _g2Factory = require('../chartCommon/g2Factory');

var _g2Factory2 = _interopRequireDefault(_g2Factory);

var _G2Map = require('./G2Map');

var _G2Map2 = _interopRequireDefault(_G2Map);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var WG2Map = (0, _g2Factory2.default)('G2Map', _G2Map2.default, false);
// const WHighLine = highFactory('HighLine', HighLine);

// import HighLine from './HighLine';
exports.WG2Map = WG2Map;