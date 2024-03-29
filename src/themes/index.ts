import eventBus from "../common/eventBus";
import { FullThemeEventName, FullThemeName, THEME } from '../constants';
import { themeLog } from "../common/log";
import {
  setThemeStyle,
  convertKey,
  convertCSS,
  convertJsStyle,
  setG2Theme,
  Theme,
} from './themeTools';

// [theme].style 文件根据 [theme].scss 自动生成，请勿直接修改
import normalStyle from './normal.style';
import darkStyle from './dark.style';

interface ThemesMap {
  [themeName: string]: {
    js: Theme;
    css: string;
    rawCSS: Theme;
  };
}

// 记录所有主题
const themeMap: ThemesMap = {
  normal: {
    js: convertKey(convertJsStyle('normal', normalStyle)),
    css: convertCSS(normalStyle),
    rawCSS: normalStyle,
  },
  dark: {
    js: convertKey(convertJsStyle('dark', darkStyle)),
    css: convertCSS(darkStyle),
    rawCSS: darkStyle,
  },
};
// alias index as normal
themeMap.index = themeMap.normal;

const normalMap = { index: true, normal: true };

// 默认主题包
const defaultTheme = process.env.NODE_ENV === 'production' ? THEME : 'normal';

export interface Themes extends Theme {
  getTheme: typeof getTheme;
  setTheme: typeof setTheme;
}

/** 当前图表库主题包 */
const themes: Themes = {
  getTheme,
  setTheme,
};
let currentThemeName = '';
let currentRawCss = {};

export function getTheme(name?: string) {
  if (!name) {
    return themes;
  } else if (themeMap[name]) {
    return themeMap[name].js;
  }
  return undefined;
}

export function convertThemeKey(theme: string | Theme = defaultTheme) {
  let newTheme: Theme = {};
  if (typeof theme === 'string' && themeMap[theme]) {
    newTheme = themeMap[theme].js;
    setThemeStyle(themeMap[theme].css);

  } else if (typeof theme === 'object') {
    newTheme = convertKey(theme);

    const newCSS = Object.assign({}, currentRawCss, theme);
    setThemeStyle(convertCSS(newCSS));
  }

  return Object.assign(themes, newTheme);
}

export function setTheme(theme: string | Theme = defaultTheme, refreshChart: boolean = true) {
  if (typeof theme === 'string' && themeMap[theme] && (theme === currentThemeName || (theme in normalMap && currentThemeName in normalMap))) {
    return;
  }
  let newTheme: Theme = convertThemeKey(theme);
  if (typeof theme === 'string' && themeMap[theme]) {
    // 传入字符串名字，设置对应主题包
    // newTheme = convertThemeKey(theme);
    currentThemeName = theme;
    // setThemeStyle(themeMap[theme].css);
    currentRawCss = themeMap[theme].rawCSS;
    // 打点
    themeLog(theme);
  } else if (typeof theme === 'object') {
    // 传入对象，直接覆盖对应的key和css
    // newTheme = convertThemeKey(theme);

    // // 多次传入对象，css 会在 currentRawCss 的基础上处理
    // const newCSS = Object.assign({}, currentRawCss, theme);
    // setThemeStyle(convertCSS(newCSS));
    // 打点
    themeLog(newTheme.name || 'customTheme');
  } else {
    return;
  }

  // Object.assign(themes, newTheme)

  setG2Theme(newTheme as Theme);

  if (refreshChart) {
    // TODO 优化重新渲染逻辑
    eventBus.emit('setTheme');
  }
}

setTheme(defaultTheme, false);

if (window[FullThemeName]) {
  setTheme(window[FullThemeName], false);
}

// 根据事件设置图表主题
document.addEventListener(FullThemeEventName, function (e: CustomEvent) {
  if (e.detail) {
    setTheme(e.detail);
  }
});

// themes.getTheme = getTheme;
// themes.setTheme = setTheme;

export default themes;
