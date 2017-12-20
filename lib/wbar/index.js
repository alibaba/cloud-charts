'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WG2Bar = exports.WHighBar = undefined;

var _highFactory = require('../chartCommon/highFactory');

var _highFactory2 = _interopRequireDefault(_highFactory);

var _g2Factory = require('../chartCommon/g2Factory');

var _g2Factory2 = _interopRequireDefault(_g2Factory);

var _HighBar = require('./HighBar');

var _HighBar2 = _interopRequireDefault(_HighBar);

var _G2Bar = require('./G2Bar');

var _G2Bar2 = _interopRequireDefault(_G2Bar);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var WG2Bar = (0, _g2Factory2.default)('G2Bar', _G2Bar2.default);
var WHighBar = (0, _highFactory2.default)('HighBar', _HighBar2.default);

exports.WHighBar = WHighBar;
exports.WG2Bar = WG2Bar;