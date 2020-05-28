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

/**
 * rectTooltip 直角坐标系的tooltip配置
 *
 * @param {Chart} chart 图表实例
 * @param {Object} config 配置项
 * @param {Object} componentConfig 组件的自定义配置
 * @param {boolean} onTooltipChange 自定义 tooltip:change 事件
 * */
export default function (chart, config, componentConfig, onTooltipChange) {
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
        _ref$position = _ref.position,
        position = _ref$position === undefined ? null : _ref$position,
        offset = _ref.offset,
        _ref$inPlot = _ref.inPlot,
        inPlot = _ref$inPlot === undefined ? true : _ref$inPlot,
        titleFormatter = _ref.titleFormatter,
        nameFormatter = _ref.nameFormatter,
        valueFormatter = _ref.valueFormatter,
        customConfig = _ref.customConfig;

    var tooltipConfig = {
      showTitle: showTitle,
      // crosshairs 空对象不可省略，否则在混合图表中会没有crosshairs line
      crosshairs: {},
      position: position,
      inPlot: inPlot,
      itemTpl: '<li data-index={index}>\n        <svg viewBox="0 0 6 6" class="g2-tooltip-marker"></svg>\n        <span class="g2-tooltip-item-name">{name}</span>' + (showColon ? ':' : '') + '<span class="g2-tooltip-item-value">{value}</span>\n      </li>'
    };

    if (offset !== undefined) {
      tooltipConfig.offset = offset;
    }

    if (componentConfig) {
      _extends(tooltipConfig, componentConfig);
    }

    if (customConfig) {
      merge(tooltipConfig, customConfig);
    }

    chart.tooltip(tooltipConfig);

    if (sort || titleFormatter || nameFormatter || valueFormatter) {
      if (onTooltipChange) {
        chart.on('tooltip:change', onTooltipChange);
      } else {
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
}