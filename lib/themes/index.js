var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import G2 from '@antv/g2';
import eventBus from "../common/eventBus";
import setG2Theme from "../common/g2Theme";
import { setThemeStyle, convertKey, convertCSS, convertJsStyle } from './themeTools';

// [theme].style 文件根据 [theme].scss 自动生成，请勿直接修改
import normalStyle from './normal.style';
import darkStyle from './dark.style';
import aoneStyle from './aone.style';
import aliyunStyle from './aliyun.style';
import aliyunDarkStyle from './aliyun-dark.style';

var themeMap = {
  normal: {
    js: convertKey(convertJsStyle('normal', normalStyle)),
    css: convertCSS(normalStyle),
    rawCSS: normalStyle
  },
  dark: {
    js: convertKey(convertJsStyle('dark', darkStyle)),
    css: convertCSS(darkStyle),
    rawCSS: darkStyle
  },
  aone: {
    js: convertKey(convertJsStyle('aone', aoneStyle)),
    css: convertCSS(aoneStyle),
    rawCSS: aoneStyle
  },
  aliyun: {
    js: convertKey(convertJsStyle('aliyun', aliyunStyle)),
    css: convertCSS(aliyunStyle),
    rawCSS: aliyunStyle
  },
  'aliyun-dark': {
    js: convertKey(convertJsStyle('aliyun-dark', aliyunDarkStyle)),
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

themes.getTheme = getTheme;
themes.setTheme = setTheme;

export default themes;