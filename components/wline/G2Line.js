'use strict';

import COLORS from '../chartCommon/colors';
import merge from '../utils/merge';
import G2 from 'g2';
import './G2Line.scss';
const Util = G2.Util;

import {g2LegendFilter} from '../common';

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
  padding: [32, 5, 32, 45],
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
    align: 'left',
    nameFormatter: null, //可以强制覆盖，手动设置label
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
  dataConfig: {
    nameKey: 'name',
    valueKey: 'value',
    // valueKey: ['value1', 'value2'],
    typeKey: 'type'
  }
};

export default {
  beforeInit(props) {
    const {config, plotCfg} = props;
    plotCfg.margin = config.padding || defaultConfig.padding;
    return props;
  },
  init(chart, userConfig, data) {
    const config = merge({}, defaultConfig, userConfig);

    if (config.zoom) {
      chart.setMode('select'); // 开启框选模式
      chart.select('rangeX'); // 选择框选交互形式
    }

    let defs = {
      name: {
        //TODO 这里居然写死了类型。。
        type: "time"
      },
      value: {
        type: 'linear',
        max: config.yAxis.max, // 自定义最大值
        min: config.yAxis.min // 自定义最小值
      },
      type: {
        type: 'cat'
      }
    };
    if (config.xAxis.type === 'datetime') {
      defs = merge({}, defs, config.xAxis.dateFormatter ? {
        name: {
          mask: config.xAxis.dateFormatter
        }
      } : {});
    }

    chart.source(data, defs);

    let valueAxis = {
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
    };
    let nameAxis = {
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
    };

    // 网格线
    if (config.grid) {
      valueAxis = merge({}, valueAxis, {
        line: {
          lineWidth: 1, // 设置线的宽度
          stroke: '#DCDEE3',
        }
      });
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

    // 设置图例
    chart.legend(false);

    // tooltip
    if (config.tooltip) {
      let tooltipCfg = {
        custom: true,
        offset: 8,
        crosshairs: {
          type: 'y' // 启用水平方向的辅助线
        },
        crossLine: {
          stroke: '#dddddd',
          lineWidth: 1,
        },
        padding: [12, 12, 12, 12],
        html: '<div class="ac-tooltip" style="position:absolute;visibility: hidden;"><h4 class="ac-title"></h4><ul class="ac-list"></ul></div>',
        itemTpl: '<li><i style="background-color:{color}"></i>{name}<span>{value}</span></li>',
      };
      chart.tooltip(true, tooltipCfg);
      if (config.tooltip.titleFormatter || config.tooltip.nameFormatter || config.tooltip.valueFormatter) {
        chart.on('tooltipchange', function (ev) {
          ev.items.forEach((item, index) => {
            item.title = config.tooltip.titleFormatter ? config.tooltip.titleFormatter(item.title, ev.items, index, item.point._origin) : item.title;
            item.value = config.tooltip.valueFormatter ? config.tooltip.valueFormatter(item.value, ev.items, index, item.point._origin) : item.value;
            item.name = config.tooltip.nameFormatter ? config.tooltip.nameFormatter(item.name, ev.items, index, item.point._origin) : item.name;
          });
        });
      }
    } else {
      chart.tooltip(false);
    }

    // 区域、堆叠、平滑曲线
    if (config.area && config.stack) {
      chart.areaStack().position('name*value').color('type').shape(config.spline ? 'smooth' : 'area');
    } else if (config.area && !config.stack) {
      chart.area().position('name*value').color('type').shape(config.spline ? 'smooth' : 'area');
      chart.line().position('name*value').color('type').shape(config.spline ? 'smooth' : 'line');
    } else {
      chart.line().position('name*value').color('type').shape(config.spline ? 'smooth' : 'line');
    }
    // 曲线默认点
    if (config.symbol && config.area && config.stack) {
      chart.point('stack').position('name*value').color('type').shape('circle').size(3);
    } else if (config.symbol && !(config.area && config.stack)) {
      chart.point().position('name*value').color('type').shape('circle').size(3);
    }
    chart.render();

    // 自定义图例html
    if (config.legend) {
      let id = chart._attrs.id;
      let chartNode = document.getElementById(id);
      chartNode.style.position = 'relative';
      let geom = chart.getGeoms()[0]; // 获取所有的图形
      let items = geom.getData(); // 获取图形对应的数据
      let stash = {};

      let ulNode = document.createElement('ul');
      ulNode.classList.add('ac-line-legend');
      // ulNode.style.top = config.padding[0] + 'px';
      if(config.legend.align === 'right'){
        ulNode.style.right = config.padding[1] + 'px';
      }else{
        ulNode.style.left = 5 + 'px';
      }
      ulNode.innerHTML = '';
      for (let i = 0, l = items.length; i < l; i++) {
        let item = items[i];
        let itemData = item._origin;
        let color = item.color;
        let type = itemData[0].type;
        let name = itemData.name;
        let value = itemData.value;

        let typeFormatter = config.legend.nameFormatter ? config.legend.nameFormatter(type, item, i) : type ;

        let liHtml = '<li class="item" data-id="' + type + '"><i class="dot" style="background:' + color + ';"></i><span>' + typeFormatter + '</span></li>';
        ulNode.innerHTML += liHtml;
        chartNode.appendChild(ulNode);

        stash[type] = {
          item: item,
          color: color,
          name: type,
          isChecked: true,
          index: i
        };
      }
      let dotDom = chartNode.getElementsByClassName('dot');
      Array.prototype.forEach.call(ulNode.querySelectorAll('li'), (item) => {
        item.addEventListener('click', (e) => {
          let node = getLegendNode(e.target);
          let type = node.getAttribute('data-id');
          g2LegendFilter(type, stash, Util, dotDom, chart);
        });
      });
    }
  }
};

function getLegendNode(target){
  if(target.tagName === 'LI') return target;
  else return target.parentNode;
}


