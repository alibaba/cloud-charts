'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fonts = exports.colors = undefined;

var _color = require('!!sass-variable-loader!@alife/aisc-core/scss/variables/_color.scss');

var _color2 = _interopRequireDefault(_color);

var _font = require('!!sass-variable-loader!@alife/aisc-core/scss/variables/_font.scss');

var _font2 = _interopRequireDefault(_font);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.colors = _color2.default;

_font2.default['fontFamilyNumber'] = "DINMediumNumber, " + _font2.default.fontFamilyBase;

exports.fonts = _font2.default;