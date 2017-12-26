'use strict';

import G2 from '@antv/g2';
import merge from '../utils/merge';
import {color, fonts, size} from "../variables";
import { propertyAssign } from '../chartCommon/common';
import guide from '../chartCommon/guide';
import './G2Bar.scss';
const Util = G2.Util;

const propertyMap = {
  xAxis: ['type', 'alias', 'tickCount', 'tickInterval', 'formatter', 'min', 'max', 'mask'],
  yAxis: ['type', 'alias', 'tickCount', 'tickInterval', 'formatter', 'min', 'max', 'mask'],
};

let defaultConfig = {
  colors: color.colors_12,
  padding: [32, 5, 32, 45],
  xAxis: {
    type: 'cat',
    labelFormatter: null, //可以强制覆盖，手动设置label
    categories: null,
  },
  yAxis: {
    labelFormatter: null, //可以强制覆盖，手动设置label
    max: null,
    min: null,
    // bgArea: [], // TODO 辅助区域后期需要加上
    // guideLine: null
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
  // clickable: false,
  stack: false,
  grid: false,
  // labels: false,
  polar: false,
  // max: null
};

export default {
  beforeInit(props) {
    const {config} = props;
    // TODO 处理padding
    return Object.assign({}, props, {
      padding: props.padding || config.padding || defaultConfig.padding
    });
  },
  init(chart, userConfig, data, rawData) {
    const config = merge({}, defaultConfig, userConfig);

    let defs = {
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
      // count: {
      //   max: config.max
      // }
    };

    chart.source(data, defs);

    let yAxis = {
      // title: null, // 不展示 xDim 对应坐标轴的标题
      // line: {
      //   lineWidth: 0, // 设置线的宽度
      // },
      // tickLine: {
      //   lineWidth: 0
      // },
      // formatter: config.yAxis.labelFormatter,
      // grid: {
      //   line: {
      //     stroke: '#DCDEE3',
      //     lineWidth: 1,
      //     lineDash: [4, 0]
      //   }
      // },
      label:{
        formatter:config.yAxis.labelFormatter,
      }
    };


    let xAxis = {
      // title: null, // 不展示 xDim 对应坐标轴的标题
      // tickLine: {
      //   lineWidth: 0
      // },
      // line: {
      //   stroke: '#DCDEE3',
      // },
      // formatter: config.xAxis.labelFormatter,
      label:{
        formatter:config.xAxis.labelFormatter,
      }
    };

    // 网格线
    if (config.grid) {
      // yAxis = merge({}, yAxis, {
      //   line: {
      //     lineWidth: 1, // 设置线的宽度
      //     stroke: '#DCDEE3',
      //   }
      // })
      xAxis.grid = {
        lineStyle: {
          stroke: color.colorFill12,
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
          const item = (rawData && rawData[index]) || {};
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
          overflow: 'auto',
          fontFamily: fonts.fontFamilyBase,
          fontSize: fonts.fontSizeBaseCaption,
          lineHeight: fonts.fontSizeBaseCaption,
          color: color.colorText14,
          top: '6px',
        }, config.legend.align === 'right' ? { right: 0 } : { left: 0 }),
        'g2-legend-list': {},
        'g2-legend-list-item': {
          marginBottom: size.s3,
          marginRight: size.s3
        },
        'g2-legend-marker': {
          width: '6px',
          height: '6px',
          marginRight: size.s1,
        },
      });

      // G2.DomUtil.requestAnimationFrame(() => {
      //   const legendDom = this.chartDom.querySelector('.g2-legend');
      //   if(config.legend.align === 'right'){
      //     legendDom && legendDom.classList.add('legend-align-right');
      //   }else{
      //     legendDom && legendDom.classList.add('legend-align-left');
      //   }
      // });
    } else {
      chart.legend(false);
    }

    // tooltip
    if (config.tooltip) {
      let tooltipCfg = {
        // crosshairs 空对象不可省略，否则在混合图表中会没有crosshairs line
        crosshairs: {},
      };
      chart.tooltip(tooltipCfg);
      if (config.tooltip.titleFormatter || config.tooltip.nameFormatter || config.tooltip.valueFormatter) {
        chart.on('tooltip:change', function (ev) {
          if (config.tooltip.titleFormatter) {
            ev.items[0].title = config.tooltip.titleFormatter(ev.items[0].title, ev.items);
          }

          ev.items.forEach((item, index) => {
            if (config.tooltip.valueFormatter) {
              item.value = config.tooltip.valueFormatter(item.value, ev.items, index, item.point._origin);
            }
            if (config.tooltip.nameFormatter) {
              item.name = config.tooltip.nameFormatter(item.name, ev.items, index, item.point._origin);
            }
          });
        });
      }
    } else {
      chart.tooltip(false);
    }

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
        chart.intervalStack().position('x*y').color('type', config.colors);
      } else {
        chart.interval().position('x*y').color('type', config.colors).adjust([{
          type: 'dodge',
          marginRatio: 0, // 数值范围为 0 至 1，用于调整分组中各个柱子的间距
        }]);
      }
    // }

    // // tooltip
    // if (config.tooltip) {
    //   let tooltipCfg = {
    //     custom: true,
    //     offset: 8,
    //     crosshairs: {
    //       type: 'y' // 启用水平方向的辅助线
    //     },
    //     crossLine: {
    //       stroke: '#dddddd',
    //       lineWidth: 1,
    //     },
    //     padding: [12, 12, 12, 12],
    //     html: '<div class="ac-tooltip" style="position:absolute;visibility: hidden;"><h4 class="ac-title"></h4><ul class="ac-list"></ul></div>',
    //     itemTpl: '<li><i style="background-color:{color}"></i>{name}<span>{value}</span></li>',
    //   };
    //   chart.tooltip(true, tooltipCfg);
    //   if (config.tooltip.titleFormatter || config.tooltip.nameFormatter || config.tooltip.valueFormatter) {
    //     chart.on('tooltipchange', function (ev) {
    //       ev.items.forEach((item, index) => {
    //         item.title = config.tooltip.titleFormatter ? config.tooltip.titleFormatter(item.title, ev.items, index, item.point._origin) : item.title;
    //         item.value = config.tooltip.valueFormatter ? config.tooltip.valueFormatter(item.value, ev.items, index, item.point._origin) : item.value;
    //         item.name = config.tooltip.nameFormatter ? config.tooltip.nameFormatter(item.name, ev.items, index, item.point._origin) : item.name;
    //       });
    //     });
    //   }
    // } else {
    //   chart.tooltip(false);
    // }

    // // 设置图例
    // chart.legend(false);

    chart.render();

    // 自定义图例html
    // if (config.legend) {
    //   let chartNode = this.chartDom;
    //   chartNode.style.position = 'relative';
    //   let geom = chart.getAllGeoms()[0]; // 获取所有的图形
    //   let items = geom.get('frames'); // 获取图形对应的数据
    //   let stash = {};
    //
    //   let ulNode = document.createElement('ul');
    //   ulNode.classList.add('ac-bar-legend');
    //   // ulNode.style.top = config.padding[0] + 'px';
    //   if(config.legend.align === 'right'){
    //     ulNode.style.right = config.padding[1] + 'px';
    //   }else{
    //     ulNode.style.left = 5 + 'px';
    //   }
    //   ulNode.innerHTML = '';
    //
    //   for (let i = 0, l = items.length; i < l; i++) {
    //     let item = items[i];
    //     let itemData = item.data[0];
    //     if (!itemData) {
    //       return;
    //     };
    //     let color = itemData.color;
    //     if(!itemData._origin){
    //       return;
    //     }
    //     let type = itemData._origin.type;
    //     let name = itemData._origin.name;
    //     let value = itemData._origin.value;
    //
    //     let typeFormatter = config.legend.nameFormatter ? config.legend.nameFormatter(type, item, i) : type ;
    //
    //     let liHtml = '<li class="item" data-id="' + type + '"><i class="dot" style="background:' + color + ';"></i><span>' + typeFormatter + '</span></li>';
    //     ulNode.innerHTML += liHtml;
    //     chartNode.appendChild(ulNode);
    //
    //     stash[type] = {
    //       item: item,
    //       color: color,
    //       name: type,
    //       isChecked: true,
    //       index: i
    //     };
    //   }
    //   let dotDom = chartNode.getElementsByClassName('dot');
    //   Array.prototype.forEach.call(ulNode.querySelectorAll('li'), (item) => {
    //     item.addEventListener('click', (e) => {
    //       let node = getLegendNode(e.target);
    //       let type = node.getAttribute('data-id');
    //       g2LegendFilter(type, stash, Util, dotDom, chart);
    //     });
    //   });
    // }
  }
};

function getLegendNode(target){
  if(target.tagName === 'LI') return target;
  else return target.parentNode;
}
