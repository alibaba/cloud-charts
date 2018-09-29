'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = function (chart, config, componentConfig) {
  var _this = this;

  if (config.tooltip !== false) {
    var _ref = config.tooltip || {},
        sort = _ref.sort,
        _ref$showTitle = _ref.showTitle,
        showTitle = _ref$showTitle === undefined ? true : _ref$showTitle,
        _ref$showColon = _ref.showColon,
        showColon = _ref$showColon === undefined ? true : _ref$showColon,
        titleFormatter = _ref.titleFormatter,
        nameFormatter = _ref.nameFormatter,
        valueFormatter = _ref.valueFormatter,
        customConfig = _ref.customConfig;

    var tooltipConfig = {
      showTitle: showTitle,
      // crosshairs 空对象不可省略，否则在混合图表中会没有crosshairs line
      crosshairs: {},
      itemTpl: '<li data-index={index}>' + '<span style="background-color:{color};" class="g2-tooltip-marker"></span>' + ('<span class="g2-tooltip-item-name">{name}</span>' + (showColon ? ':' : '') + '<span class="g2-tooltip-item-value">{value}</span></li>')
    };

    if (componentConfig) {
      _extends(tooltipConfig, componentConfig);
    }

    if (customConfig) {
      (0, _merge2.default)(tooltipConfig, customConfig);
    }

    chart.tooltip(tooltipConfig);

    if (sort || titleFormatter || nameFormatter || valueFormatter) {
      chart.on('tooltip:change', function (ev) {
        // 如果设置了合法的排序关键字，则开始排序
        if (_g2.default.Util.isFunction(sort)) {
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
  } else {
    chart.tooltip(false);
  }
};

var _g = require('@antv/g2');

var _g2 = _interopRequireDefault(_g);

var _common = require('./common');

var _merge = require('./merge');

var _merge2 = _interopRequireDefault(_merge);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
module.exports = exports['default'];