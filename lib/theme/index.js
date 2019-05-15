'use strict';

exports.__esModule = true;

var _normal = require('./normal');

var _normal2 = _interopRequireDefault(_normal);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// 横杠连接符转为小驼峰
Object.keys(_normal2.default).forEach(function (key) {
  if (key.indexOf('-') > -1) {
    var newKey = key.replace(/-(\w)/g, function (all, letter) {
      return letter.toUpperCase();
    });
    if (!_normal2.default[newKey]) {
      _normal2.default[newKey] = _normal2.default[key];
    }
  }
});

exports.default = _normal2.default;
module.exports = exports['default'];