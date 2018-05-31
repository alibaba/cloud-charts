'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

/*
* 常见直角坐标系的tooltip，包含title、name、value
* */


exports.default = function (chart, config, customConfig) {
  var _this = this;

  // tooltip
  if (config.tooltip) {
    var tooltipCfg = {
      // crosshairs 空对象不可省略，否则在混合图表中会没有crosshairs line
      crosshairs: {},
      itemTpl: '<li data-index={index}>' + '<span style="background-color:{color};" class="g2-tooltip-marker"></span>' + '<span class="g2-tooltip-item-name">{name}</span>:<span class="g2-tooltip-item-value">{value}</span></li>'
    };
    if (customConfig) {
      _extends(tooltipCfg, customConfig);
    }
    chart.tooltip(tooltipCfg);
    if (config.tooltip.titleFormatter || config.tooltip.nameFormatter || config.tooltip.valueFormatter) {
      chart.on('tooltip:change', function (ev) {
        if (config.tooltip.titleFormatter) {
          ev.items[0].title = config.tooltip.titleFormatter(ev.items[0].title, ev.items);
        }

        ev.items.forEach(function (item, index) {
          var raw = (0, _common.getRawData)(config, _this.rawData, item);

          if (config.tooltip.valueFormatter) {
            item.value = config.tooltip.valueFormatter(item.value, raw, index, ev.items);
          }
          if (config.tooltip.nameFormatter) {
            item.name = config.tooltip.nameFormatter(item.name, raw, index, ev.items);
          }
        });
      });
    }
  } else {
    chart.tooltip(false);
  }
};

var _common = require('./common');

module.exports = exports['default'];