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

/**
 * 将主题包中横杠连接符变量克隆转为小驼峰写法
 *
 * @param {Object} themes 主题包
 *
 * @return {Object} themes
 * */
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
    rawCSS: normalStyle,
  },
  dark: {
    js: convertKey(dark),
    css: convertCSS(darkStyle),
    rawCSS: darkStyle,
  },
  aone: {
    js: convertKey(aone),
    css: convertCSS(aoneStyle),
    rawCSS: aoneStyle,
  },
  aliyun: {
    js: convertKey(aliyun),
    css: convertCSS(aliyunStyle),
    rawCSS: aliyunStyle,
  },
  'aliyun-dark': {
    js: convertKey(aliyunDark),
    css: convertCSS(aliyunDarkStyle),
    rawCSS: aliyunDarkStyle,
  },
};
// alias index as normal
themeMap.index = themeMap.normal;

// 默认主题包
themeMap.default = themeMap[__THEME__];

const themes = {};
let currentThemeName = '';

export function getTheme(name) {
  if (!name) {
    return themes;
  } else if (themeMap[name]) {
    return themeMap[name].js;
  }
}

export function setTheme(theme = 'default', refreshChart = true) {
  if (typeof theme === 'string' && themeMap[theme] && theme === currentThemeName) {
    return;
  }
  let newTheme = {};
  if (G2.Util.isObject(theme)) {
    // 传入对象，直接覆盖对应的key和css
    newTheme = convertKey(theme);

    // TODO 多次传入对象，css 每次都会在 current 的基础上直接处理，而不会集成前一次的结果。需要改进。
    const newCSS = Object.assign({}, themeMap[currentThemeName].rawCSS, theme);
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
