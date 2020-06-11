'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import Brush from '@antv/g2-brush';
import g2Factory from '../common/g2Factory';
import errorWrap from '../common/errorWrap';
import merge from '../common/merge';
import themes from '../themes/index';
import { propertyAssign, propertyMap, defaultPadding } from '../common/common';
import guide from '../common/guide';
import rectXAxis from '../common/rectXAxis';
import rectYAxis from '../common/rectYAxis';
import rectAutoTickCount from '../common/rectAutoTickCount';
import rectTooltip from '../common/rectTooltip';
import rectLegend from '../common/rectLegend';
import legendFilter from '../common/legendFilter';
import label from '../common/label';
import ResetButton from '../common/ResetButton';
import getGeomSizeConfig from '../common/geomSize';
import './G2Bar.scss';

export default /*#__PURE__*/errorWrap(g2Factory('G2Bar', {
  getDefaultConfig: function getDefaultConfig() {
    return {
      colors: themes.category_12,
      padding: ['auto', 'auto', 'auto', 'auto'],
      xAxis: {
        type: 'cat',
        labelFormatter: null, // 可以强制覆盖，手动设置label
        categories: null,
        autoRotate: false
      },
      yAxis: {
        labelFormatter: null, // 可以强制覆盖，手动设置label
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
  },
  beforeInit: function beforeInit(props) {
    var config = props.config;

    var newConfig = merge({}, this.defaultConfig, config);

    // TODO 处理padding
    return _extends({}, props, {
      padding: defaultPadding.apply(undefined, [props.padding || config.padding, newConfig].concat(this.defaultConfig.padding)),
      config: newConfig
    });
  },
  init: function init(chart, userConfig, data) {
    var _this = this;

    var config = userConfig;

    // 设置数据度量
    var defs = {
      x: propertyAssign(propertyMap.xAxis, {
        type: 'cat'
      }, config.xAxis),
      y: propertyAssign(propertyMap.yAxis, {
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

    rectAutoTickCount(chart, config, defs, !config.column);

    chart.source(data, defs);

    // 设置单个Y轴
    if (!config.facet) {
      rectYAxis.call(this, chart, config);
    }

    // 设置X轴
    rectXAxis.call(this, chart, config);

    // 设置图例
    rectLegend.call(this, chart, config, null, false, 'type');

    legendFilter.call(this, chart, config);

    // tooltip
    rectTooltip.call(this, chart, config, {
      crosshairs: config.polar ? undefined : {}
    });

    // 绘制辅助线，辅助背景区域
    guide(chart, config);

    // 设置坐标系：极坐标/直角坐标
    var chartCoord = config.polar ? chart.coord('polar', {
      innerRadius: config.innerRadius || 0
    }) : chart.coord();

    // 横向柱状图
    if (!config.column) {
      chartCoord.transpose();
    }

    // 玉玦图，需要手动添加 数据标记
    if (config.polar && !config.column && config.dataType !== 'g2') {
      this.rawData[0].data.forEach(function (d, i) {
        var x = d.x;
        if (Array.isArray(d)) {
          x = d[0];
        } else if (config.xAxis && config.xAxis.categories && config.xAxis.categories[i]) {
          x = config.xAxis.categories[i];
          // const y = isNaN(d) ? d[0] : d;
        }

        chart.guide().text({
          position: [x, 0],
          content: x + '  ',
          style: {
            fill: themes['widgets-axis-label'],
            textAlign: 'right'
          }
        });
      });
    }

    // chart.point().position('name*0').color('name').shape('circle');
    // chart.interval().position('name*value').color('name').shape('line').size(8); // 线状柱状图
    // chart.point().position('name*value').color('name').shape('circle');

    if (config.facet) {
      var facetConfig = _typeof(config.facet) === 'object' ? config.facet : {
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
            fontSize: themes['widgets-font-size-1'],
            textAlign: 'center',
            rotate: 90,
            fill: themes['widgets-axis-label']
          }
        },
        eachView: function eachView(view, facet) {
          var yAxisCustomConfig = null;

          // 为 labelFormatter 的第二个参数添加分面信息
          if (config.yAxis && config.yAxis.visible !== false) {
            var _ref = config.yAxis || {},
                labelFormatter = _ref.labelFormatter;

            if (labelFormatter) {
              yAxisCustomConfig = {
                label: {
                  formatter: function formatter() {
                    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                      args[_key] = arguments[_key];
                    }

                    args[1] = _extends({
                      facet: facet.colValue || facet.rowValue
                    }, args[1]);
                    return labelFormatter.apply(undefined, args);
                  }
                }
              };
            }
          }

          rectYAxis.call(self, view, config, 'y', yAxisCustomConfig);

          drawBar(view, config, config.colors, 'type*facet');
        }
      });
    } else {
      drawBar(chart, config, config.colors);
    }

    // if (config.stack) {
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

    chart.render();

    // 拖拽缩放
    if (config.zoom) {
      var button = new ResetButton(chart, this.language);
      this.resetButton = button;

      this.brush = new Brush({
        canvas: chart.get('canvas'),
        chart: chart,
        type: 'X',
        onBrushstart: function onBrushstart(startPoint) {
          chart.hideTooltip();
          chart.emit('zoom:start', startPoint);
        },

        onBrushmove: function onBrushmove() {
          chart.hideTooltip();
          button.show(_this.language);
        },
        onBrushend: function onBrushend(ev) {
          _this.brush.container.clear(); // clear the brush
          var type = _this.brush.type;
          var xScale = _this.brush.xScale;
          var yScale = _this.brush.yScale;
          // filter data

          if (type === 'X') {
            xScale && chart.filter(xScale.field, function (val) {
              return ev[xScale.field].indexOf(val) > -1;
            });
          } else if (type === 'Y') {
            yScale && chart.filter(yScale.field, function (val) {
              return ev[yScale.field].indexOf(val) > -1;
            });
          } else {
            xScale && chart.filter(xScale.field, function (val) {
              return ev[xScale.field].indexOf(val) > -1;
            });
            yScale && chart.filter(yScale.field, function (val) {
              return ev[yScale.field].indexOf(val) > -1;
            });
          }
          chart.repaint();

          chart.emit('zoom:end', ev);
        }
      });
    }
  },
  changeData: function changeData(chart, config, data) {
    chart.changeData(data);

    // 更新 brush 的 scale 实例，fix 数据更新后拖动缩放失效的问题。
    if (config.zoom && this.brush) {
      this.brush.xScale = chart.getXScale();
      this.brush.yScale = chart.getYScales()[0];
    }
  },
  destroy: function destroy() {
    // 销毁时需要额外销毁缩放重置按钮
    if (this.brush) {
      this.brush.destroy();
    }
    if (this.resetButton) {
      this.resetButton.destroy();
    }
  }
}));

function drawBar(chart, config, colors) {
  var field = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'type';
  var stack = config.stack,
      stackReverse = config.stackReverse,
      marginRatio = config.marginRatio,
      dodgeStack = config.dodgeStack,
      size = config.size;

  var geomStyle = config.geomStyle || {};
  var geom = chart.interval().position(['x', 'y']);

  if (dodgeStack) {
    geom = geom.color(field, colors).adjust([{
      type: 'dodge',
      marginRatio: marginRatio || 0, // 数值范围为 0 至 1，用于调整分组中各个柱子的间距
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
  }

  geom.style('x*y*type*extra', _extends({}, geomStyle));

  if (size) {
    var _geom;

    var sizeConfig = getGeomSizeConfig(size, 20, 'y', 'x*y*type*facet*extra');
    (_geom = geom).size.apply(_geom, sizeConfig);
  }

  label(geom, config);
}