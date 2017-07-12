'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _chartFactory = require('../chartCommon/chartFactory');

var _chartFactory2 = _interopRequireDefault(_chartFactory);

var _Line = require('./Line');

var _Line2 = _interopRequireDefault(_Line);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = (0, _chartFactory2.default)('Line', _Line2.default);
module.exports = exports['default'];