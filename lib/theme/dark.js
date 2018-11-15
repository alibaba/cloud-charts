'use strict';

exports.__esModule = true;
exports.fonts = exports.color = exports.size = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _color_dark = require('!!sass-variable-loader!@alife/aisc-core/scss/themes/_color_dark.scss');

var _color_dark2 = _interopRequireDefault(_color_dark);

var _font = require('!!sass-variable-loader!@alife/aisc-core/scss/variables/_font.scss');

var _font2 = _interopRequireDefault(_font);

var _size = require('!!sass-variable-loader!@alife/aisc-core/scss/variables/_size.scss');

var _size2 = _interopRequireDefault(_size);

var _dark = require('!!sass-variable-loader!./dark.scss');

var _dark2 = _interopRequireDefault(_dark);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var prefix = 'widgets-';

_extends(_color_dark2.default, _dark2.default, {
  // [`${prefix}tooltip-background`]: '#20264A',
  // [`${prefix}tooltip-shadow`]: '0 1px 5px 0 rgba(0, 0, 0, 0.2)',
  // [`${prefix}tooltip-cross-line`]: '#dddddd',
  // [`${prefix}tooltip-cross-react`]: '#20264A',
  // [`${prefix}tooltip-cross-react-opacity`]: 0.7,

  // 分类色阶
  category_12: [_dark2.default.widgetsColorCategory1, _dark2.default.widgetsColorCategory2, _dark2.default.widgetsColorCategory3, _dark2.default.widgetsColorCategory4, _dark2.default.widgetsColorCategory5, _dark2.default.widgetsColorCategory6, _dark2.default.widgetsColorCategory7, _dark2.default.widgetsColorCategory8, _dark2.default.widgetsColorCategory9, _dark2.default.widgetsColorCategory10, _dark2.default.widgetsColorCategory11, _dark2.default.widgetsColorCategory12],
  // 连续色阶，比较接近的颜色会错开
  linear_10: [_dark2.default.widgetsColorLinear1, _dark2.default.widgetsColorLinear5, _dark2.default.widgetsColorLinear9, _dark2.default.widgetsColorLinear3, _dark2.default.widgetsColorLinear7, _dark2.default.widgetsColorLinear10, _dark2.default.widgetsColorLinear2, _dark2.default.widgetsColorLinear4, _dark2.default.widgetsColorLinear6, _dark2.default.widgetsColorLinear8],
  // 顺序色阶，连续相似的颜色排列
  order_10: [_dark2.default.widgetsColorLinear1, _dark2.default.widgetsColorLinear2, _dark2.default.widgetsColorLinear3, _dark2.default.widgetsColorLinear4, _dark2.default.widgetsColorLinear5, _dark2.default.widgetsColorLinear6, _dark2.default.widgetsColorLinear7, _dark2.default.widgetsColorLinear8, _dark2.default.widgetsColorLinear9, _dark2.default.widgetsColorLinear10],

  // 青色色阶 - turquoise
  // 连续色阶，比较接近的颜色会错开
  linear_turquoise_10: [_dark2.default.widgetsColorLinearTurquoise1, _dark2.default.widgetsColorLinearTurquoise5, _dark2.default.widgetsColorLinearTurquoise9, _dark2.default.widgetsColorLinearTurquoise3, _dark2.default.widgetsColorLinearTurquoise7, _dark2.default.widgetsColorLinearTurquoise10, _dark2.default.widgetsColorLinearTurquoise2, _dark2.default.widgetsColorLinearTurquoise4, _dark2.default.widgetsColorLinearTurquoise6, _dark2.default.widgetsColorLinearTurquoise8],
  // 顺序色阶，连续相似的颜色排列
  order_turquoise_10: [_dark2.default.widgetsColorLinearTurquoise1, _dark2.default.widgetsColorLinearTurquoise2, _dark2.default.widgetsColorLinearTurquoise3, _dark2.default.widgetsColorLinearTurquoise4, _dark2.default.widgetsColorLinearTurquoise5, _dark2.default.widgetsColorLinearTurquoise6, _dark2.default.widgetsColorLinearTurquoise7, _dark2.default.widgetsColorLinearTurquoise8, _dark2.default.widgetsColorLinearTurquoise9, _dark2.default.widgetsColorLinearTurquoise10]
});

_font2.default.fontFamilyNumber = _dark2.default.fontFamilyNumber;
_font2.default.fontFamilyTxdMediumNumber = _dark2.default.fontFamilyTxdMediumNumber;
_font2.default.fontFamilyTxdRegularNumber = _dark2.default.fontFamilyTxdRegularNumber;

exports.size = _size2.default;
exports.color = _color_dark2.default;
exports.fonts = _font2.default;