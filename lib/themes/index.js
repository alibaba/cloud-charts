"use strict";

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

// [theme].style 文件根据 [theme].scss 自动生成，请勿直接修改


exports.getTheme = getTheme;
exports.setTheme = setTheme;

var _g = require("@antv/g2");

var _g2 = _interopRequireDefault(_g);

var _eventBus = require("../common/eventBus");

var _eventBus2 = _interopRequireDefault(_eventBus);

var _g2Theme = require("../common/g2Theme");

var _g2Theme2 = _interopRequireDefault(_g2Theme);

var _themeTools = require("./themeTools");

var _normal = require("./normal.style");

var _normal2 = _interopRequireDefault(_normal);

var _dark = require("./dark.style");

var _dark2 = _interopRequireDefault(_dark);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var themeMap = {
  normal: {
    js: (0, _themeTools.convertKey)((0, _themeTools.convertJsStyle)('normal', _normal2.default)),
    css: (0, _themeTools.convertCSS)(_normal2.default),
    rawCSS: _normal2.default
  },
  dark: {
    js: (0, _themeTools.convertKey)((0, _themeTools.convertJsStyle)('dark', _dark2.default)),
    css: (0, _themeTools.convertCSS)(_dark2.default),
    rawCSS: _dark2.default
  }
};
// alias index as normal
themeMap.index = themeMap.normal;

// 默认主题包
if (process.env.NODE_ENV === 'production') {
  themeMap.default = themeMap["normal"];
} else {
  themeMap.default = themeMap.normal;
}

var themes = {};
var currentThemeName = '';

function getTheme(name) {
  if (!name) {
    return themes;
  } else if (themeMap[name]) {
    return themeMap[name].js;
  }
}

function setTheme() {
  var theme = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'default';
  var refreshChart = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

  if (typeof theme === 'string' && themeMap[theme] && theme === currentThemeName) {
    return;
  }
  var newTheme = {};
  if (_g2.default.Util.isObject(theme)) {
    // 传入对象，直接覆盖对应的key和css
    newTheme = (0, _themeTools.convertKey)(theme);

    // TODO 多次传入对象，css 每次都会在 current 的基础上直接处理，而不会集成前一次的结果。需要改进。
    var newCSS = _extends({}, themeMap[currentThemeName].rawCSS, theme);
    (0, _themeTools.setThemeStyle)((0, _themeTools.convertCSS)(newCSS));
  } else if (themeMap[theme]) {
    // 传入字符串名字，设置对应主题包
    newTheme = themeMap[theme].js;
    currentThemeName = theme;

    (0, _themeTools.setThemeStyle)(themeMap[theme].css);
  } else {
    return;
  }
  _g2.default.Util.deepMix(themes, newTheme);

  (0, _g2Theme2.default)(themes);

  if (refreshChart) {
    _eventBus2.default.emitEvent('setTheme');
  }
}

setTheme('default', false);

themes.getTheme = getTheme;
themes.setTheme = setTheme;

exports.default = themes;