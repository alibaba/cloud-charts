'use strict';

import COLORS from '../chartCommon/colors';
import merge from '../utils/merge';
import G2 from 'g2';
import './index.scss';

// const G2Line = createG2((chart, configs, data) => {
//   let frame = new G2.Frame(data);
//   frame = G2.Frame.combineColumns(frame, configs.keys, 'value', 'type', ['time']);
//   chart.source(frame, {
//     time: {
//       type: "time",
//       // mask: "mm-dd"
//     },
//     value: {
//       type: 'linear'
//     }
//   });
//
//   chart.line().position('time*value').color('type').shape('line');
//   chart.render();
// });

// //全局G2主题设置
// const theme = G2.Util.mix(true, {}, G2.Theme, {
//   // animate: false,
//   colors: {
//     'default': COLORS
//   },
//   shape: {
//     line: {
//       lineWidth: 2
//     }
//   }
//   // 具体的配置项详见 https://antv.alipay.com/g2/api/global.html
// });
// G2.Global.setTheme(theme); // 将主题设置为用户自定义的主题

// // 图表唯一id
// let uniqueId = 0;
// function generateUniqueId() {
//   return `react-g2-${uniqueId++}`;
// }

let defaultConfig = {
  xAxis: {
    type: 'linear', //默认为线性
    dateFormatter: '%m-%d', //上述type为datetime时，此字段生效
    labelFormatter: null, //可以强制覆盖，手动设置label
    // tooltipFormatter: null, //手动设置tooltip上X值的格式
    // categories: null,
    // max: null,
    // min: null,
    // lineWidth: 1
  },
  yAxis: {
    labelFormatter: null, //可以强制覆盖，手动设置label
    // tooltipFormatter: null, //手动设置tooltip上Y值的格式
    max: null,
    min: null,
    // bgArea: [], // TODO 辅助区域后期需要加上
    // lineWidth: 0
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
  area: false,
  stack: false,//仅Area有效
  spline: false,
  grid: false,
  symbol:false,
  zoom: false,
  // colors: COLORS,
  // padding: [0, 0, 0, 0],
};

export default {
  init(chart, userConfig, data) {
    const config = merge({}, defaultConfig, userConfig);

    chart.source(data, {
      name: {
        type: "time",
        mask: "HH:MM:ss"
      },
      value: {
        type: 'linear'
      },
      type: {
        type: 'cat'
      }
    });

    chart.line().position('name*value').color('type').shape('line');
    chart.render();
  }
};
