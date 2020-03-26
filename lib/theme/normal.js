var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

// import color from '!!sass-variable-loader!@alife/aisc-core/scss/variables/_color.scss';
// import fonts from '!!sass-variable-loader!@alife/aisc-core/scss/variables/_font.scss';
// import size from '!!sass-variable-loader!@alife/aisc-core/scss/variables/_size.scss';
// import widgetsVar from '!!sass-variable-loader!./normal.scss';
import themesVar from '@alife/aisc-core/aisc/js';

// 分类色阶
var category_12 = [themesVar['widgets-color-category-1'], themesVar['widgets-color-category-2'], themesVar['widgets-color-category-3'], themesVar['widgets-color-category-4'], themesVar['widgets-color-category-5'], themesVar['widgets-color-category-6'], themesVar['widgets-color-category-7'], themesVar['widgets-color-category-8'], themesVar['widgets-color-category-9'], themesVar['widgets-color-category-10'], themesVar['widgets-color-category-11'], themesVar['widgets-color-category-12']];
// 连续色阶，比较接近的颜色会错开
var linear_10 = [themesVar['widgets-color-linear-1'], themesVar['widgets-color-linear-5'], themesVar['widgets-color-linear-9'], themesVar['widgets-color-linear-3'], themesVar['widgets-color-linear-7'], themesVar['widgets-color-linear-10'], themesVar['widgets-color-linear-2'], themesVar['widgets-color-linear-4'], themesVar['widgets-color-linear-6'], themesVar['widgets-color-linear-8']];
// 顺序色阶，连续相似的颜色排列
var order_10 = [themesVar['widgets-color-linear-1'], themesVar['widgets-color-linear-2'], themesVar['widgets-color-linear-3'], themesVar['widgets-color-linear-4'], themesVar['widgets-color-linear-5'], themesVar['widgets-color-linear-6'], themesVar['widgets-color-linear-7'], themesVar['widgets-color-linear-8'], themesVar['widgets-color-linear-9'], themesVar['widgets-color-linear-10']];
// 青色色阶 - turquoise
// 连续色阶，比较接近的颜色会错开
var linear_turquoise_10 = [themesVar['widgets-color-linear-turquoise-1'], themesVar['widgets-color-linear-turquoise-5'], themesVar['widgets-color-linear-turquoise-9'], themesVar['widgets-color-linear-turquoise-3'], themesVar['widgets-color-linear-turquoise-7'], themesVar['widgets-color-linear-turquoise-10'], themesVar['widgets-color-linear-turquoise-2'], themesVar['widgets-color-linear-turquoise-4'], themesVar['widgets-color-linear-turquoise-6'], themesVar['widgets-color-linear-turquoise-8']];
// 顺序色阶，连续相似的颜色排列
var order_turquoise_10 = [themesVar['widgets-color-linear-turquoise-1'], themesVar['widgets-color-linear-turquoise-2'], themesVar['widgets-color-linear-turquoise-3'], themesVar['widgets-color-linear-turquoise-4'], themesVar['widgets-color-linear-turquoise-5'], themesVar['widgets-color-linear-turquoise-6'], themesVar['widgets-color-linear-turquoise-7'], themesVar['widgets-color-linear-turquoise-8'], themesVar['widgets-color-linear-turquoise-9'], themesVar['widgets-color-linear-turquoise-10']];
var themes = {
  name: 'normal',
  category_12: category_12,
  linear_10: linear_10,
  order_10: order_10,
  linear_turquoise_10: linear_turquoise_10,
  order_turquoise_10: order_turquoise_10
};
_extends(themes, themesVar);

// themes.fontFamilyNumber = themesVar['widgets-font-family-number'];
// themes.fontFamilyTxdMediumNumber = themesVar['widgets-font-family-txd-m-number'];
// themes.fontFamilyTxdRegularNumber = themesVar['widgets-font-family-txd-r-number'];

export default themes;