import eventBus from "../common/eventBus";
import { FullThemeName, THEME } from '../constants';
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
import yunxiaoStyle from './yunxiao.style';

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
  yunxiao: {
    js: convertKey(convertJsStyle('yunxiao', yunxiaoStyle)),
    css: convertCSS(yunxiaoStyle),
    rawCSS: yunxiaoStyle,
  },
};
// alias index as normal
themeMap.index = themeMap.normal;

const normalMap = { index: true, normal: true };

// 默认主题包
const defaultThemeName = window[FullThemeName] || (process.env.NODE_ENV === 'production' ? THEME : 'normal');

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

export function getTheme(name?: string) {
  if (!name) {
    return themes;
  } else if (themeMap[name]) {
    return themeMap[name].js;
  }
  return undefined;
}

export function setTheme(theme: string | Theme = defaultThemeName, refreshChart: boolean = true) {
  if (typeof theme === 'string' && themeMap[theme] && (theme === currentThemeName || (theme in normalMap && currentThemeName in normalMap))) {
    return;
  }
  let newTheme: Theme = {};
  if (typeof theme === 'string' && themeMap[theme]) {
    // 传入字符串名字，设置对应主题包
    newTheme = themeMap[theme].js;
    currentThemeName = theme;
    setThemeStyle(themeMap[theme].css);
    // 打点
    themeLog(theme);
  } else if (typeof theme === 'object') {
    // 传入对象，直接覆盖对应的key和css
    newTheme = convertKey(theme);

    // TODO 多次传入对象，css 每次都会在 current 的基础上直接处理，而不会集成前一次的结果。需要改进。
    const newCSS = Object.assign({}, themeMap[currentThemeName].rawCSS, theme);
    setThemeStyle(convertCSS(newCSS));
    // 打点
    themeLog(newTheme.name || 'customTheme');
  } else {
    return;
  }

  Object.assign(themes, newTheme)

  setG2Theme(themes as Theme);

  if (refreshChart) {
    // TODO 优化重新渲染逻辑
    eventBus.emit('setTheme');
  }
}

setTheme(defaultThemeName, false);

// themes.getTheme = getTheme;
// themes.setTheme = setTheme;

export default themes;
