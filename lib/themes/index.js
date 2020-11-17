"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.getTheme = getTheme;
exports.setTheme = setTheme;
exports["default"] = void 0;

var _eventBus = _interopRequireDefault(require("../common/eventBus"));

var _constants = require("../constants");

var _log = require("../common/log");

var _themeTools = require("./themeTools");

var _normal = _interopRequireDefault(require("./normal.style"));

var _dark = _interopRequireDefault(require("./dark.style"));

// import G2 from '@antv/g2';
// import setG2Theme from "../common/g2Theme";
// [theme].style 文件根据 [theme].scss 自动生成，请勿直接修改
// 记录所有主题
var themeMap = {
  normal: {
    js: (0, _themeTools.convertKey)((0, _themeTools.convertJsStyle)('normal', _normal["default"])),
    css: (0, _themeTools.convertCSS)(_normal["default"]),
    rawCSS: _normal["default"]
  },
  dark: {
    js: (0, _themeTools.convertKey)((0, _themeTools.convertJsStyle)('dark', _dark["default"])),
    css: (0, _themeTools.convertCSS)(_dark["default"]),
    rawCSS: _dark["default"]
  }
}; // alias index as normal

themeMap.index = themeMap.normal; // 默认主题包

var defaultThemeName = process.env.NODE_ENV === 'production' ? _constants.THEME : 'normal';

/** 当前图表库主题包 */
var themes = {
  getTheme: getTheme,
  setTheme: setTheme
};
var currentThemeName = '';

function getTheme(name) {
  if (!name) {
    return themes;
  } else if (themeMap[name]) {
    return themeMap[name].js;
  }

  return undefined;
}

function setTheme(theme, refreshChart) {
  if (theme === void 0) {
    theme = defaultThemeName;
  }

  if (refreshChart === void 0) {
    refreshChart = true;
  }

  if (typeof theme === 'string' && themeMap[theme] && theme === currentThemeName) {
    return;
  }

  var newTheme = {};

  if (typeof theme === 'string' && themeMap[theme]) {
    // 传入字符串名字，设置对应主题包
    newTheme = themeMap[theme].js;
    currentThemeName = theme;
    (0, _themeTools.setThemeStyle)(themeMap[theme].css); // 打点

    (0, _log.themeLog)(theme);
  } else if (typeof theme === 'object') {
    // 传入对象，直接覆盖对应的key和css
    newTheme = (0, _themeTools.convertKey)(theme); // TODO 多次传入对象，css 每次都会在 current 的基础上直接处理，而不会集成前一次的结果。需要改进。

    var newCSS = Object.assign({}, themeMap[currentThemeName].rawCSS, theme);
    (0, _themeTools.setThemeStyle)((0, _themeTools.convertCSS)(newCSS)); // 打点

    (0, _log.themeLog)(newTheme.name || 'customTheme');
  } else {
    return;
  }

  Object.assign(themes, newTheme);
  (0, _themeTools.setG2Theme)(themes);

  if (refreshChart) {
    // TODO 优化重新渲染逻辑
    _eventBus["default"].emit('setTheme');
  }
}

setTheme(defaultThemeName, false); // themes.getTheme = getTheme;
// themes.setTheme = setTheme;

var _default = themes;
exports["default"] = _default;