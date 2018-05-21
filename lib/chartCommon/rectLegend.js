'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

/*
* 常见直角坐标系的legend，仅包含name和align设置。
* */


exports.default = function (chart, config, customConfig) {
  var _this = this;

  // 设置图例
  if (config.legend) {
    var legendConfig = {
      useHtml: true,
      title: null,
      position: 'top',
      // 这个属性文档里没有，设置为false可以让图例不居中，再手动设置定位样式
      autoPosition: false,
      onHover: _common.noop,
      itemTpl: function itemTpl(value, color, checked, index) {
        var item = getRawData(config, _this.rawData, value);

        var result = config.legend.nameFormatter ? config.legend.nameFormatter(value, _extends({}, item, {
          color: color,
          checked: checked
        }), index) : value;
        return '' + ('<li class="g2-legend-list-item item-{index} {checked}" data-color="{originColor}" data-value="{originValue}">' + '<i class="g2-legend-marker" style="background-color:{color};"></i>' + '<span class="g2-legend-text">') + result + '</span></li>';
      },
      'g2-legend': _extends({
        top: _normal.size.s3
      }, config.legend.align === 'right' ? { right: 0 } : { left: 0 })
    };

    if (customConfig) {
      _extends(legendConfig, customConfig);
    }

    chart.legend(legendConfig);
  } else {
    chart.legend(false);
  }
};

var _normal = require('../theme/normal');

var _common = require('./common');

function getRawData(config, rawData, name) {
  if (!rawData) {
    return {};
  }

  var originData = {};
  if (config.dataType !== 'g2') {
    rawData.some(function (r) {
      if (r.name === name) {
        originData = r;
        return true;
      }
    });
  }

  return originData;
}
module.exports = exports['default'];