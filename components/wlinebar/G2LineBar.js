'use strict';

import merge from '../utils/merge';
import { color, size } from '../theme/normal';
import { propertyAssign, getDataIndexColor, propertyMap, noop } from '../chartCommon/common';
import highchartsDataToG2Data from '../chartCommon/dataAdapter';
import guide from '../chartCommon/guide';
import rectTooltip from '../chartCommon/rectTooltip';
import './G2LineBar.scss';

const defaultConfig = {
  lineColors: color.category_12.slice(1),
  barColors: color.linear_10,
  padding: [40, 45, 32, 44],
  xAxis: {
    type: 'timeCat', // 默认为线性
    mask: 'YYYY-MM-DD HH:mm:ss', // 上述type为time时，此字段生效
    labelFormatter: null, // 可以强制覆盖，手动设置label
    categories: null,
    autoRotate: false,
    max: null,
    min: null,
  },
  yAxis: {
    labelFormatter: null, // 可以强制覆盖，手动设置label
    max: null,
    min: null,
  },
  legend: {
    align: 'left',
    nameFormatter: null, //可以强制覆盖，手动设置label
  },
  tooltip: {
    titleFormatter: null,
    nameFormatter: null,
    valueFormatter: null,
  },
  area: false,
  stack: false, // 仅Area有效
  stackReverse: true,
  spline: false,
  grid: false,
  symbol: false,
  // TODO
  // zoom: false,
  // labels: false,
  // mini: false,
  // dataConfig: {
  //   nameKey: 'name',
  //   valueKey: 'value',
  //   // valueKey: ['value1', 'value2'],
  //   typeKey: 'type'
  // }
};

export default {
  beforeInit(props) {
    const { config } = props;
    const newConfig = merge({}, defaultConfig, config);
    // TODO 处理padding
    return Object.assign({}, props, {
      padding: props.padding || config.padding || (newConfig.legend ? defaultConfig.padding : [16, 45, 32, 44]),
      config: newConfig
    });
  },
  init(chart, userConfig, data) {
    const config = userConfig;

    const rawLineData = [];
    const rawBarData = [];
    data.forEach((d) => {
      if (d.type === 'line') {
        rawLineData.push(d);
      } else if (d.type === 'bar') {
        rawBarData.push(d);
      }
    });

    const lineData = highchartsDataToG2Data(rawLineData, config);
    const barData = highchartsDataToG2Data(rawBarData, config);

    const defs = {
      x: propertyAssign(propertyMap.xAxis, {
        type: 'cat',
      }, config.xAxis),
      type: {
        type: 'cat'
      }
    };

    if (Array.isArray(config.yAxis)) {
      config.yAxis.forEach((axis, yIndex) => {
        defs[`y${yIndex}`] = propertyAssign(propertyMap.yAxis, {
          type: 'linear',
          tickCount: 5
        }, axis);
      });
    } else {
      defs.y = propertyAssign(propertyMap.yAxis, {
        type: 'linear',
        tickCount: 5,
        // 单轴时，必须同步度量，否则会两个度量叠加在一起
        sync: true
      }, config.yAxis);
    }

    chart.scale(defs);

    const xAxis = {
      title: null, // 不展示坐标轴的标题
      label: {
        autoRotate: config.xAxis.autoRotate,
        formatter: config.xAxis.labelFormatter,
      }
    };

    // 网格线
    if (config.grid) {
      xAxis.grid = {
        lineStyle: {
          stroke: color.colorN13,
          lineWidth: 1,
          // lineDash: null
        },
        // hideFirstLine: true
      };
    }
    chart.axis('x', xAxis);

    if (Array.isArray(config.yAxis)) {
      config.yAxis.forEach((axis, yIndex) => {
        const axisColor = getDataIndexColor(config.lineColors, rawLineData, yIndex) || getDataIndexColor(config.barColors, rawBarData, yIndex) || color.colorN16;
        const yAxisLine = {
          title: null, // 不展示坐标轴的标题
          line: {
            stroke: axisColor
          },
          label: {
            formatter: axis.labelFormatter,
          }
        };
        if (yIndex !== 0) {
          yAxisLine.grid = null;
          // TODO 可能需要移动位置？
          yAxisLine.position = 'right';
        }

        chart.axis(`y${yIndex}`, yAxisLine);
      });
    } else {
      const yAxisLine = {
        title: null, // 不展示坐标轴的标题
        label: {
          formatter: config.yAxis.labelFormatter,
        }
      };

      chart.axis('y', yAxisLine);
    }

    // 设置图例
    if (config.legend) {
      chart.legend({
        useHtml: true,
        title: null,
        position: 'top',
        // 这个属性文档里没有，设置为false可以让图例不居中，再手动设置定位样式
        autoPosition: false,
        onHover: noop,
        itemTpl: (value, color, checked, index) => {
          const item = (this.rawData && this.rawData[index]) || {};
          const result = config.legend.nameFormatter ? config.legend.nameFormatter(value, {
            ...item,
            color,
            checked
          }, index) : value;
          return '<li class="g2-legend-list-item item-{index} {checked}" data-color="{originColor}" data-value="{originValue}">' +
            '<i class="g2-legend-marker" style="background-color:{color};"></i>' +
            '<span class="g2-legend-text">' + result + '</span></li>';
        },
        'g2-legend': Object.assign({
          display: 'inline-block',
          position: 'relative',
          textAlign: 'left',
          top: size.s3,
        }, config.legend.align === 'right' ? { marginLeft: size.s3 } : { marginRight: size.s3 }),
      });
      // hack 图例的位置，仅在初始化时处理一遍
      setTimeout(() => {
        const parent = this.chartDom.querySelector('.g2-legend').parentNode;
        if (parent) {
          parent.style.textAlign = config.legend.align === 'right' ? 'right' : 'left';
        }
      }, 100);
    } else {
      chart.legend(false);
    }

    // tooltip
    rectTooltip.call(this, chart, config);

    // 绘制辅助线，辅助背景区域
    guide(chart, config);

    // 正式开始绘图，创建两个不同的view
    const barView = chart.view();
    barView.source(barData);
    this.barView = barView;

    const lineView = chart.view();
    lineView.source(lineData);
    this.lineView = lineView;

    const lineShape = config.spline ? 'smooth' : 'line';
    const areaShape = config.spline ? 'smooth' : 'area';

    if (Array.isArray(config.yAxis)) {
      config.yAxis.forEach((asix, yIndex) => {
        if (getDataIndexColor(config.barColors, rawBarData, yIndex)) {
          drawBar(barView, config, `y${yIndex}`);
        }
        if (getDataIndexColor(config.lineColors, rawLineData, yIndex)) {
          drawLine(lineView, config, lineShape, areaShape, `y${yIndex}`);
        }
      });
    } else {
      drawBar(barView, config);
      drawLine(lineView, config, lineShape, areaShape);
    }

    chart.render();
  },
  changeData(chart, userConfig, data) {
    const rawLineData = [];
    const rawBarData = [];
    data.forEach((d) => {
      if (d.type === 'line') {
        rawLineData.push(d);
      } else if (d.type === 'bar') {
        rawBarData.push(d);
      }
    });

    const lineData = highchartsDataToG2Data(rawLineData, userConfig);
    const barData = highchartsDataToG2Data(rawBarData, userConfig);

    this.barView && this.barView.changeData(barData);
    this.lineView && this.lineView.changeData(lineData);
  }
};

function drawBar(chart, config, yAxisKey = 'y') {
  if (config.stack) {
    chart.interval().position(['x', yAxisKey]).color('type', config.barColors).adjust([{
      type: 'stack',
      reverseOrder: !config.stackReverse, // 层叠顺序倒序
    }]);
  } else {
    chart.interval().position(['x', yAxisKey]).color('type', config.barColors).adjust([{
      type: 'dodge',
      marginRatio: 0, // 数值范围为 0 至 1，用于调整分组中各个柱子的间距
    }]);
  }
}

function drawLine(chart, config, lineShape, areaShape, yAxisKey = 'y') {
  if (config.area && config.stack) {
    chart.areaStack().position(['x', yAxisKey]).color('type', config.lineColors).shape(areaShape).active(false);
    chart.lineStack().position(['x', yAxisKey]).color('type', config.lineColors).shape(lineShape).style({
      lineJoin: 'round'
    });
  } else if (config.area && !config.stack) {
    chart.area().position(['x', yAxisKey]).color('type', config.lineColors).shape(areaShape).active(false);
    chart.line().position(['x', yAxisKey]).color('type', config.lineColors).shape(lineShape).style({
      lineJoin: 'round'
    });
  } else {
    chart.line().position(['x', yAxisKey]).color('type', config.lineColors).shape(lineShape).style({
      lineJoin: 'round'
    });
  }
  // 曲线默认点
  if (config.symbol && config.area && config.stack) {
    chart.point().adjust('stack').position(['x', yAxisKey]).color('type', config.lineColors).shape('circle').size(3).active(false);
  } else if (config.symbol) {
    chart.point().position(['x', yAxisKey]).color('type', config.lineColors).shape('circle').size(3).active(false);
  }
}
