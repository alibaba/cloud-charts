'use strict';

exports.__esModule = true;
exports.G2PieBase = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.getDrawPadding = getDrawPadding;

var _g2Factory = require('../common/g2Factory');

var _g2Factory2 = _interopRequireDefault(_g2Factory);

var _errorWrap = require('../common/errorWrap');

var _errorWrap2 = _interopRequireDefault(_errorWrap);

var _merge = require('../common/merge');

var _merge2 = _interopRequireDefault(_merge);

var _index = require('../themes/index');

var _index2 = _interopRequireDefault(_index);

var _common = require('../common/common');

require('./G2Pie.css');

var _rectTooltip = require('../common/rectTooltip');

var _rectTooltip2 = _interopRequireDefault(_rectTooltip);

var _rectLegend = require('../common/rectLegend');

var _rectLegend2 = _interopRequireDefault(_rectLegend);

var _label = require('../common/label');

var _label2 = _interopRequireDefault(_label);

var _g2Theme = require('../common/g2Theme');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function transformCoord(coord) {
  var transform = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var type = transform.type,
      param = transform.param;

  if (coord[type] && Array.isArray(param)) {
    coord[type].apply(coord, param);
  }
}

function selectGeom(geom, selectKey) {
  // if (!geom || !selectKey || !Array.isArray(this.data)) {
  if (!geom) {
    return;
  }

  // 清除选中效果
  geom.clearSelected();

  // 如果selectKey为假值，则只清空选中效果。
  if (!selectKey) {
    return;
  }

  // 使用内部方法直接选中，fix: 数据同时被更新时无法选中的问题
  geom.getShapes().forEach(function (shape) {
    var origin = shape.get('origin');
    if (origin && origin._origin && origin._origin.x === selectKey) {
      geom.setShapeSelected(shape);
    }
  });

  // // 找到对应的数据，设置选中
  // this.data.forEach((d) => {
  //   if (d.x === selectKey) {
  //     geom.setSelected(d);
  //   }
  // });
}

function paddingNumber(value) {
  return (0, _common.isInvalidNumber)(value) ? 0 : Number(value);
}

function getDrawPadding(drawPadding, labelConfig, defaultDrawPadding) {
  if (Array.isArray(drawPadding)) {
    return drawPadding;
  } else if (!(0, _common.isInvalidNumber)(drawPadding)) {
    return [drawPadding, drawPadding, drawPadding, drawPadding];
  } else if (labelConfig && labelConfig.visible !== false) {
    // 饼图使用 label 时，调整 drawPadding
    return defaultDrawPadding.map(function (p) {
      return Math.max(p, 48);
    });
  } else {
    return defaultDrawPadding;
  }
}

var G2PieBase = exports.G2PieBase = {
  getDefaultConfig: function getDefaultConfig() {
    return {
      colors: _index2.default.category_12,
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
      coord: null,
      autoSort: true,
      cycle: false,
      select: false,
      selectData: null,
      innerRadius: 0.8, // 内环半径大小，仅cycle为true时可用
      outerRadius: 0.8, // 饼图半径大小，初始化时可用
      drawPadding: [10, 10, 10, 10],
      label: false
    };
  },
  beforeInit: function beforeInit(props) {
    var config = props.config;

    var element = this.chartDom;
    var padding = props.padding || config.padding || this.defaultConfig.padding;
    var outerRadius = Math.max(Math.min(config.outerRadius || this.defaultConfig.outerRadius, 1), 0.01);
    var drawPadding = getDrawPadding(config.drawPadding, config.label, this.defaultConfig.drawPadding);

    // fix: padding 为 auto 时会计算错误
    var boxHeight = element.offsetHeight - paddingNumber(padding[0]) - paddingNumber(padding[2]);
    var boxWidth = element.offsetWidth - paddingNumber(padding[1]) - paddingNumber(padding[3]);
    // 饼本体大小，向下取整
    var diameter = Math.floor(boxHeight < boxWidth ? boxHeight * outerRadius : boxWidth * outerRadius);

    element.style.paddingTop = padding[0] + 'px';
    element.style.paddingRight = padding[1] + 'px';
    element.style.paddingBottom = padding[2] + 'px';
    element.style.paddingLeft = padding[3] + 'px';

    this.childrenDom = element.querySelector('.cloud-charts-children');
    if (this.childrenDom) {
      this.childrenDom.style.width = diameter + drawPadding[1] + drawPadding[3] + 'px';
      this.childrenDom.style.height = boxHeight + 'px';
    }

    // TODO 处理padding
    return _extends({}, props, {
      width: diameter + drawPadding[1] + drawPadding[3],
      height: diameter + drawPadding[0] + drawPadding[2],
      // forceFit: true,
      padding: drawPadding
    });
  },
  changeSize: function changeSize(chart, config, w, h) {
    var padding = config.padding || this.defaultConfig.padding;
    var outerRadius = Math.max(Math.min(config.outerRadius || this.defaultConfig.outerRadius, 1), 0.01);
    var drawPadding = getDrawPadding(config.drawPadding, config.label, this.defaultConfig.drawPadding);

    var boxHeight = h - paddingNumber(padding[0]) - paddingNumber(padding[2]);
    var boxWidth = w - paddingNumber(padding[1]) - paddingNumber(padding[3]);
    // 饼本体大小，向下取整
    var diameter = Math.floor(boxHeight < boxWidth ? boxHeight * outerRadius : boxWidth * outerRadius);

    if (this.childrenDom) {
      this.childrenDom.style.width = diameter + drawPadding[1] + drawPadding[3] + 'px';
      this.childrenDom.style.height = boxHeight + 'px';
    }

    chart.changeSize(diameter + drawPadding[1] + drawPadding[3], diameter + drawPadding[0] + drawPadding[2]);
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
  isChangeEqual: function isChangeEqual(objValue, othValue, key) {
    if (key === 'selectData' && objValue !== othValue) {
      selectGeom.call(this, this.geom, objValue);
      return true;
    }
  },
  init: function init(chart, userConfig, data) {
    var _this = this;

    var config = (0, _merge2.default)({}, this.defaultConfig, userConfig);

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
    var coord = chart.coord('theta', thetaConfig);

    if (config.coord) {
      var _ref = config.coord || {},
          transform = _ref.transform;

      if (Array.isArray(transform)) {
        transform.forEach(function (t) {
          transformCoord(coord, t);
        });
      } else if (transform && (typeof transform === 'undefined' ? 'undefined' : _typeof(transform)) === 'object') {
        transformCoord(coord, transform);
      }
    }

    // 计算得总数据
    var totalData = 0;
    data.forEach(function (d) {
      totalData += d.y;
    });
    this.totalData = totalData;

    var drawPadding = getDrawPadding(config.drawPadding, config.label, this.defaultConfig.drawPadding);

    // 设置图例
    _rectLegend2.default.call(this, chart, config, {
      autoCollapse: false,
      position: 'right',
      itemTpl: function itemTpl(value, itemColor, checked, index) {
        var _ref2 = config.legend || {},
            nameFormatter = _ref2.nameFormatter,
            valueFormatter = _ref2.valueFormatter,
            _ref2$showData = _ref2.showData,
            showData = _ref2$showData === undefined ? true : _ref2$showData;

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
      'g2-legend': _extends({}, _g2Theme.legendHtmlContainer, {
        position: 'static',
        overflow: 'auto',
        // inline flex items 不能使用百分比的margin/padding，设置为固定大小
        marginLeft: Math.max((0, _common.pxToNumber)(_index2.default['widgets-font-size-4']) - drawPadding[1], 0) + 'px'
      }),
      'g2-legend-list-item': _extends({}, _g2Theme.legendHtmlListItem, {
        marginRight: 0
      })
    }, true);

    // tooltip
    _rectTooltip2.default.call(this, chart, config, {
      showTitle: false,
      crosshairs: null
    }, function (ev) {
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

    // if (config.tooltip !== false && config.tooltip.visible !== false) {
    //   const tooltipCfg = {
    //     showTitle: false,
    //     // crosshairs: {},
    //     itemTpl: '<li data-index={index}>'
    //       + '<svg viewBox="0 0 6 6" class="g2-tooltip-marker"></svg>'
    //       + `<span class="g2-tooltip-item-name">{name}</span>${config.tooltip.showColon !== false ? ':' : ''}<span class="g2-tooltip-item-value">{value}</span></li>`,
    //   };
    //   chart.tooltip(tooltipCfg);
    //   if (config.tooltip.nameFormatter || config.tooltip.valueFormatter) {
    //     chart.on('tooltip:change', (ev) => {
    //       const raw = (this.rawData && this.rawData[0]) || {};
    //
    //       ev.items.forEach((item, index) => {
    //         const percent = numberDecimal(item.value / this.totalData, 4);
    //
    //         if (config.tooltip.valueFormatter) {
    //           item.value = config.tooltip.valueFormatter(item.value, {
    //             ...raw,
    //             percent,
    //           }, index, ev.items);
    //         }
    //         if (config.tooltip.nameFormatter) {
    //           item.name = config.tooltip.nameFormatter(item.name, {
    //             ...raw,
    //             percent,
    //           }, index, ev.items);
    //         }
    //       });
    //     });
    //   }
    // } else {
    //   chart.tooltip(false);
    // }

    // 下面这一句注释我还没看懂。
    // position若直接使用value导致图例点击某项隐藏，余下展示不为值和不为1
    this.geom = chart.intervalStack().position('y').color('x', config.colors).select(!!config.select);

    (0, _label2.default)(this.geom, config, 'y', {
      offset: 20,
      formatter: function formatter(v, item, index) {
        if (config.label.labelFormatter) {
          var percent = (0, _common.numberDecimal)(v / _this.totalData, 4);

          return config.label.labelFormatter(v, _extends({}, item, {
            percent: percent
          }), index);
        }
        return v;
      }
    });

    var geomStyle = config.geomStyle || {};
    this.geom.style('x*y*type*extra', _extends({}, geomStyle));

    chart.render();

    selectGeom.call(this, this.geom, config.selectData);
  },
  destroy: function destroy() {
    this.geom = null;
  }
};

exports.default = /*#__PURE__*/(0, _errorWrap2.default)((0, _g2Factory2.default)('G2Pie', G2PieBase));