'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _merge = require('../common/merge');

var _merge2 = _interopRequireDefault(_merge);

var _index = require('../theme/index');

var _common = require('../common/common');

require('./G2Pie.scss');

var _rectLegend = require('../common/rectLegend');

var _rectLegend2 = _interopRequireDefault(_rectLegend);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var defaultConfig = {
  colors: _index.color.category_12,
  padding: [20, 20, 20, 20],
  legend: {
    // position: 'right',
    nameFormatter: null, // 可以强制覆盖，手动设置label
    valueFormatter: null
  },
  tooltip: {
    nameFormatter: null,
    valueFormatter: null
  },
  autoSort: true,
  cycle: false,
  select: false,
  selectData: null,
  innerRadius: 0.8, // 内环半径大小，仅cycle为true时可用
  outerRadius: 0.8, // 饼图半径大小，初始化时可用
  drawPadding: 10
};

function selectGeom(config, geom, selectKey) {
  if (!geom || !selectKey || !Array.isArray(this.data)) {
    return;
  }

  // 清除选中效果
  geom.clearSelected();

  // 找到对应的数据，设置选中
  this.data.forEach(function (d) {
    if (d.x === selectKey) {
      geom.setSelected(d);
    }
  });
}

exports.default = {
  beforeInit: function beforeInit(props) {
    var config = props.config;

    var element = this.chartDom;
    var padding = props.padding || config.padding || defaultConfig.padding;
    var outerRadius = Math.max(Math.min(config.outerRadius || defaultConfig.outerRadius, 1), 0.01);
    var drawPadding = config.drawPadding || defaultConfig.drawPadding;

    var boxHeight = element.offsetHeight - padding[0] - padding[2];
    var boxWidth = element.offsetWidth - padding[1] - padding[3];
    // 饼本体大小，向下取整
    var diameter = Math.floor(boxHeight < boxWidth ? boxHeight * outerRadius : boxWidth * outerRadius);

    element.style.paddingTop = padding[0] + 'px';
    element.style.paddingRight = padding[1] + 'px';
    element.style.paddingBottom = padding[2] + 'px';
    element.style.paddingLeft = padding[3] + 'px';

    this.childrenDom = element.querySelector('.aisc-widgets-children');
    if (this.childrenDom) {
      this.childrenDom.style.width = diameter + drawPadding + 'px';
      this.childrenDom.style.height = boxHeight + 'px';
    }

    // TODO 处理padding
    return _extends({}, props, {
      width: diameter + drawPadding,
      height: diameter + drawPadding,
      // forceFit: true,
      padding: drawPadding
    });
  },
  changeSize: function changeSize(chart, config, w, h) {
    var padding = config.padding || defaultConfig.padding;
    var outerRadius = Math.max(Math.min(config.outerRadius || defaultConfig.outerRadius, 1), 0.01);
    var drawPadding = config.drawPadding || defaultConfig.drawPadding;

    var boxHeight = h - padding[0] - padding[2];
    var boxWidth = w - padding[1] - padding[3];
    // 饼本体大小，向下取整
    var diameter = Math.floor(boxHeight < boxWidth ? boxHeight * outerRadius : boxWidth * outerRadius);

    if (this.childrenDom) {
      this.childrenDom.style.width = diameter + drawPadding + 'px';
      this.childrenDom.style.height = boxHeight + 'px';
    }

    chart.changeSize(diameter + drawPadding, diameter + drawPadding);
  },
  changeData: function changeData(chart, config, data) {
    // 更新数据总和值，保证百分比的正常
    var totalData = 0;
    data.forEach(function (d) {
      totalData += d.y;
    });
    this.totalData = totalData;

    // 不要忘记排序的状态
    if (config.autoSort) {
      data.sort(function (a, b) {
        return b.y - a.y;
      });
    }
    // 更新挂载的转换数据
    this.data = data;

    chart.changeData(data);
  },
  changeCustomConfig: function changeCustomConfig(objValue, othValue, key, newConfig, oldConfig) {
    if (key === 'selectData' && objValue !== othValue) {
      selectGeom.call(this, newConfig, this.geom, objValue);
      return true;
    }
  },
  init: function init(chart, userConfig, data) {
    var _this = this;

    var config = (0, _merge2.default)({}, defaultConfig, userConfig);

    var defs = {
      type: {
        type: 'cat'
      }
    };

    if (config.autoSort) {
      data.sort(function (a, b) {
        return b.y - a.y;
      });
    }
    // 挂载转换后的数据
    this.data = data;

    chart.source(data, defs);

    // 重要：绘制饼图时，必须声明 theta 坐标系
    var thetaConfig = {
      radius: 1 // 设置饼图的为100% 大小，具体大小改变在 beforeInit 中diameter的值，目前为0.8
    };
    if (config.cycle) {
      thetaConfig.innerRadius = Math.max(Math.min(config.innerRadius, 1), 0);
    }
    chart.coord('theta', thetaConfig);

    // 计算得总数据
    var totalData = 0;
    data.forEach(function (d) {
      totalData += d.y;
    });
    this.totalData = totalData;

    var drawPadding = config.drawPadding || 0;

    // 设置图例
    _rectLegend2.default.call(this, chart, config, {
      autoCollapse: false,
      position: 'right',
      itemTpl: function itemTpl(value, itemColor, checked, index) {
        var _ref = config.legend || {},
            nameFormatter = _ref.nameFormatter,
            valueFormatter = _ref.valueFormatter,
            _ref$showData = _ref.showData,
            showData = _ref$showData === undefined ? true : _ref$showData;

        var item = _this.data && _this.data[index] || {};
        var raw = _this.rawData && _this.rawData[0] || {};
        var percent = (0, _common.numberDecimal)(item.y / _this.totalData, 4);

        var result = nameFormatter ? nameFormatter(value, _extends({}, raw, {
          percent: percent,
          itemColor: itemColor,
          checked: checked
        }), index) : value;

        if (showData) {
          var number = valueFormatter ? valueFormatter(item.y, _extends({}, raw, {
            percent: percent,
            itemColor: itemColor,
            checked: checked
          }), index) : item.y;
          return '' + ('<li class="g2-legend-list-item item-{index} {checked}" data-color="{originColor}" data-value="{originValue}">' + '<i class="g2-legend-marker" style="background-color:{color};"></i>' + '<span class="g2-legend-text">') + result + '</span>' + ('<span class="g2-legend-value">' + number + '</span></li>');
        }

        return '' + ('<li class="g2-legend-list-item item-{index} {checked}" data-color="{originColor}" data-value="{originValue}">' + '<i class="g2-legend-marker" style="background-color:{color};"></i>' + '<span class="g2-legend-text">') + result + '</span></li>';
      },
      'g2-legend': {
        position: 'static',
        // inline flex items 不能使用百分比的margin/padding，设置为固定大小
        marginLeft: Math.max((0, _common.pxToNumber)(_index.size.s5) - drawPadding, 0) + 'px'
      },
      'g2-legend-list-item': {
        marginRight: 0
      }
    }, true);

    // tooltip
    if (config.tooltip) {
      var tooltipCfg = {
        showTitle: false
        // crosshairs: {},
      };
      chart.tooltip(tooltipCfg);
      if (config.tooltip.nameFormatter || config.tooltip.valueFormatter) {
        chart.on('tooltip:change', function (ev) {
          var raw = _this.rawData && _this.rawData[0] || {};

          ev.items.forEach(function (item, index) {
            var percent = (0, _common.numberDecimal)(item.value / _this.totalData, 4);

            if (config.tooltip.valueFormatter) {
              item.value = config.tooltip.valueFormatter(item.value, _extends({}, raw, {
                percent: percent
              }), index, ev.items);
            }
            if (config.tooltip.nameFormatter) {
              item.name = config.tooltip.nameFormatter(item.name, _extends({}, raw, {
                percent: percent
              }), index, ev.items);
            }
          });
        });
      }
    } else {
      chart.tooltip(false);
    }

    // 下面这一句注释我还没看懂。
    // position若直接使用value导致图例点击某项隐藏，余下展示不为值和不为1
    this.geom = chart.intervalStack().position('y').color('x', config.colors).select(!!config.select);

    chart.render();

    selectGeom.call(this, config, this.geom, config.selectData);
  },
  destroy: function destroy() {
    this.geom = null;
  }
};
module.exports = exports['default'];