// import color from '!!sass-variable-loader!@alife/aisc-core/scss/variables/_color.scss';
// import fonts from '!!sass-variable-loader!@alife/aisc-core/scss/variables/_font.scss';
// import size from '!!sass-variable-loader!@alife/aisc-core/scss/variables/_size.scss';
// import widgetsVar from '!!sass-variable-loader!./normal.scss';
import themesVar from '@alife/aisc-core/aisc/js';

// 分类色阶
const category_12 = [
  themesVar['widgets-color-category-1'],
  themesVar['widgets-color-category-2'],
  themesVar['widgets-color-category-3'],
  themesVar['widgets-color-category-4'],
  themesVar['widgets-color-category-5'],
  themesVar['widgets-color-category-6'],
  themesVar['widgets-color-category-7'],
  themesVar['widgets-color-category-8'],
  themesVar['widgets-color-category-9'],
  themesVar['widgets-color-category-10'],
  themesVar['widgets-color-category-11'],
  themesVar['widgets-color-category-12'],
];
// 连续色阶，比较接近的颜色会错开
const linear_10 = [
  themesVar['widgets-color-linear-1'],
  themesVar['widgets-color-linear-5'],
  themesVar['widgets-color-linear-9'],
  themesVar['widgets-color-linear-3'],
  themesVar['widgets-color-linear-7'],
  themesVar['widgets-color-linear-10'],
  themesVar['widgets-color-linear-2'],
  themesVar['widgets-color-linear-4'],
  themesVar['widgets-color-linear-6'],
  themesVar['widgets-color-linear-8'],
];
// 顺序色阶，连续相似的颜色排列
const order_10 = [
  themesVar['widgets-color-linear-1'],
  themesVar['widgets-color-linear-2'],
  themesVar['widgets-color-linear-3'],
  themesVar['widgets-color-linear-4'],
  themesVar['widgets-color-linear-5'],
  themesVar['widgets-color-linear-6'],
  themesVar['widgets-color-linear-7'],
  themesVar['widgets-color-linear-8'],
  themesVar['widgets-color-linear-9'],
  themesVar['widgets-color-linear-10'],
];
// 青色色阶 - turquoise
// 连续色阶，比较接近的颜色会错开
const linear_turquoise_10 = [
  themesVar['widgets-color-linear-turquoise-1'],
  themesVar['widgets-color-linear-turquoise-5'],
  themesVar['widgets-color-linear-turquoise-9'],
  themesVar['widgets-color-linear-turquoise-3'],
  themesVar['widgets-color-linear-turquoise-7'],
  themesVar['widgets-color-linear-turquoise-10'],
  themesVar['widgets-color-linear-turquoise-2'],
  themesVar['widgets-color-linear-turquoise-4'],
  themesVar['widgets-color-linear-turquoise-6'],
  themesVar['widgets-color-linear-turquoise-8'],
];
// 顺序色阶，连续相似的颜色排列
const order_turquoise_10 = [
  themesVar['widgets-color-linear-turquoise-1'],
  themesVar['widgets-color-linear-turquoise-2'],
  themesVar['widgets-color-linear-turquoise-3'],
  themesVar['widgets-color-linear-turquoise-4'],
  themesVar['widgets-color-linear-turquoise-5'],
  themesVar['widgets-color-linear-turquoise-6'],
  themesVar['widgets-color-linear-turquoise-7'],
  themesVar['widgets-color-linear-turquoise-8'],
  themesVar['widgets-color-linear-turquoise-9'],
  themesVar['widgets-color-linear-turquoise-10'],
];
const themes = {
  name: 'normal',
  category_12,
  linear_10,
  order_10,
  linear_turquoise_10,
  order_turquoise_10,
};
Object.assign(themes, themesVar);

// themes.fontFamilyNumber = themesVar['widgets-font-family-number'];
// themes.fontFamilyTxdMediumNumber = themesVar['widgets-font-family-txd-m-number'];
// themes.fontFamilyTxdRegularNumber = themesVar['widgets-font-family-txd-r-number'];

export default themes;
