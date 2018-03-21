'use strict';

import merge from '../utils/merge';
import { color, size } from '../theme/normal';
import { propertyAssign, propertyMap } from '../chartCommon/common';
import guide from '../chartCommon/guide';
import rectTooltip from '../chartCommon/rectTooltip';
import './G2Bar.scss';

const defaultConfig = {
  colors: color.category_12,
  padding: [40, 5, 32, 44],
  xAxis: {
    type: 'cat',
    labelFormatter: null, //可以强制覆盖，手动设置label
    categories: null,
    autoRotate: false,
  },
  yAxis: {
    labelFormatter: null, //可以强制覆盖，手动设置label
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
  column: true,
  stack: false,
  stackReverse: true,
  grid: false,
  // labels: false,
  polar: false,
};

export default {
  beforeInit(props) {
    const {config} = props;
    const newConfig = merge({}, defaultConfig, config);

    // TODO 处理padding
    return Object.assign({}, props, {
      padding: props.padding || config.padding || (newConfig.legend ? defaultConfig.padding : [16, 5, 32, 44]),
      config: newConfig
    });
  },
  init(chart, userConfig, data, rawData) {
    const config = userConfig;

    const defs = {
      x: propertyAssign(propertyMap.xAxis, {
        type: 'cat',
      }, config.xAxis),
      y: propertyAssign(propertyMap.yAxis, {
        type: 'linear',
        tickCount: 5
      }, config.yAxis),
      type: {
        type: 'cat'
      },
    };

    chart.source(data, defs);

    const yAxis = {
      title: null, // 不展示坐标轴的标题
      label:{
        formatter:config.yAxis.labelFormatter,
      }
    };


    const xAxis = {
      title: null, // 不展示坐标轴的标题
      label:{
        autoRotate: config.xAxis.autoRotate,
        formatter:config.xAxis.labelFormatter,
      }
    };

    // 网格线
    if (config.grid) {
      xAxis.grid = {
        lineStyle: {
          stroke: color.colorN13,
          // lineWidth: 1,
          // lineDash: null
        },
        // TODO 双轴情况下，需要处理
        // hideFirstLine: true
      };
    }
    chart.axis('x', xAxis);
    chart.axis('y', yAxis);

    // 设置图例
    if (config.legend) {
      chart.legend({
        useHtml: true,
        title: null,
        position: 'top',
        // 这个属性文档里没有，设置为false可以让图例不居中，再手动设置定位样式
        autoPosition: false,
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
          top: size.s3,
        }, config.legend.align === 'right' ? { right: 0 } : { left: 0 }),
      });
    } else {
      chart.legend(false);
    }

    // tooltip
    rectTooltip.call(this, chart, config);

    // 绘制辅助线，辅助背景区域
    guide(chart, config);

    // if (config.polar) {
      // chart.coord('theta', {
      //   inner: 0.6
      // });
      //
      // chart.point().position('name*0').color('name').shape('circle');
      // chart.interval().position('name*value').color('name').shape('line').size(8); // 线状柱状图
      // chart.point().position('name*value').color('name').shape('circle');
    // } else {
      // 横向柱状图
      if (!config.column) {
        chart.coord().transpose();
      }
      // 堆叠
      if (config.stack) {
        chart.interval().position('x*y').color('type', config.colors).adjust([{
          type: 'stack',
          reverseOrder: !config.stackReverse, // 层叠顺序倒序
        }]);
      } else {
        chart.interval().position('x*y').color('type', config.colors).adjust([{
          type: 'dodge',
          marginRatio: 0, // 数值范围为 0 至 1，用于调整分组中各个柱子的间距
        }]);
      }
    // }

    chart.render();
  }
};
