'use strict';

exports.__esModule = true;
exports.setTheme = setTheme;

var _g = require('@antv/g2');

var _g2 = _interopRequireDefault(_g);

var _normal = require('./normal');

var _normal2 = _interopRequireDefault(_normal);

var _g2Theme = require('../common/g2Theme');

var _g2Theme2 = _interopRequireDefault(_g2Theme);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// 横杠连接符转为小驼峰
function convertKey(themes) {
  Object.keys(themes).forEach(function (key) {
    if (key.indexOf('-') > -1) {
      var newKey = key.replace(/-(\w)/g, function (all, letter) {
        return letter.toUpperCase();
      });
      if (!themes[newKey]) {
        themes[newKey] = themes[key];
      }
    }
  });
  return themes;
}
// import dark from './dark';
// import aone from './aone';
// import aliyun from './aliyun';
// import aliyunDark from './aliyun-dark';


var themeMap = {
  normal: convertKey(_normal2.default)
  // dark: convertKey(dark),
  // aone: convertKey(aone),
  // aliyun: convertKey(aliyun),
  // aliyunDark: convertKey(aliyunDark),
};
// 默认为亮色主题包
themeMap.default = themeMap.normal;

var themes = {};
var currentTheme = '';

function setTheme() {
  var theme = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'default';

  if (typeof theme === 'string' && themeMap[theme] && theme === currentTheme) {
    console.log('重复设置主题');
    return;
  }
  var newTheme = {};
  if (_g2.default.Util.isObject(theme)) {
    newTheme = theme;
  } else if (themeMap[theme]) {
    newTheme = themeMap[theme];
    currentTheme = theme;
  }
  _g2.default.Util.deepMix(themes, newTheme);

  (0, _g2Theme2.default)(themes);
}

setTheme();

exports.default = themes;