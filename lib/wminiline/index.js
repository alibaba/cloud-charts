'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _chartFactory = require('../chartCommon/chartFactory');

var _chartFactory2 = _interopRequireDefault(_chartFactory);

var _MiniLine = require('./MiniLine');

var _MiniLine2 = _interopRequireDefault(_MiniLine);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = (0, _chartFactory2.default)('MiniLine', _MiniLine2.default);
module.exports = exports['default'];