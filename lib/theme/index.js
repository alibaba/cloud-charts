var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import G2 from '@antv/g2';
import eventBus from "../common/eventBus";

import normal from './normal';
import dark from './dark';
import aone from './aone';
import aliyun from './aliyun';
import aliyunDark from './aliyun-dark';
import setG2Theme from "../common/g2Theme";

// const normalStyle = require('sass-extract-loader?{"plugins":[{ plugin: "sass-extract-js", options: { camelCase: false } }]}!./normal.scss');
// const darkStyle = require('sass-extract-loader?{"plugins":[{ plugin: "sass-extract-js", options: { camelCase: false } }]}!./dark.scss');
// const aoneStyle = require('sass-extract-loader?{"plugins":[{ plugin: "sass-extract-js", options: { camelCase: false } }]}!./aone.scss');
// const aliyunStyle = require('sass-extract-loader?{"plugins":[{ plugin: "sass-extract-js", options: { camelCase: false } }]}!./aliyun.scss');
// const aliyunDarkStyle = require('sass-extract-loader?{"plugins":[{ plugin: "sass-extract-js", options: { camelCase: false } }]}!./aliyun-dark.scss');

// [theme].style 文件根据 [theme].scss 自动生成，请勿直接修改
import normalStyle from './normal.style';
import darkStyle from './dark.style';
import aoneStyle from './aone.style';
import aliyunStyle from './aliyun.style';
import aliyunDarkStyle from './aliyun-dark.style';

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
    js: convertKey(normal),
    css: convertCSS(normalStyle),
    rawCSS: normalStyle
  },
  dark: {
    js: convertKey(dark),
    css: convertCSS(darkStyle),
    rawCSS: darkStyle
  },
  aone: {
    js: convertKey(aone),
    css: convertCSS(aoneStyle),
    rawCSS: aoneStyle
  },
  aliyun: {
    js: convertKey(aliyun),
    css: convertCSS(aliyunStyle),
    rawCSS: aliyunStyle
  },
  'aliyun-dark': {
    js: convertKey(aliyunDark),
    css: convertCSS(aliyunDarkStyle),
    rawCSS: aliyunDarkStyle
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

export function getTheme(name) {
  if (!name) {
    return themes;
  } else if (themeMap[name]) {
    return themeMap[name].js;
  }
}

export function setTheme() {
  var theme = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'default';
  var refreshChart = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

  if (typeof theme === 'string' && themeMap[theme] && theme === currentThemeName) {
    return;
  }
  var newTheme = {};
  if (G2.Util.isObject(theme)) {
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
  G2.Util.deepMix(themes, newTheme);

  setG2Theme(themes);

  if (refreshChart) {
    eventBus.emitEvent('setTheme');
  }
}

setTheme('default', false);

export default themes;