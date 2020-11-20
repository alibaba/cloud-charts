'use strict'; // import Brush from '@antv/g2-brush';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = void 0;

var _inheritsLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/inheritsLoose"));

var _Base2 = _interopRequireDefault(require("../common/Base"));

var _index = _interopRequireDefault(require("../themes/index"));

var _common = require("../common/common");

var _legendFilter = _interopRequireDefault(require("../common/legendFilter"));

var _rectXAxis = _interopRequireDefault(require("../common/rectXAxis"));

var _rectYAxis = _interopRequireDefault(require("../common/rectYAxis"));

var _rectTooltip = _interopRequireDefault(require("../common/rectTooltip"));

var _rectLegend = _interopRequireDefault(require("../common/rectLegend"));

var _guide = _interopRequireDefault(require("../common/guide"));

var _label = _interopRequireDefault(require("../common/label"));

var _rectZoom = _interopRequireDefault(require("../common/rectZoom"));

require("./index.scss");

// import ResetButton from '../common/ResetButton';
// import getGeomSizeConfig from '../common/geomSize';
var Wbar = /*#__PURE__*/function (_Base) {
  (0, _inheritsLoose2["default"])(Wbar, _Base);

  function Wbar() {
    var _this;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _Base.call.apply(_Base, [this].concat(args)) || this;
    _this.chartName = 'G2Bar';
    return _this;
  }

  var _proto = Wbar.prototype;

  _proto.getDefaultConfig = function getDefaultConfig() {
    return {
      colors: _index["default"].category_12,
      // padding: ['auto', 'auto', 'auto', 'auto'],
      xAxis: {
        type: 'cat',
        labelFormatter: null,
        // 可以强制覆盖，手动设置label
        categories: null,
        autoRotate: false
      },
      yAxis: {
        labelFormatter: null,
        // 可以强制覆盖，手动设置label
        max: null,
        min: null
      },
      legend: {
        align: 'left',
        nameFormatter: null // 可以强制覆盖，手动设置label

      },
      tooltip: {
        titleFormatter: null,
        nameFormatter: null,
        valueFormatter: null
      },
      column: true,
      dodgeStack: false,
      stack: false,
      stackReverse: true,
      marginRatio: 0,
      grid: false,
      zoom: false,
      facet: false,
      size: null,
      label: false,
      polar: false,
      innerRadius: 0
    };
  } // beforeInit(props) {
  //   const { config } = props;
  //   const newConfig = config;
  //
  //   // TODO 处理padding
  //   return Object.assign({}, props, {
  //     padding: defaultPadding(
  //       props.padding || config.padding,
  //       newConfig,
  //       ...this.defaultConfig.padding
  //     ),
  //     config: newConfig,
  //   });
  // }
  ;

  _proto.init = function init(chart, config, data) {
    // 设置数据度量
    var defs = {
      x: (0, _common.propertyAssign)(_common.propertyMap.xAxis, {// type: 'cat',
      }, config.xAxis),
      y: (0, _common.propertyAssign)(_common.propertyMap.yAxis, {
        type: 'linear',
        tickCount: 5
      }, config.yAxis),
      type: {
        type: 'cat',
        sync: true
      },
      facet: {
        sync: true
      }
    };
    chart.scale(defs);
    chart.data(data); // 设置单个Y轴

    if (!config.facet) {
      _rectYAxis["default"].call(this, chart, config);
    } // 设置X轴


    _rectXAxis["default"].call(this, chart, config); // 设置图例


    _rectLegend["default"].call(this, chart, config, null, false, 'type');

    _legendFilter["default"].call(this, chart); // tooltip


    _rectTooltip["default"].call(this, chart, config, {
      crosshairs: config.polar ? undefined : {}
    }); // 绘制辅助线，辅助背景区域


    (0, _guide["default"])(chart, config); // 设置坐标系：极坐标/直角坐标

    var chartCoord = config.polar ? chart.coordinate('polar', {
      innerRadius: config.innerRadius || 0
    }) : chart.coordinate(); // 横向柱状图

    if (!config.column) {
      chartCoord.transpose();
    } // 玉玦图，需要手动添加 数据标记


    if (config.polar && !config.column && config.dataType !== 'g2') {
      this.rawData[0].data.forEach(function (d, i) {
        var x = d.x;

        if (Array.isArray(d)) {
          x = d[0];
        } else if (config.xAxis && config.xAxis.categories && config.xAxis.categories[i]) {
          x = config.xAxis.categories[i]; // const y = isNaN(d) ? d[0] : d;
        }

        chart.annotation().text({
          position: [x, 0],
          content: x + "  ",
          style: {
            fill: _index["default"]['widgets-axis-label'],
            textAlign: 'right'
          }
        });
      });
    }

    if (config.facet) {
      var facetConfig = typeof config.facet === 'object' ? config.facet : {
        type: 'mirror',
        transpose: false,
        padding: [20, 0, 20, 0]
      };
      var self = this;
      chart.facet(facetConfig.type, {
        fields: ['facet'],
        transpose: facetConfig.transpose,
        padding: facetConfig.padding,
        rowTitle: {
          offsetX: 15,
          style: {
            fontSize: _index["default"]['widgets-font-size-1'],
            textAlign: 'center',
            rotate: 90,
            fill: _index["default"]['widgets-axis-label']
          }
        },
        eachView: function eachView(view, facet) {
          var yAxisCustomConfig = null; // 为 labelFormatter 的第二个参数添加分面信息

          if (config.yAxis && config.yAxis.visible !== false) {
            var _ref = config.yAxis || {},
                labelFormatter = _ref.labelFormatter;

            if (labelFormatter) {
              yAxisCustomConfig = {
                label: {
                  formatter: function formatter() {
                    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                      args[_key2] = arguments[_key2];
                    }

                    args[1] = Object.assign({
                      facet: facet.colValue || facet.rowValue
                    }, args[1]);
                    return labelFormatter();
                  }
                }
              };
            }
          }

          _rectYAxis["default"].call(self, view, config, 'y', yAxisCustomConfig);

          drawBar(view, config, config.colors, 'type*facet');
        }
      });
    } else {
      drawBar(chart, config, config.colors);
    } // if (config.stack) {
    //   chart.interval().position('x*y').color('type', config.colors).adjust([{
    //     type: 'stack',
    //     reverseOrder: !config.stackReverse, // 层叠顺序倒序
    //   }]);
    // } else {
    //   chart.interval().position('x*y').color('type', config.colors).adjust([{
    //     type: 'dodge',
    //     marginRatio: 0, // 数值范围为 0 至 1，用于调整分组中各个柱子的间距
    //   }]);
    // }
    // // 拖拽缩放
    // if (config.zoom) {
    //   const button = new ResetButton(chart, this.language);
    //   this.resetButton = button;
    //
    //   this.brush = new Brush({
    //     canvas: chart.get('canvas'),
    //     chart,
    //     type: 'X',
    //     onBrushstart(startPoint) {
    //       chart.hideTooltip();
    //       chart.emit('zoom:start', startPoint);
    //     },
    //     onBrushmove: () => {
    //       chart.hideTooltip();
    //       button.show(this.language);
    //     },
    //     onBrushend: ev => {
    //       this.brush.container.clear(); // clear the brush
    //       const { type } = this.brush;
    //       const { xScale } = this.brush;
    //       const { yScale } = this.brush;
    //       // filter data
    //       if (type === 'X') {
    //         xScale &&
    //           chart.filter(xScale.field, val => {
    //             return ev[xScale.field].indexOf(val) > -1;
    //           });
    //       } else if (type === 'Y') {
    //         yScale &&
    //           chart.filter(yScale.field, val => {
    //             return ev[yScale.field].indexOf(val) > -1;
    //           });
    //       } else {
    //         xScale &&
    //           chart.filter(xScale.field, val => {
    //             return ev[xScale.field].indexOf(val) > -1;
    //           });
    //         yScale &&
    //           chart.filter(yScale.field, val => {
    //             return ev[yScale.field].indexOf(val) > -1;
    //           });
    //       }
    //       chart.repaint();
    //
    //       chart.emit('zoom:end', ev);
    //     },
    //   });
    // }


    (0, _rectZoom["default"])(chart, config, this.language);
  } // changeData(chart: Chart, config: WbarConfig, data: any) {
  //   chart.changeData(data);
  //
  //   // // 更新 brush 的 scale 实例，fix 数据更新后拖动缩放失效的问题。
  //   // if (config.zoom && this.brush) {
  //   //   this.brush.xScale = chart.getXScale();
  //   //   this.brush.yScale = chart.getYScales()[0];
  //   // }
  // }
  // destroy() {
  //   // 销毁时需要额外销毁缩放重置按钮
  //   if (this.brush) {
  //     this.brush.destroy();
  //   }
  //   if (this.resetButton) {
  //     this.resetButton.destroy();
  //   }
  // }
  ;

  return Wbar;
}(_Base2["default"]);

exports["default"] = Wbar;
;

function drawBar(chart, config, colors, field) {
  if (field === void 0) {
    field = 'type';
  }

  var stack = config.stack,
      stackReverse = config.stackReverse,
      marginRatio = config.marginRatio,
      dodgeStack = config.dodgeStack; // const geomStyle = config.geomStyle || {};

  var geom = chart.interval().position(['x', 'y']);

  if (dodgeStack) {
    geom = geom.color(field, colors).adjust([{
      type: 'dodge',
      marginRatio: marginRatio || 0,
      // 数值范围为 0 至 1，用于调整分组中各个柱子的间距
      dodgeBy: 'dodge'
    }, {
      type: 'stack',
      reverseOrder: !stackReverse // 层叠顺序倒序

    }]);
  } else if (stack) {
    // 堆叠
    geom = geom.color(field, colors).adjust([{
      type: 'stack',
      reverseOrder: !stackReverse // 层叠顺序倒序

    }]);
  } else {
    // 分组
    geom = geom.color(field, colors).adjust([{
      type: 'dodge',
      marginRatio: marginRatio || 0 // 数值范围为 0 至 1，用于调整分组中各个柱子的间距

    }]);
  } // geom.style('x*y*type*extra', {
  //   ...geomStyle,
  // });
  //
  // if (size) {
  //   const sizeConfig = getGeomSizeConfig(size, 20, 'y', 'x*y*type*facet*extra');
  //   geom.size(...sizeConfig);
  // }


  (0, _label["default"])(geom, config);
}