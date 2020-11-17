'use strict';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = _default;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutPropertiesLoose"));

var _themes = _interopRequireDefault(require("../themes"));

var _common = require("./common");

/**
 * 图形元素label设置。
 *
 * @param {object} geom 图形元素对象
 * @param {object} config 图表配置项
 * @param {string} [field] 映射数据的字段，默认为y
 * @param {object} [defaultConfig] 图表额外配置项
 * @param {string} [extraConfigKey] 额外配置项的key，会在 config.label 的基础上额外扩展，且配置优先级高于默认的 label
 *
 * */
var defaultConfigKey = 'label';

function _default(geom, config, field, defaultConfig, extraConfigKey, useCustomOffset, componentConfig) {
  if (field === void 0) {
    field = 'y';
  }

  var configLabel = config[defaultConfigKey];

  if (extraConfigKey && config[extraConfigKey] !== undefined) {
    configLabel = config[extraConfigKey];
  } // const configKey = extraConfigKey || defaultConfigKey;


  if (configLabel === false || typeof configLabel === 'object' && configLabel.visible === false) {
    return;
  }

  if (configLabel === true) {
    configLabel = {};
  }

  var _configLabel = configLabel,
      _configLabel$position = _configLabel.position,
      position = _configLabel$position === void 0 ? 'top' : _configLabel$position,
      offset = _configLabel.offset,
      _configLabel$labelFor = _configLabel.labelFormatter,
      labelFormatter = _configLabel$labelFor === void 0 ? null : _configLabel$labelFor,
      customConfig = _configLabel.customConfig,
      otherConfigs = (0, _objectWithoutPropertiesLoose2["default"])(_configLabel, ["position", "offset", "labelFormatter", "customConfig"]);
  var labelConfig = (0, _extends2["default"])({}, defaultConfig, {
    // type,
    position: position,
    // 默认距离 4，加上文字一半的大小以居中，转换为字号 12/3 + 12/2 = 12 * 5/6
    offset: (0, _common.pxToNumber)(_themes["default"]['widgets-font-size-1']) * 5 / 6 // autoRotate,
    // style,
    // textStyle,

  });

  if (labelFormatter) {
    labelConfig.content = function (v, item, index) {
      return labelFormatter(v[field], item, index);
    };
  }

  Object.assign(labelConfig, otherConfigs);

  if (position === 'middle') {
    labelConfig.offset = 0;
  }

  if (componentConfig) {
    Object.assign(labelConfig, componentConfig);
  }

  if (offset !== undefined) {
    labelConfig.offset = offset;
  }

  if (customConfig) {
    (0, _common.merge)(labelConfig, customConfig);
  }

  if (useCustomOffset) {
    labelConfig.offset = Number(offset);
  }

  geom.label(field, labelConfig);
}