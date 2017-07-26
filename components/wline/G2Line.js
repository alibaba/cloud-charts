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
    dateFormatter: 'HH:MM:ss', //上述type为datetime时，此字段生效
    labelFormatter: null //可以强制覆盖，手动设置label
  },
  yAxis: {
    labelFormatter: null, //可以强制覆盖，手动设置label
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
  spline: true,
  grid: false,
  symbol:true,
  zoom: false,
  // colors: COLORS,
  // padding: [0, 0, 0, 0],
};

export default {
  init(chart, userConfig, data) {
    const config = merge({}, defaultConfig, userConfig);

    let defs = {
      name: {
        type: "time"
      },
      value: {
        type: 'linear'
      },
      type: {
        type: 'cat'
      }
    };
    if (config.xAxis.type === 'datetime') {
      defs = merge({}, defs, !config.xAxis.labelFormatter ? {
        name: {
          mask: config.xAxis.dateFormatter
        }
      } : {});
    }
    console.log(defs);
    chart.source(data, defs);

    chart.axis('value', {
      title: null, // 不展示 xDim 对应坐标轴的标题
      line: {
        lineWidth: 0, // 设置线的宽度
      },
      tickLine: {
        lineWidth: 0
      },
      formatter:config.yAxis.labelFormatter,
      grid: {
        line: {
          stroke: '#DCDEE3',
          lineWidth: 1,
          lineDash: [4, 0]
        }
      },
      labels:{
        label: {
          fill: '#989898',
        }
      }
    });
    chart.axis('name', {
      title: null, // 不展示 xDim 对应坐标轴的标题
      tickLine: {
        lineWidth: 0
      },
      line:{
        stroke: '#DCDEE3',
      },
      formatter:config.xAxis.labelFormatter,
      labels:{
        label: {
          fill: '#989898',
        }
      }
    });



    // 区域、堆叠、平滑曲线
    if (config.area && config.stack) {
      chart.areaStack().position('name*value').color('type').shape(config.spline ? 'smooth' : 'area');
    } else if (config.area && !config.stack) {
      chart.area().position('name*value').color('type').shape(config.spline ? 'smooth' : 'area');
    } else {
      chart.line().position('name*value').color('type').shape(config.spline ? 'smooth' : 'line');
    }
    // 曲线默认点
    if (config.symbol && config.area && config.stack) {
      chart.point('stack').position('name*value').color('type').shape('circle').size(3);
    } else if (config.symbol && !(config.area && config.stack)) {
      chart.point().position('name*value').color('type').shape('circle').size(3);
    }

    // 设置图例
    if (config.legend) {
      chart.legend({
        position: config.legend.position,
        title: null,
        spacingX: 8,
        dx: -200
      });
    } else {
      chart.legend(false);
    }

    chart.render();
  }
};
