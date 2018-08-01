'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

/*
* 常见直角坐标系的legend，仅包含name和align设置。
* */


exports.default = function (chart, config, componentConfig, isOneDataGroup) {
  var _this = this;

  // 设置图例
  if (config.legend !== false) {
    var _ref = config.legend || {},
        align = _ref.align,
        nameFormatter = _ref.nameFormatter,
        valueFormatter = _ref.valueFormatter,
        showData = _ref.showData,
        customConfig = _ref.customConfig,
        _ref$allowAllCanceled = _ref.allowAllCanceled,
        allowAllCanceled = _ref$allowAllCanceled === undefined ? false : _ref$allowAllCanceled,
        _ref$style = _ref.style,
        style = _ref$style === undefined ? {} : _ref$style;

    var legendConfig = {
      useHtml: true,
      title: null,
      position: 'top',
      allowAllCanceled: allowAllCanceled,
      // 这个属性文档里没有，设置为false可以让图例不居中，再手动设置定位样式
      autoPosition: false,
      onHover: _common.noop,
      itemTpl: function itemTpl(value, color, checked, index) {
        var item = getRawData(config, _this.rawData, value, isOneDataGroup);

        var newName = nameFormatter ? nameFormatter(value, _extends({}, item, {
          color: color,
          checked: checked
        }), index) : value;

        if (showData) {
          var dataValue = getDataValue(item.data);
          var newValue = valueFormatter ? valueFormatter(dataValue, _extends({}, item, {
            color: color,
            checked: checked
          }), index) : dataValue;

          return '' + ('<li class="g2-legend-list-item item-{index} {checked}" data-color="{originColor}" data-value="{originValue}">' + '<i class="g2-legend-marker" style="background-color:{color};"></i>' + '<span class="g2-legend-text">') + newName + '</span><span class="g2-legend-value">' + newValue + '</span></li>';
        }

        return '' + ('<li class="g2-legend-list-item item-{index} {checked}" data-color="{originColor}" data-value="{originValue}">' + '<i class="g2-legend-marker" style="background-color:{color};"></i>' + '<span class="g2-legend-text">') + newName + '</span></li>';
      },
      'g2-legend': _extends({
        top: _index.size.s3
      }, align === 'right' ? { right: 0 } : { left: 0 })
    };

    if (componentConfig) {
      // 内部的componentConfig直接使用assign浅复制，方便覆盖。
      _extends(legendConfig, componentConfig);
    }

    if (customConfig) {
      (0, _merge2.default)(legendConfig, customConfig);
    }

    if (legendConfig['g2-legend'] && _typeof(legendConfig['g2-legend']) === 'object') {
      _extends(legendConfig['g2-legend'], style);
    }

    chart.legend(legendConfig);
  } else {
    chart.legend(false);
  }
};

var _index = require('../theme/index');

var _common = require('./common');

var _merge = require('./merge');

var _merge2 = _interopRequireDefault(_merge);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getRawData(config, rawData, name, isOneDataGroup) {
  if (!rawData) {
    return {};
  }

  if (isOneDataGroup) {
    var _originData = rawData[0] || {};
    var result = {};

    _originData.data.some(function (r) {
      if (Array.isArray(r) && r[0] === name || (typeof r === 'undefined' ? 'undefined' : _typeof(r)) === 'object' && r.x === name) {
        result = r;
        return true;
      }
      return false;
    });

    if (Array.isArray(result)) {
      result = {
        data: result
      };
    }

    return result;
  }

  var originData = {};
  if (config.dataType !== 'g2') {
    rawData.some(function (r) {
      if (r.name === name) {
        originData = r;
        return true;
      }
      return false;
    });
  }

  return originData;
}

function getDataValue(data) {
  if (!Array.isArray(data)) {
    return '-';
  }

  for (var i = 0; i < data.length; i++) {
    // 单组数据时，如饼图/漏斗图，data[i] 不是数组/对象
    if (_typeof(data[i]) !== 'object' && i === 1) {
      return data[i];
    }
    if (i === data.length - 1) {
      if (Array.isArray(data[i])) {
        return data[i][1];
      }
      if (_typeof(data[i]) === 'object') {
        return data[i].y;
      }
    }
  }
}
module.exports = exports['default'];