'use strict';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _inheritsLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/inheritsLoose"));

var _layout = _interopRequireDefault(require("@antv/g2/esm/chart/layout"));

var _Base2 = _interopRequireDefault(require("../common/Base"));

var _index = _interopRequireDefault(require("../themes/index"));

var _common = require("../common/common");

require("./index.scss");

var _rectTooltip = _interopRequireDefault(require("../common/rectTooltip"));

var _rectLegend = _interopRequireDefault(require("../common/rectLegend"));

var _label = _interopRequireDefault(require("../common/label"));

// import { Controller } from '@antv/g2/esm/chart/controller/base';
var Wpie = /*#__PURE__*/function (_Base) {
  (0, _inheritsLoose2["default"])(Wpie, _Base);

  function Wpie() {
    var _this;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _Base.call.apply(_Base, [this].concat(args)) || this;
    _this.chartName = 'G2Pie';
    _this.totalData = 0;
    _this.geom = null;
    return _this;
  }

  var _proto = Wpie.prototype;

  _proto.getDefaultConfig = function getDefaultConfig() {
    return {
      colors: _index["default"].category_12,
      // padding: [20, 20, 20, 20],
      legend: {
        position: 'right',
        align: '',
        nameFormatter: null,
        // 可以强制覆盖，手动设置label
        valueFormatter: null
      },
      tooltip: {
        nameFormatter: null,
        valueFormatter: null
      },
      // coord: null,
      autoSort: true,
      cycle: false,
      select: false,
      // selectData: null,
      innerRadius: 0.8,
      // 内环半径大小，仅cycle为true时可用
      outerRadius: 0.8,
      // 饼图半径大小，初始化时可用
      // drawPadding: [10, 10, 10, 10],
      label: false
    };
  } // beforeInit(props) {
  //   const { config } = props;
  //   const element = this.chartDom;
  //   const padding = props.padding || config.padding || this.defaultConfig.padding;
  //   const outerRadius = Math.max(Math.min(config.outerRadius || this.defaultConfig.outerRadius, 1), 0.01);
  //   const drawPadding = getDrawPadding(config.drawPadding, config.label, this.defaultConfig.drawPadding);
  //
  //   // fix: padding 为 auto 时会计算错误
  //   const boxHeight = element.offsetHeight - paddingNumber(padding[0]) - paddingNumber(padding[2]);
  //   const boxWidth = element.offsetWidth - paddingNumber(padding[1]) - paddingNumber(padding[3]);
  //   // 饼本体大小，向下取整
  //   const diameter = Math.floor(boxHeight < boxWidth ? boxHeight * outerRadius : boxWidth * outerRadius);
  //
  //   element.style.paddingTop = `${padding[0]}px`;
  //   element.style.paddingRight = `${padding[1]}px`;
  //   element.style.paddingBottom = `${padding[2]}px`;
  //   element.style.paddingLeft = `${padding[3]}px`;
  //
  //   this.childrenDom = element.querySelector('.cloud-charts-children');
  //   if (this.childrenDom) {
  //     this.childrenDom.style.width = `${diameter + drawPadding[1] + drawPadding[3]}px`;
  //     this.childrenDom.style.height = `${boxHeight}px`;
  //   }
  //
  //   // TODO 处理padding
  //   return Object.assign({}, props, {
  //     width: diameter + drawPadding[1] + drawPadding[3],
  //     height: diameter + drawPadding[0] + drawPadding[2],
  //     // forceFit: true,
  //     padding: drawPadding,
  //   });
  // },
  // changeSize(chart, config, w, h) {
  //   const padding = config.padding || this.defaultConfig.padding;
  //   const outerRadius = Math.max(Math.min(config.outerRadius || this.defaultConfig.outerRadius, 1), 0.01);
  //   const drawPadding = getDrawPadding(config.drawPadding, config.label, this.defaultConfig.drawPadding);
  //
  //   const boxHeight = h - paddingNumber(padding[0]) - paddingNumber(padding[2]);
  //   const boxWidth = w - paddingNumber(padding[1]) - paddingNumber(padding[3]);
  //   // 饼本体大小，向下取整
  //   const diameter = Math.floor(boxHeight < boxWidth ? boxHeight * outerRadius : boxWidth * outerRadius);
  //
  //   if (this.childrenDom) {
  //     this.childrenDom.style.width = `${diameter + drawPadding[1] + drawPadding[3]}px`;
  //     this.childrenDom.style.height = `${boxHeight}px`;
  //   }
  //
  //   chart.changeSize(diameter + drawPadding[1] + drawPadding[3], diameter + drawPadding[0] + drawPadding[2]);
  // },
  ;

  _proto.changeData = function changeData(chart, config, data) {
    // 更新数据总和值，保证百分比的正常
    var totalData = 0;
    data.forEach(function (d) {
      totalData += d.y;
    });
    this.totalData = totalData; // 不要忘记排序的状态

    if (config.autoSort) {
      data.sort(function (a, b) {
        return b.y - a.y;
      });
    } // 更新挂载的转换数据
    // this.data = data;


    chart.changeData(data);
  };

  // isChangeEqual(objValue: any, othValue: any, key: string) {
  //   if (key === 'selectData' && objValue !== othValue) {
  //     selectGeom.call(this, this.geom, objValue);
  //     return true;
  //   }
  //   return undefined;
  // }
  _proto.init = function init(chart, config, data) {
    var _this2 = this;

    var defs = {
      type: {
        type: 'cat'
      }
    };

    if (config.autoSort) {
      data.sort(function (a, b) {
        return b.y - a.y;
      });
    } // 挂载转换后的数据
    // this.data = data;


    chart.scale(defs);
    chart.data(data); // 重要：绘制饼图时，必须声明 theta 坐标系

    var thetaConfig = {
      // radius: 1, // 设置饼图的为100% 大小，具体大小改变在 beforeInit 中diameter的值，目前为0.8
      radius: Math.max(Math.min(config.outerRadius, 1), 0.01)
    };

    if (config.cycle) {
      thetaConfig.innerRadius = Math.max(Math.min(config.innerRadius, 1), 0);
    } // coordinate translate 操作会导致饼图变形，暂时换一种方式实现

    /*const coord = */


    chart.coordinate('theta', thetaConfig); // if (config.coord) {
    //   const { transform } = config.coord || {};
    //
    //   if (Array.isArray(transform)) {
    //     transform.forEach((t) => {
    //       transformCoord(coord, t);
    //     });
    //   } else if (transform && typeof transform === 'object') {
    //     transformCoord(coord, transform);
    //   }
    // }
    // 计算得总数据

    var totalData = 0;
    data.forEach(function (d) {
      totalData += d.y;
    });
    this.totalData = totalData; // const drawPadding = getDrawPadding(config.drawPadding, config.label, this.defaultConfig.drawPadding);
    // 设置图例

    _rectLegend["default"].call(this, chart, config, {// autoCollapse: false,
      // position: 'right',
      // itemTpl: (value, itemColor, checked, index) => {
      //   const { nameFormatter, valueFormatter, showData = true } = config.legend || {};
      //
      //   const item = (this.data && this.data[index]) || {};
      //   const raw = (this.rawData && this.rawData[0]) || {};
      //   const percent = numberDecimal(item.y / this.totalData, 4);
      //
      //   const result = nameFormatter ? nameFormatter(value, {
      //     ...raw,
      //     percent,
      //     itemColor,
      //     checked,
      //   }, index) : value;
      //
      //   if (showData) {
      //     const number = valueFormatter ? valueFormatter(item.y, {
      //       ...raw,
      //       percent,
      //       itemColor,
      //       checked,
      //     }, index) : item.y;
      //     return `${'<li class="g2-legend-list-item item-{index} {checked}" data-color="{originColor}" data-value="{originValue}">' +
      //     '<i class="g2-legend-marker" style="background-color:{color};"></i>' +
      //     '<span class="g2-legend-text">'}${result}</span>` + `<span class="g2-legend-value">${number}</span></li>`;
      //   }
      //
      //   return `${'<li class="g2-legend-list-item item-{index} {checked}" data-color="{originColor}" data-value="{originValue}">' +
      //   '<i class="g2-legend-marker" style="background-color:{color};"></i>' +
      //   '<span class="g2-legend-text">'}${result}</span></li>`;
      // },
      // 'g2-legend': {
      //   ...legendHtmlContainer,
      //   position: 'static',
      //   overflow: 'auto',
      //   // inline flex items 不能使用百分比的margin/padding，设置为固定大小
      //   marginLeft: `${Math.max(pxToNumber(themes['widgets-font-size-4']) - drawPadding[1], 0)}px`,
      // },
      // 'g2-legend-list-item': {
      //   ...legendHtmlListItem,
      //   marginRight: 0,
      // },
    }, true); // tooltip


    _rectTooltip["default"].call(this, chart, config, {
      showTitle: false,
      showMarkers: false,
      showCrosshairs: false,
      shared: false
    }, function (ev) {
      var raw = _this2.rawData && _this2.rawData[0] || {};
      var items = ev.data.items;
      items.forEach(function (item, index) {
        var percent = (0, _common.numberDecimal)(item.value / _this2.totalData, 4);

        if (typeof config.tooltip === 'boolean') {
          return;
        }

        if (config.tooltip.valueFormatter) {
          item.value = config.tooltip.valueFormatter(item.value, (0, _extends2["default"])({}, raw, {
            percent: percent
          }), index, ev.items);
        }

        if (config.tooltip.nameFormatter) {
          item.name = config.tooltip.nameFormatter(item.name, (0, _extends2["default"])({}, raw, {
            percent: percent
          }), index, ev.items);
        }
      });
    }, {
      showTitle: false,
      showMarkers: false,
      showCrosshairs: false,
      shared: false
    });

    this.geom = chart.interval().position('y').color('x', config.colors).adjust('stack'); // .select(!!config.select);

    var labelField = 'y';
    (0, _label["default"])(this.geom, config, labelField, null, undefined, false, {
      offset: 20,
      content: function (v, item, index) {
        if (typeof config.label === 'boolean') {
          return v[labelField];
        }

        if (config.label.labelFormatter) {
          var percent = (0, _common.numberDecimal)(v[labelField] / _this2.totalData, 4);
          return config.label.labelFormatter(v[labelField], (0, _extends2["default"])({}, item, {
            percent: percent
          }), index);
        }

        return v[labelField];
      }
    });
    chart.setLayout(function () {
      // 先运行默认 layout
      (0, _layout["default"])(chart);
      /*
      const axis = chart.getController('axis');
      const legend = chart.getController('legend');
      const annotation = chart.getController('annotation');
      const slider = chart.getController('slider');
      const scrollbar = chart.getController('scrollbar');
       // 根据最新的 coordinate 重新布局组件
      [axis, slider, scrollbar, legend, annotation].forEach((controller: Controller) => {
        if (controller) {
          controller.layout();
        }
      });
      */

      var radius = chart.getCoordinate().radius;
      var legend = chart.getController('legend').getComponents()[0].component; // 计算一个合适的 legend 位置
      // 1. legend 的宽高

      var legendBBox = legend.getLayoutBBox(); // 2. 饼的宽高

      var pieSize = Math.min(chart.width, chart.height) * radius; // coordinate radius
      // debugger
      // console.log(legendBBox, legend.cfg.padding);

      var legendPadding = legend.cfg.padding;
      var emptyAreaHalfWidth = (chart.width - pieSize - (legendBBox.width + legendPadding[1] + legendPadding[3])) / 2; // 下面的 x y 就是数学题了，可视化中所有定位的参考点是自己的左上角。
      // TODO 根据不同方向设置不同的坐标

      legend.update({
        x: emptyAreaHalfWidth + pieSize + legendPadding[3] // x: chart.width - (chart.width / 2 - pieSize / 2 ) / 2 - legendBBox.width / 2,
        // y: chart.height / 2 - legendBBox.height / 2,

      });
    });
    chart.on('afterrender', function () {
      var childDom = _this2.chartDom && _this2.chartDom.querySelector('.cloud-charts-children');

      if (childDom) {
        var centerPoint = chart.getCoordinate().getCenter();
        childDom.style.left = centerPoint.x + "px";
        childDom.style.top = centerPoint.y + "px";
      }
    }); // const geomStyle = config.geomStyle || {};
    // this.geom.style('x*y*type*extra', {
    //   ...geomStyle,
    // });
    // selectGeom.call(this, this.geom, config.selectData);
  };

  return Wpie;
}(_Base2["default"]);

var _default = Wpie;
exports["default"] = _default;