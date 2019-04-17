'use strict';

exports.__esModule = true;
exports.fonts = exports.color = exports.size = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _color = require('!!sass-variable-loader!@alife/aisc-core/scss/variables/_color.scss');

var _color2 = _interopRequireDefault(_color);

var _font = require('!!sass-variable-loader!@alife/aisc-core/scss/variables/_font.scss');

var _font2 = _interopRequireDefault(_font);

var _size = require('!!sass-variable-loader!@alife/aisc-core/scss/variables/_size.scss');

var _size2 = _interopRequireDefault(_size);

var _normal = require('!!sass-variable-loader!./normal.scss');

var _normal2 = _interopRequireDefault(_normal);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_extends(_color2.default, _normal2.default, {
  // 分类色阶
  category_12: [_normal2.default.widgetsColorCategory1, _normal2.default.widgetsColorCategory2, _normal2.default.widgetsColorCategory3, _normal2.default.widgetsColorCategory4, _normal2.default.widgetsColorCategory5, _normal2.default.widgetsColorCategory6, _normal2.default.widgetsColorCategory7, _normal2.default.widgetsColorCategory8, _normal2.default.widgetsColorCategory9, _normal2.default.widgetsColorCategory10, _normal2.default.widgetsColorCategory11, _normal2.default.widgetsColorCategory12],
  // 连续色阶，比较接近的颜色会错开
  linear_10: [_normal2.default.widgetsColorLinear1, _normal2.default.widgetsColorLinear5, _normal2.default.widgetsColorLinear9, _normal2.default.widgetsColorLinear3, _normal2.default.widgetsColorLinear7, _normal2.default.widgetsColorLinear10, _normal2.default.widgetsColorLinear2, _normal2.default.widgetsColorLinear4, _normal2.default.widgetsColorLinear6, _normal2.default.widgetsColorLinear8],
  // 顺序色阶，连续相似的颜色排列
  order_10: [_normal2.default.widgetsColorLinear1, _normal2.default.widgetsColorLinear2, _normal2.default.widgetsColorLinear3, _normal2.default.widgetsColorLinear4, _normal2.default.widgetsColorLinear5, _normal2.default.widgetsColorLinear6, _normal2.default.widgetsColorLinear7, _normal2.default.widgetsColorLinear8, _normal2.default.widgetsColorLinear9, _normal2.default.widgetsColorLinear10],

  // 青色色阶 - turquoise
  // 连续色阶，比较接近的颜色会错开
  linear_turquoise_10: [_normal2.default.widgetsColorLinearTurquoise1, _normal2.default.widgetsColorLinearTurquoise5, _normal2.default.widgetsColorLinearTurquoise9, _normal2.default.widgetsColorLinearTurquoise3, _normal2.default.widgetsColorLinearTurquoise7, _normal2.default.widgetsColorLinearTurquoise10, _normal2.default.widgetsColorLinearTurquoise2, _normal2.default.widgetsColorLinearTurquoise4, _normal2.default.widgetsColorLinearTurquoise6, _normal2.default.widgetsColorLinearTurquoise8],
  // 顺序色阶，连续相似的颜色排列
  order_turquoise_10: [_normal2.default.widgetsColorLinearTurquoise1, _normal2.default.widgetsColorLinearTurquoise2, _normal2.default.widgetsColorLinearTurquoise3, _normal2.default.widgetsColorLinearTurquoise4, _normal2.default.widgetsColorLinearTurquoise5, _normal2.default.widgetsColorLinearTurquoise6, _normal2.default.widgetsColorLinearTurquoise7, _normal2.default.widgetsColorLinearTurquoise8, _normal2.default.widgetsColorLinearTurquoise9, _normal2.default.widgetsColorLinearTurquoise10]
});

_font2.default.fontFamilyNumber = _normal2.default.fontFamilyNumber;
_font2.default.fontFamilyTxdMediumNumber = _normal2.default.fontFamilyTxdMediumNumber;
_font2.default.fontFamilyTxdRegularNumber = _normal2.default.fontFamilyTxdRegularNumber;

exports.size = _size2.default;
exports.color = _color2.default;
exports.fonts = _font2.default;