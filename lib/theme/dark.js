'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fonts = exports.color = exports.size = undefined;

var _extends2;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _color_dark = require('!!sass-variable-loader!@alife/aisc-core/scss/themes/_color_dark.scss');

var _color_dark2 = _interopRequireDefault(_color_dark);

var _font = require('!!sass-variable-loader!@alife/aisc-core/scss/variables/_font.scss');

var _font2 = _interopRequireDefault(_font);

var _size = require('!!sass-variable-loader!@alife/aisc-core/scss/variables/_size.scss');

var _size2 = _interopRequireDefault(_size);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var prefix = 'widgets-';

_extends(_color_dark2.default, (_extends2 = {}, _defineProperty(_extends2, prefix + 'tooltip-background', 'rgba(255, 255, 255, 0.9)'), _defineProperty(_extends2, prefix + 'tooltip-shadow', '0 1px 5px 0 rgba(0, 0, 0, 0.2)'), _defineProperty(_extends2, 'colors_12', [_color_dark2.default.colorB16, _color_dark2.default.colorF12, _color_dark2.default.colorF23, _color_dark2.default.colorF32,
// '#2889EC',
// '#F6A71F',
// '#EF5350',
// '#4AD051',
'#8B73CC', '#0F1BB3', '#429588', '#735546', '#D42762', '#673EBC', '#65DBFF', '#5ABCD6']), _extends2));

_font2.default['fontFamilyNumber'] = "DINMediumNumber, " + _font2.default.fontFamilyBase;

exports.size = _size2.default;
exports.color = _color_dark2.default;
exports.fonts = _font2.default;