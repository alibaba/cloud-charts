'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.setThemeStyle = setThemeStyle;
exports.convertKey = convertKey;
exports.convertCSS = convertCSS;
exports.convertJsStyle = convertJsStyle;
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
  return '.cloud-charts {' + varList.join(';') + '}';
}

function convertJsStyle(name, theme) {
  var result = {
    name: name,
    // 分类色阶
    category_12: [theme['widgets-color-category-1'], theme['widgets-color-category-2'], theme['widgets-color-category-3'], theme['widgets-color-category-4'], theme['widgets-color-category-5'], theme['widgets-color-category-6'], theme['widgets-color-category-7'], theme['widgets-color-category-8'], theme['widgets-color-category-9'], theme['widgets-color-category-10'], theme['widgets-color-category-11'], theme['widgets-color-category-12']],
    // 连续色阶，比较接近的颜色会错开
    linear_10: [theme['widgets-color-linear-1'], theme['widgets-color-linear-5'], theme['widgets-color-linear-9'], theme['widgets-color-linear-3'], theme['widgets-color-linear-7'], theme['widgets-color-linear-10'], theme['widgets-color-linear-2'], theme['widgets-color-linear-4'], theme['widgets-color-linear-6'], theme['widgets-color-linear-8']],
    // 顺序色阶，连续相似的颜色排列
    order_10: [theme['widgets-color-linear-1'], theme['widgets-color-linear-2'], theme['widgets-color-linear-3'], theme['widgets-color-linear-4'], theme['widgets-color-linear-5'], theme['widgets-color-linear-6'], theme['widgets-color-linear-7'], theme['widgets-color-linear-8'], theme['widgets-color-linear-9'], theme['widgets-color-linear-10']],
    // 青色色阶 - turquoise
    // 连续色阶，比较接近的颜色会错开
    linear_turquoise_10: [theme['widgets-color-linear-turquoise-1'], theme['widgets-color-linear-turquoise-5'], theme['widgets-color-linear-turquoise-9'], theme['widgets-color-linear-turquoise-3'], theme['widgets-color-linear-turquoise-7'], theme['widgets-color-linear-turquoise-10'], theme['widgets-color-linear-turquoise-2'], theme['widgets-color-linear-turquoise-4'], theme['widgets-color-linear-turquoise-6'], theme['widgets-color-linear-turquoise-8']],
    // 顺序色阶，连续相似的颜色排列
    order_turquoise_10: [theme['widgets-color-linear-turquoise-1'], theme['widgets-color-linear-turquoise-2'], theme['widgets-color-linear-turquoise-3'], theme['widgets-color-linear-turquoise-4'], theme['widgets-color-linear-turquoise-5'], theme['widgets-color-linear-turquoise-6'], theme['widgets-color-linear-turquoise-7'], theme['widgets-color-linear-turquoise-8'], theme['widgets-color-linear-turquoise-9'], theme['widgets-color-linear-turquoise-10']]
  };
  _extends(result, theme);

  return result;
}