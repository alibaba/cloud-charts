'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

/**
 * 图形元素label设置。
 *
 * @param {object} geom 图形元素对象
 * @param {object} config 图表配置项
 * @param {string} field 映射数据的字段
 * @param {object} [componentConfig] 图表额外配置项
 *
 * */


exports.default = function (geom, config) {
  var field = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'y';
  var componentConfig = arguments[3];

  if (config.label === false || config.label && config.label.visible === false) {
    return;
  }

  var _ref = config.label || {},
      _ref$type = _ref.type,
      type = _ref$type === undefined ? 'default' : _ref$type,
      _ref$position = _ref.position,
      position = _ref$position === undefined ? 'top' : _ref$position,
      _ref$offset = _ref.offset,
      offset = _ref$offset === undefined ? 0 : _ref$offset,
      _ref$autoRotate = _ref.autoRotate,
      autoRotate = _ref$autoRotate === undefined ? true : _ref$autoRotate,
      _ref$labelFormatter = _ref.labelFormatter,
      labelFormatter = _ref$labelFormatter === undefined ? null : _ref$labelFormatter,
      customConfig = _ref.customConfig;

  var labelConfig = {
    type: type,
    position: position,
    // 默认距离，加上文字一半的大小以居中
    offset: (0, _common.pxToNumber)(_index.size.s1) + (0, _common.pxToNumber)(_index.fonts.fontSizeBaseCaption) / 2,
    autoRotate: autoRotate,
    formatter: labelFormatter
  };

  if (position === 'middle') {
    labelConfig.offset = 0;
  }

  if (!(0, _common.isInvalidNumber)(offset)) {
    labelConfig.offset += Number(offset);
  }

  if (componentConfig) {
    _extends(labelConfig, componentConfig);
  }

  if (customConfig) {
    (0, _merge2.default)(labelConfig, customConfig);
  }

  geom.label(field, labelConfig);
};

var _index = require('../theme/index');

var _common = require('./common');

var _merge = require('./merge');

var _merge2 = _interopRequireDefault(_merge);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = exports['default'];