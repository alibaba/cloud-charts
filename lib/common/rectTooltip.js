'use strict';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = _default;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _common = require("./common");

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
 * @param {Object} defaultConfig 组件的自定义配置
 * @param {Function} onTooltipChange 自定义 tooltip:change 事件
 * @param {Object} componentConfig
 * */
function _default(chart, config, defaultConfig, onTooltipChange, componentConfig) {
  var _this = this;

  if (config.tooltip === false || config.tooltip && config.tooltip.visible === false) {
    chart.tooltip(false);
  } else {
    var _ref = config.tooltip || {},
        sort = _ref.sort,
        _ref$showTitle = _ref.showTitle,
        showTitle = _ref$showTitle === void 0 ? true : _ref$showTitle,
        position = _ref.position,
        offset = _ref.offset,
        titleFormatter = _ref.titleFormatter,
        nameFormatter = _ref.nameFormatter,
        valueFormatter = _ref.valueFormatter,
        customConfig = _ref.customConfig;

    var tooltipConfig = (0, _extends2["default"])({}, defaultConfig, {
      showTitle: showTitle,
      // title: '_customTitle_',
      showCrosshairs: true,
      // crosshairs 空对象不可省略，否则在混合图表中会没有crosshairs line
      crosshairs: {
        type: 'x'
      },
      position: position,
      offset: offset,
      shared: true // inPlot,
      // itemTpl: `<li data-index={index}>
      //   <svg viewBox="0 0 6 6" class="g2-tooltip-marker"></svg>
      //   <span class="g2-tooltip-item-name">{name}</span>${
      //     showColon ? ':' : ''
      //   }<span class="g2-tooltip-item-value">{value}</span>
      // </li>`,
      // customContent(title, data) {
      //   console.log(title, data);
      //   return `<div class="g2-tooltip-title">${title}</div>
      //     <ul class="g2-tooltip-list">
      //       ${
      //         data.map((d, i) => {
      //           return `<li class="g2-tooltip-list-item" data-index="${i}">
      //             <span class="g2-tooltip-marker" style="background:${d.color}"></span>
      //             <span class="g2-tooltip-name">${d.name}</span>:<span class="g2-tooltip-value">${d.value}</span>
      //           </li>`;
      //         }).join('')
      //       }
      //     </ul>
      //   `;
      // },

    });

    if (titleFormatter) {
      tooltipConfig.title = '_customTitle_';
    }

    if (componentConfig) {
      Object.assign(tooltipConfig, componentConfig);
    }

    if (customConfig) {
      (0, _common.merge)(tooltipConfig, customConfig);
    }

    chart.tooltip(tooltipConfig);

    if (sort || titleFormatter || nameFormatter || valueFormatter) {
      if (onTooltipChange) {
        chart.on('tooltip:change', onTooltipChange);
      } else {
        chart.on('tooltip:change', function (ev) {
          // x: 当前鼠标的 x 坐标,
          // y: 当前鼠标的 y 坐标,
          // items: 数组对象，当前 tooltip 显示的每条内容
          // title: tooltip 标题
          var items = ev.data.items; // console.log(ev);
          // 如果设置了合法的排序关键字，则开始排序

          if (typeof sort === 'function') {
            items.sort(sort);
          } else if (sortFun[sort]) {
            items.sort(sortFun[sort]);
          } // 格式化标题


          if (titleFormatter && !items[0].data.hasCustomTitle) {
            // ev.title = titleFormatter(ev.title, ev.items);
            // items[0].title = titleFormatter(items[0].title, items);
            items[0].data._customTitle_ = titleFormatter(items[0].data.x, items);
            items[0].data.hasCustomTitle = true;
          } // console.log(ev);
          // 对每一项格式化 名字 和 值


          items.forEach(function (item, index) {
            // @ts-ignore
            var raw = (0, _common.getRawData)(config, _this.rawData, item);

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