// import G2 from '@antv/g2';
import eventBus from "../common/eventBus";
// import { themeLog } from "../common/log";
// import setG2Theme from "../common/g2Theme";
import { /*setThemeStyle,*/ convertKey, convertCSS, convertJsStyle } from './themeTools';

// [theme].style 文件1根据 [theme].scss 自动生成，请勿直接修改
import normalStyle from './normal.style';
import darkStyle from './dark.style';

type Theme = Partial<typeof normalStyle>;

const themeMap: {
  [themeName: string]: {
    js: Theme;
    css: string;
    rawCSS: Theme;
  };
} = {
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

// 默认主题包
if (process.env.NODE_ENV === 'production') {
  // @ts-ignore
  themeMap.default = themeMap[__THEME__];
} else {
  themeMap.default = themeMap.normal;
}

interface Themes extends Theme {
  getTheme: typeof getTheme;
  setTheme: typeof setTheme;
}

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

export function setTheme(theme: string | {} = 'default', refreshChart: boolean = true) {
  if (typeof theme === 'string' && themeMap[theme] && theme === currentThemeName) {
    return;
  }
  // let newTheme = {};
  // if (G2.Util.isObject(theme)) {
  //   // 传入对象，直接覆盖对应的key和css
  //   newTheme = convertKey(theme);
  //
  //   // TODO 多次传入对象，css 每次都会在 current 的基础上直接处理，而不会集成前一次的结果。需要改进。
  //   const newCSS = Object.assign({}, themeMap[currentThemeName].rawCSS, theme);
  //   setThemeStyle(convertCSS(newCSS));
  //   // 打点
  //   themeLog('customTheme');
  // } else if (themeMap[theme]) {
  //   // 传入字符串名字，设置对应主题包
  //   newTheme = themeMap[theme].js;
  //   currentThemeName = theme;
  //
  //   setThemeStyle(themeMap[theme].css);
  //   // 打点
  //   themeLog(theme === 'default' ? 'index' : theme);
  // } else {
  //   return;
  // }
  // TODO 暂时不设置主题
  // G2.Util.deepMix(themes, newTheme);
  //
  // setG2Theme(themes);

  if (refreshChart) {
    eventBus.emitEvent('setTheme');
  }
}

setTheme('default', false);

// themes.getTheme = getTheme;
// themes.setTheme = setTheme;

export default themes;
