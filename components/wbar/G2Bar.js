'use strict';

import COLORS from '../chartCommon/colors';
import merge from '../utils/merge';
import G2 from 'g2';
import './index.scss';

let defaultConfig = {
  xAxis: {
    labelFormatter: null //可以强制覆盖，手动设置label
  },
  yAxis: {
    labelFormatter: null, //可以强制覆盖，手动设置label
    max: null,
    min: null,
    // bgArea: [], // TODO 辅助区域后期需要加上
  },
  legend: {
    position: 'top',
    labelFormatter: null, //可以强制覆盖，手动设置label
  },
  tooltip: {
    titleFormatter: null,
    nameFormatter: null,
    valueFormatter: null,
  },
  // clickable: false,
  // type: 'line',
  stack: false,
  grid: false,
  column: false
};

export default {
  init(chart, userConfig, data) {
    const config = merge({}, defaultConfig, userConfig);

    let defs = {
      type: {
        type: 'cat'
      },
      value: {
        max: config.yAxis.max, // 自定义最大值
        min: config.yAxis.min // 自定义最小值
      },
    };

    chart.source(data, defs);

    let valueAxis = {
      title: null, // 不展示 xDim 对应坐标轴的标题
      line: {
        lineWidth: 0, // 设置线的宽度
      },
      tickLine: {
        lineWidth: 0
      },
      formatter: config.yAxis.labelFormatter,
      grid: {
        line: {
          stroke: '#DCDEE3',
          lineWidth: 1,
          lineDash: [4, 0]
        }
      },
      labels: {
        label: {
          fill: '#989898',
        }
      }
    };


    let nameAxis = {
      title: null, // 不展示 xDim 对应坐标轴的标题
      tickLine: {
        lineWidth: 0
      },
      line: {
        stroke: '#DCDEE3',
      },
      formatter: config.xAxis.labelFormatter,
      labels: {
        label: {
          fill: '#989898',
        }
      }
    };

    // 网格线
    if (config.grid) {
      valueAxis = merge({}, valueAxis, {
        line: {
          lineWidth: 1, // 设置线的宽度
          stroke: '#DCDEE3',
        }
      })
      nameAxis = merge({}, nameAxis, {
        grid: {
          line: {
            stroke: '#DCDEE3',
            lineWidth: 1,
            lineDash: [4, 0]
          }
        },
      });
    }
    chart.axis('value', valueAxis);
    chart.axis('name', nameAxis);


    // 横向柱状图
    if (config.column) {
      chart.coord('rect').transpose();
    }

    // 堆叠
    if (config.stack) {
      chart.intervalStack().position('name*value').color('type');
    } else {
      chart.intervalDodge().position('name*value').color('type');
    }

    // 设置图例
    if (config.legend) {
      chart.legend({
        position: config.legend.position,
        title: null,
        spacingX: 8
      });
    } else {
      chart.legend(false);
    }


    chart.render();
  }
};
