import G2 from '@antv/g2';
import eventBus from "../common/eventBus";

import normal from './normal';
import dark from './dark';
import aone from './aone';
import aliyun from './aliyun';
import aliyunDark from './aliyun-dark';
import setG2Theme from "../common/g2Theme";

const normalStyle = require('sass-extract-loader?{"plugins":[{ plugin: "sass-extract-js", options: { camelCase: false } }]}!./normal.scss');
const darkStyle = require('sass-extract-loader?{"plugins":[{ plugin: "sass-extract-js", options: { camelCase: false } }]}!./dark.scss');
const aoneStyle = require('sass-extract-loader?{"plugins":[{ plugin: "sass-extract-js", options: { camelCase: false } }]}!./aone.scss');
const aliyunStyle = require('sass-extract-loader?{"plugins":[{ plugin: "sass-extract-js", options: { camelCase: false } }]}!./aliyun.scss');
const aliyunDarkStyle = require('sass-extract-loader?{"plugins":[{ plugin: "sass-extract-js", options: { camelCase: false } }]}!./aliyun-dark.scss');

const widgetsThemeStyleId = 'widgets-theme-var';

function getStyleElement() {
  let el = document.getElementById(widgetsThemeStyleId);
  if (!el) {
    el = document.createElement('style');
    el.setAttribute('id', widgetsThemeStyleId);
    document.head.appendChild(el);
  }
  return el;
}

function setThemeStyle(css) {
  const style = getStyleElement();
  style.innerText = css;
}

// 横杠连接符转为小驼峰
function convertKey(themes) {
  Object.keys(themes).forEach((key) => {
    if (key.indexOf('-') > -1) {
      const newKey = key.replace(/-(\w)/g, (all, letter) => {
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
  const varList = Object.keys(theme).map(key => `--${key}: ${theme[key]}`);
  return `.aisc-widgets {${varList.join(';')}}`;
}

const themeMap = {
  normal: {
    js: convertKey(normal),
    css: convertCSS(normalStyle),
  },
  dark: {
    js: convertKey(dark),
    css: convertCSS(darkStyle),
  },
  aone: {
    js: convertKey(aone),
    css: convertCSS(aoneStyle),
  },
  aliyun: {
    js: convertKey(aliyun),
    css: convertCSS(aliyunStyle),
  },
  aliyunDark: {
    js: convertKey(aliyunDark),
    css: convertCSS(aliyunDarkStyle),
  },
};
// 默认为亮色主题包
themeMap.default = themeMap.normal;

const themes = {};
let currentTheme = '';

export function setTheme(theme = 'default', refreshChart = true) {
  if (typeof theme === 'string' && themeMap[theme] && theme === currentTheme) {
    console.log('重复设置主题');
    return;
  }
  let newTheme = {};
  if (G2.Util.isObject(theme)) {
    newTheme = theme;
  } else if (themeMap[theme]) {
    newTheme = themeMap[theme].js;
    currentTheme = theme;

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
