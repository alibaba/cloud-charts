'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fonts = exports.color = exports.size = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _color = require('!!sass-variable-loader!@alife/aisc-core/scss/variables/_color.scss');

var _color2 = _interopRequireDefault(_color);

var _font = require('!!sass-variable-loader!@alife/aisc-core/scss/variables/_font.scss');

var _font2 = _interopRequireDefault(_font);

var _size = require('!!sass-variable-loader!@alife/aisc-core/scss/variables/_size.scss');

var _size2 = _interopRequireDefault(_size);

var _aopsDark = require('!!sass-variable-loader!./aopsDark.scss');

var _aopsDark2 = _interopRequireDefault(_aopsDark);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_extends(_color2.default, _aopsDark2.default, {
  // [`${prefix}tooltip-background`]: 'rgba(255, 255, 255, 0.9)',
  // [`${prefix}tooltip-shadow`]: '0 1px 5px 0 rgba(0, 0, 0, 0.2)',
  // [`${prefix}tooltip-cross-line`]: '#dddddd',
  // [`${prefix}tooltip-cross-react`]: '#CCD6EC',
  // [`${prefix}tooltip-cross-react-opacity`]: 0.3,

  // 分类色阶
  category_12: [_aopsDark2.default.widgetsColorCategory1, _aopsDark2.default.widgetsColorCategory2, _aopsDark2.default.widgetsColorCategory3, _aopsDark2.default.widgetsColorCategory4, _aopsDark2.default.widgetsColorCategory5, _aopsDark2.default.widgetsColorCategory6, _aopsDark2.default.widgetsColorCategory7, _aopsDark2.default.widgetsColorCategory8, _aopsDark2.default.widgetsColorCategory9, _aopsDark2.default.widgetsColorCategory10, _aopsDark2.default.widgetsColorCategory11, _aopsDark2.default.widgetsColorCategory12],
  // 连续色阶，比较接近的颜色会错开
  linear_10: [_aopsDark2.default.widgetsColorLinear1, _aopsDark2.default.widgetsColorLinear5, _aopsDark2.default.widgetsColorLinear9, _aopsDark2.default.widgetsColorLinear3, _aopsDark2.default.widgetsColorLinear7, _aopsDark2.default.widgetsColorLinear10, _aopsDark2.default.widgetsColorLinear2, _aopsDark2.default.widgetsColorLinear4, _aopsDark2.default.widgetsColorLinear6, _aopsDark2.default.widgetsColorLinear8],
  // 顺序色阶，连续相似的颜色排列
  order_10: [_aopsDark2.default.widgetsColorLinear1, _aopsDark2.default.widgetsColorLinear2, _aopsDark2.default.widgetsColorLinear3, _aopsDark2.default.widgetsColorLinear4, _aopsDark2.default.widgetsColorLinear5, _aopsDark2.default.widgetsColorLinear6, _aopsDark2.default.widgetsColorLinear7, _aopsDark2.default.widgetsColorLinear8, _aopsDark2.default.widgetsColorLinear9, _aopsDark2.default.widgetsColorLinear10]
});

_font2.default.fontFamilyNumber = _aopsDark2.default.fontFamilyNumber;

exports.size = _size2.default;
exports.color = _color2.default;
exports.fonts = _font2.default;