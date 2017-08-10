'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _highFactory = require('../chartCommon/highFactory');

var _highFactory2 = _interopRequireDefault(_highFactory);

var _MiniLine = require('./MiniLine');

var _MiniLine2 = _interopRequireDefault(_MiniLine);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = (0, _highFactory2.default)('MiniLine', _MiniLine2.default);
module.exports = exports['default'];