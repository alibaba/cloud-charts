import G2 from '@antv/g2';

import normal from './normal';
import dark from './dark';
import aone from './aone';
import aliyun from './aliyun';
import aliyunDark from './aliyun-dark';
import setG2Theme from "../common/g2Theme";

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

const themeMap = {
  normal: convertKey(normal),
  dark: convertKey(dark),
  aone: convertKey(aone),
  aliyun: convertKey(aliyun),
  aliyunDark: convertKey(aliyunDark),
};
// 默认为亮色主题包
themeMap.default = themeMap.normal;

const themes = {};
let currentTheme = '';

export function setTheme(theme = 'default') {
  if (typeof theme === 'string' && themeMap[theme] && theme === currentTheme) {
    console.log('重复设置主题');
    return;
  }
  let newTheme = {};
  if (G2.Util.isObject(theme)) {
    newTheme = theme;
  } else if (themeMap[theme]) {
    newTheme = themeMap[theme];
    currentTheme = theme;
  }
  G2.Util.deepMix(themes, newTheme);

  setG2Theme(themes);
}

setTheme();

export default themes;
