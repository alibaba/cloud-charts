'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = function (geom, config) {
  var field = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'y';
  var componentConfig = arguments[3];
  var extraConfigKey = arguments[4];

  var configLabel = config[defaultConfigKey];
  if (extraConfigKey && config[extraConfigKey] !== undefined) {
    configLabel = config[extraConfigKey];
  }
  // const configKey = extraConfigKey || defaultConfigKey;
  if (configLabel === false || configLabel && configLabel.visible === false) {
    return;
  }

  var _ref = configLabel || {},
      _ref$type = _ref.type,
      type = _ref$type === undefined ? 'default' : _ref$type,
      _ref$position = _ref.position,
      position = _ref$position === undefined ? 'top' : _ref$position,
      offset = _ref.offset,
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

  if (componentConfig) {
    _extends(labelConfig, componentConfig);
  }

  if (!(0, _common.isInvalidNumber)(offset)) {
    labelConfig.offset += Number(offset);
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

/**
 * 图形元素label设置。
 *
 * @param {object} geom 图形元素对象
 * @param {object} config 图表配置项
 * @param {string} [field] 映射数据的字段，默认为y
 * @param {object} [componentConfig] 图表额外配置项
 * @param {string} [extraConfigKey] 额外配置项的key，会在 config.label 的基础上额外扩展，且配置优先级高于默认的 label
 *
 * */

var defaultConfigKey = 'label';

module.exports = exports['default'];