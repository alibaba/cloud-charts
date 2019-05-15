'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; // import color from '!!sass-variable-loader!@alife/aisc-core/scss/variables/_color.scss';
// import fonts from '!!sass-variable-loader!@alife/aisc-core/scss/variables/_font.scss';
// import size from '!!sass-variable-loader!@alife/aisc-core/scss/variables/_size.scss';
// import widgetsVar from '!!sass-variable-loader!./normal.scss';


var _js = require('@alife/aisc-core/aliyun/js');

var _js2 = _interopRequireDefault(_js);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// 分类色阶
var category_12 = [_js2.default['widgets-color-category-1'], _js2.default['widgets-color-category-2'], _js2.default['widgets-color-category-3'], _js2.default['widgets-color-category-4'], _js2.default['widgets-color-category-5'], _js2.default['widgets-color-category-6'], _js2.default['widgets-color-category-7'], _js2.default['widgets-color-category-8'], _js2.default['widgets-color-category-9'], _js2.default['widgets-color-category-10'], _js2.default['widgets-color-category-11'], _js2.default['widgets-color-category-12']];
// 连续色阶，比较接近的颜色会错开
var linear_10 = [_js2.default['widgets-color-linear-1'], _js2.default['widgets-color-linear-5'], _js2.default['widgets-color-linear-9'], _js2.default['widgets-color-linear-3'], _js2.default['widgets-color-linear-7'], _js2.default['widgets-color-linear-10'], _js2.default['widgets-color-linear-2'], _js2.default['widgets-color-linear-4'], _js2.default['widgets-color-linear-6'], _js2.default['widgets-color-linear-8']];
// 顺序色阶，连续相似的颜色排列
var order_10 = [_js2.default['widgets-color-linear-1'], _js2.default['widgets-color-linear-2'], _js2.default['widgets-color-linear-3'], _js2.default['widgets-color-linear-4'], _js2.default['widgets-color-linear-5'], _js2.default['widgets-color-linear-6'], _js2.default['widgets-color-linear-7'], _js2.default['widgets-color-linear-8'], _js2.default['widgets-color-linear-9'], _js2.default['widgets-color-linear-10']];
// 青色色阶 - turquoise
// 连续色阶，比较接近的颜色会错开
var linear_turquoise_10 = [_js2.default['widgets-color-linear-turquoise-1'], _js2.default['widgets-color-linear-turquoise-5'], _js2.default['widgets-color-linear-turquoise-9'], _js2.default['widgets-color-linear-turquoise-3'], _js2.default['widgets-color-linear-turquoise-7'], _js2.default['widgets-color-linear-turquoise-10'], _js2.default['widgets-color-linear-turquoise-2'], _js2.default['widgets-color-linear-turquoise-4'], _js2.default['widgets-color-linear-turquoise-6'], _js2.default['widgets-color-linear-turquoise-8']];
// 顺序色阶，连续相似的颜色排列
var order_turquoise_10 = [_js2.default['widgets-color-linear-turquoise-1'], _js2.default['widgets-color-linear-turquoise-2'], _js2.default['widgets-color-linear-turquoise-3'], _js2.default['widgets-color-linear-turquoise-4'], _js2.default['widgets-color-linear-turquoise-5'], _js2.default['widgets-color-linear-turquoise-6'], _js2.default['widgets-color-linear-turquoise-7'], _js2.default['widgets-color-linear-turquoise-8'], _js2.default['widgets-color-linear-turquoise-9'], _js2.default['widgets-color-linear-turquoise-10']];
var themes = {
  category_12: category_12,
  linear_10: linear_10,
  order_10: order_10,
  linear_turquoise_10: linear_turquoise_10,
  order_turquoise_10: order_turquoise_10
};
_extends(themes, _js2.default);

themes.fontFamilyNumber = _js2.default['widgets-font-family-number'];
themes.fontFamilyTxdMediumNumber = _js2.default['widgets-font-family-txd-m-number'];
themes.fontFamilyTxdRegularNumber = _js2.default['widgets-font-family-txd-r-number'];

exports.default = themes;
module.exports = exports['default'];