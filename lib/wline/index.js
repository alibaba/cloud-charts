'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WHighLine = exports.WG2Line = undefined;

var _highFactory = require('../chartCommon/highFactory');

var _highFactory2 = _interopRequireDefault(_highFactory);

var _g2Factory = require('../chartCommon/g2Factory');

var _g2Factory2 = _interopRequireDefault(_g2Factory);

var _HighLine = require('./HighLine');

var _HighLine2 = _interopRequireDefault(_HighLine);

var _G2Line = require('./G2Line');

var _G2Line2 = _interopRequireDefault(_G2Line);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var WG2Line = (0, _g2Factory2.default)('G2Line', _G2Line2.default);
var WHighLine = (0, _highFactory2.default)('HighLine', _HighLine2.default);

exports.WG2Line = WG2Line;
exports.WHighLine = WHighLine;