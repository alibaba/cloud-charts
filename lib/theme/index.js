'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.getTheme = getTheme;
exports.setTheme = setTheme;

var _g = require('@antv/g2');

var _g2 = _interopRequireDefault(_g);

var _eventBus = require('../common/eventBus');

var _eventBus2 = _interopRequireDefault(_eventBus);

var _normal = require('./normal');

var _normal2 = _interopRequireDefault(_normal);

var _dark = require('./dark');

var _dark2 = _interopRequireDefault(_dark);

var _aone = require('./aone');

var _aone2 = _interopRequireDefault(_aone);

var _aliyun = require('./aliyun');

var _aliyun2 = _interopRequireDefault(_aliyun);

var _aliyunDark = require('./aliyun-dark');

var _aliyunDark2 = _interopRequireDefault(_aliyunDark);

var _g2Theme = require('../common/g2Theme');

var _g2Theme2 = _interopRequireDefault(_g2Theme);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var normalStyle = require('sass-extract-loader?{"plugins":[{ plugin: "sass-extract-js", options: { camelCase: false } }]}!./normal.scss');
var darkStyle = require('sass-extract-loader?{"plugins":[{ plugin: "sass-extract-js", options: { camelCase: false } }]}!./dark.scss');
var aoneStyle = require('sass-extract-loader?{"plugins":[{ plugin: "sass-extract-js", options: { camelCase: false } }]}!./aone.scss');
var aliyunStyle = require('sass-extract-loader?{"plugins":[{ plugin: "sass-extract-js", options: { camelCase: false } }]}!./aliyun.scss');
var aliyunDarkStyle = require('sass-extract-loader?{"plugins":[{ plugin: "sass-extract-js", options: { camelCase: false } }]}!./aliyun-dark.scss');

var widgetsThemeStyleId = 'widgets-theme-var';

function getStyleElement() {
  var el = document.getElementById(widgetsThemeStyleId);
  if (!el) {
    el = document.createElement('style');
    el.setAttribute('id', widgetsThemeStyleId);
    document.head.appendChild(el);
  }
  return el;
}

function setThemeStyle(css) {
  var style = getStyleElement();
  style.innerText = css;
}

/**
 * 将主题包中横杠连接符变量克隆转为小驼峰写法
 *
 * @param {Object} themes 主题包
 *
 * @return {Object} themes
 * */
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

function convertCSS(theme) {
  var varList = Object.keys(theme).map(function (key) {
    return '--' + key + ': ' + theme[key];
  });
  return '.aisc-widgets {' + varList.join(';') + '}';
}

var themeMap = {
  normal: {
    js: convertKey(_normal2.default),
    css: convertCSS(normalStyle),
    rawCSS: normalStyle
  },
  dark: {
    js: convertKey(_dark2.default),
    css: convertCSS(darkStyle),
    rawCSS: darkStyle
  },
  aone: {
    js: convertKey(_aone2.default),
    css: convertCSS(aoneStyle),
    rawCSS: aoneStyle
  },
  aliyun: {
    js: convertKey(_aliyun2.default),
    css: convertCSS(aliyunStyle),
    rawCSS: aliyunStyle
  },
  'aliyun-dark': {
    js: convertKey(_aliyunDark2.default),
    css: convertCSS(aliyunDarkStyle),
    rawCSS: aliyunDarkStyle
  }
};
// alias index as normal
themeMap.index = themeMap.normal;

// 默认主题包
themeMap.default = themeMap[__THEME__];

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
    newTheme = convertKey(theme);

    // TODO 多次传入对象，css 每次都会在 current 的基础上直接处理，而不会集成前一次的结果。需要改进。
    var newCSS = _extends({}, themeMap[currentThemeName].rawCSS, theme);
    setThemeStyle(convertCSS(newCSS));
  } else if (themeMap[theme]) {
    // 传入字符串名字，设置对应主题包
    newTheme = themeMap[theme].js;
    currentThemeName = theme;

    setThemeStyle(themeMap[theme].css);
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

exports.default = themes;