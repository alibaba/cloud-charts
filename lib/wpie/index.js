'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _chartFactory = require('../chartCommon/chartFactory');

var _chartFactory2 = _interopRequireDefault(_chartFactory);

var _Pie = require('./Pie');

var _Pie2 = _interopRequireDefault(_Pie);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = (0, _chartFactory2.default)('Pie', _Pie2.default);
module.exports = exports['default'];