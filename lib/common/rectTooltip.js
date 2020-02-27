'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import G2 from '@antv/g2';
import { getRawData } from './common';
import merge from './merge';

// 排序函数
var sortFun = {
  // 升序
  asce: function asce(a, b) {
    return a.value - b.value;
  },

  // 降序
  desc: function desc(a, b) {
    return b.value - a.value;
  }
};

/*
 * 常见直角坐标系的tooltip，包含title、name、value
 * */
export default function (chart, config, componentConfig) {
  var _this = this;

  if (config.tooltip === false || config.tooltip && config.tooltip.visible === false) {
    chart.tooltip(false);
  } else {
    var _ref = config.tooltip || {},
        sort = _ref.sort,
        _ref$showTitle = _ref.showTitle,
        showTitle = _ref$showTitle === undefined ? true : _ref$showTitle,
        _ref$showColon = _ref.showColon,
        showColon = _ref$showColon === undefined ? true : _ref$showColon,
        _ref$inPlot = _ref.inPlot,
        inPlot = _ref$inPlot === undefined ? true : _ref$inPlot,
        titleFormatter = _ref.titleFormatter,
        nameFormatter = _ref.nameFormatter,
        valueFormatter = _ref.valueFormatter,
        customConfig = _ref.customConfig;

    var tooltipConfig = {
      showTitle: config.isCandlestick ? true : showTitle,
      // crosshairs 空对象不可省略，否则在混合图表中会没有crosshairs line
      crosshairs: {},
      inPlot: inPlot,
      itemTpl: !config.isCandlestick ? '<li data-index={index}>\n        <span style="background-color:{color};" class="g2-tooltip-marker"></span>\n        <span class="g2-tooltip-item-name">{name}</span>' + (showColon ? ':' : '') + '<span class="g2-tooltip-item-value">{value}</span>\n      </li>' : '<div>\n            ' + (showTitle ? '<div style="margin:10px 0;"><span style="background-color:{color};width:6px;height:6px;border-radius:50%;display:inline-block;margin-right:8px;"></span>{group}</div>' : '') + '\n            <div style="margin:8px 0 0;"><span class="g2-tooltip-item-name">{labelStart}</span>' + (showColon ? ':' : '') + '<span class="g2-tooltip-item-value">{start}</span></div><div style="margin:8px 0 0;"><span class="g2-tooltip-item-name">{labelEnd}</span>' + (showColon ? ':' : '') + '<span class="g2-tooltip-item-value">{end}</span></div><div style="margin:8px 0 0;"><span class="g2-tooltip-item-name">{labelMax}</span>' + (showColon ? ':' : '') + '<span class="g2-tooltip-item-value">{max}</span></div><div style="margin:8px 0 0;"><span class="g2-tooltip-item-name">{labelMin}</span>' + (showColon ? ':' : '') + '<span class="g2-tooltip-item-value">{min}</span></div>\n          </div>'
    };

    if (componentConfig) {
      _extends(tooltipConfig, componentConfig);
    }

    if (customConfig) {
      merge(tooltipConfig, customConfig);
    }

    chart.tooltip(tooltipConfig);

    if (sort || titleFormatter || nameFormatter || valueFormatter) {
      chart.on('tooltip:change', function (ev) {
        // 如果设置了合法的排序关键字，则开始排序
        if (G2.Util.isFunction(sort)) {
          ev.items.sort(sort);
        } else if (sortFun[sort]) {
          ev.items.sort(sortFun[sort]);
        }

        // 格式化标题
        if (titleFormatter) {
          ev.items[0].title = titleFormatter(ev.items[0].title, ev.items);
        }

        // 对每一项格式化 名字 和 值
        ev.items.forEach(function (item, index) {
          var raw = getRawData(config, _this.rawData, item);

          if (valueFormatter) {
            item.value = valueFormatter(item.value, raw, index, ev.items);
          }
          if (nameFormatter) {
            item.name = nameFormatter(item.name, raw, index, ev.items);
          }
        });
      });
    }
  }
}