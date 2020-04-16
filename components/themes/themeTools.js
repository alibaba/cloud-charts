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

export function setThemeStyle(css) {
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
export function convertKey(themes) {
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

export function convertCSS(theme) {
  const varList = Object.keys(theme).map(key => `--${key}: ${theme[key]}`);
  return `.aisc-widgets {${varList.join(';')}}`;
}

export function convertJsStyle(name, theme) {
  const result = {
    name,
    // 分类色阶
    category_12: [
      theme['widgets-color-category-1'],
      theme['widgets-color-category-2'],
      theme['widgets-color-category-3'],
      theme['widgets-color-category-4'],
      theme['widgets-color-category-5'],
      theme['widgets-color-category-6'],
      theme['widgets-color-category-7'],
      theme['widgets-color-category-8'],
      theme['widgets-color-category-9'],
      theme['widgets-color-category-10'],
      theme['widgets-color-category-11'],
      theme['widgets-color-category-12'],
    ],
    // 连续色阶，比较接近的颜色会错开
    linear_10: [
      theme['widgets-color-linear-1'],
      theme['widgets-color-linear-5'],
      theme['widgets-color-linear-9'],
      theme['widgets-color-linear-3'],
      theme['widgets-color-linear-7'],
      theme['widgets-color-linear-10'],
      theme['widgets-color-linear-2'],
      theme['widgets-color-linear-4'],
      theme['widgets-color-linear-6'],
      theme['widgets-color-linear-8'],
    ],
    // 顺序色阶，连续相似的颜色排列
    order_10: [
      theme['widgets-color-linear-1'],
      theme['widgets-color-linear-2'],
      theme['widgets-color-linear-3'],
      theme['widgets-color-linear-4'],
      theme['widgets-color-linear-5'],
      theme['widgets-color-linear-6'],
      theme['widgets-color-linear-7'],
      theme['widgets-color-linear-8'],
      theme['widgets-color-linear-9'],
      theme['widgets-color-linear-10'],
    ],
    // 青色色阶 - turquoise
    // 连续色阶，比较接近的颜色会错开
    linear_turquoise_10: [
      theme['widgets-color-linear-turquoise-1'],
      theme['widgets-color-linear-turquoise-5'],
      theme['widgets-color-linear-turquoise-9'],
      theme['widgets-color-linear-turquoise-3'],
      theme['widgets-color-linear-turquoise-7'],
      theme['widgets-color-linear-turquoise-10'],
      theme['widgets-color-linear-turquoise-2'],
      theme['widgets-color-linear-turquoise-4'],
      theme['widgets-color-linear-turquoise-6'],
      theme['widgets-color-linear-turquoise-8'],
    ],
    // 顺序色阶，连续相似的颜色排列
    order_turquoise_10: [
      theme['widgets-color-linear-turquoise-1'],
      theme['widgets-color-linear-turquoise-2'],
      theme['widgets-color-linear-turquoise-3'],
      theme['widgets-color-linear-turquoise-4'],
      theme['widgets-color-linear-turquoise-5'],
      theme['widgets-color-linear-turquoise-6'],
      theme['widgets-color-linear-turquoise-7'],
      theme['widgets-color-linear-turquoise-8'],
      theme['widgets-color-linear-turquoise-9'],
      theme['widgets-color-linear-turquoise-10'],
    ],
  };
  Object.assign(result, theme);

  return result;
}
