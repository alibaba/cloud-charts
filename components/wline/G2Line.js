'use strict';

import COLORS from '../chartCommon/colors';
import merge from '../utils/merge';
import G2 from '@antv/g2';
import './G2Line.scss';
const Util = G2.Util;

import {g2LegendFilter} from '../common';
import {colors, fonts, size} from "../variables";

const propertyMap = {
  xAxis: ['type', 'alias', 'tickCount', 'tickInterval', 'formatter', 'min', 'max', 'mask'],
  yAxis: ['type', 'alias', 'tickCount', 'tickInterval', 'formatter', 'min', 'max', 'mask'],
};

const defaultConfig = {
  // colors: [],
  padding: [32, 5, 32, 45],
  xAxis: {
    type: 'linear', //默认为线性
    mask: 'YYYY-MM-DD HH:mm:ss', //上述type为datetime时，此字段生效
    labelFormatter: null, //可以强制覆盖，手动设置label
    categories: null,
    max: null,
    min: null,
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
  // TODO 修改事件绑定规则
  // clickable: false,
  area: false,
  stack: false,//仅Area有效
  spline: false,
  grid: false,
  symbol:false,
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
    const {config} = props;
    // TODO 处理padding
    return Object.assign({}, props, {
      padding: props.padding || config.padding || defaultConfig.padding
    });
  },
  init(chart, userConfig, data, rawData) {
    const config = merge({}, defaultConfig, userConfig);

    // G2 3.0 暂不支持框选模式
    // if (config.zoom) {
    //   chart.setMode('select'); // 开启框选模式
    //   chart.select('rangeX'); // 选择框选交互形式
    // }

    let defs = {
      x: propertyAssign(propertyMap.xAxis, {
        type: 'linear',
      }, config.xAxis),
      y: propertyAssign(propertyMap.yAxis, {
        type: 'linear',
      }, config.yAxis),
      type: {
        type: 'cat'
      }
    };
    // if (config.xAxis.type === 'datetime') {
    //   defs = merge({}, defs, config.xAxis.dateFormatter ? {
    //     x: {
    //       mask: config.xAxis.dateFormatter
    //     }
    //   } : {});
    // }

    chart.source(data, defs);

    let yAxis = {
      // title: null, // 不展示坐标轴的标题
      // line: {
      //   lineWidth: 0, // 设置线的宽度
      // },
      // tickLine: {
      //   lineWidth: 0
      // },
      // formatter:config.yAxis.labelFormatter,
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
      // line:{
      //   stroke: '#DCDEE3',
      // },
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
      // });
      xAxis.grid = {
        lineStyle: {
          stroke: colors.colorFill12,
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
        'g2-legend': {
          overflow: 'auto',
          fontFamily: fonts.fontFamilyBase,
          fontSize: fonts.fontSizeBaseCaption,
          lineHeight: fonts.fontSizeBaseCaption,
          color: colors.colorText14
        },
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

      G2.DomUtil.requestAnimationFrame(() => {
        const legendDom = this.chartDom.querySelector('.g2-legend');
        if(config.legend.align === 'right'){
          legendDom && legendDom.classList.add('legend-align-right');
        }else{
          legendDom && legendDom.classList.add('legend-align-left');
        }
      });
    } else {
      chart.legend(false);
    }


    // tooltip
    if (config.tooltip) {
      let tooltipCfg = {
        crosshairs: {
        //   type: 'y' // 启用水平方向的辅助线
        //   stroke: '#dddddd',
        //   // lineWidth: 1,
        },
        // html: '<div class="ac-tooltip" style="position:absolute;visibility: hidden;"><h4 class="ac-title"></h4><ul class="ac-list"></ul></div>',
        // itemTpl: '<li><i style="background-color:{color}"></i>{x}<span>{y}</span></li>',
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

    // 区域、堆叠、平滑曲线
    const lineShape = config.spline ? 'smooth' : 'line';
    const areaShape = config.spline ? 'smooth' : 'area';

    if (config.area && config.stack) {
      chart.areaStack().position('x*y').color('type').shape(areaShape);
      chart.lineStack().position('x*y').color('type').shape(lineShape);
    } else if (config.area && !config.stack) {
      chart.area().position('x*y').color('type').shape(areaShape);
      chart.line().position('x*y').color('type').shape(lineShape);
    } else {
      chart.line().position('x*y').color('type').shape(lineShape);
    }
    // 曲线默认点
    if (config.symbol && config.area && config.stack) {
      chart.point().adjust('stack').position('x*y').color('type').shape('circle').size(3);
    } else if (config.symbol) {
      chart.point().position('x*y').color('type').shape('circle').size(3);
    }
    chart.render();

    // 自定义图例html
    // if (config.legend) {
    //   let chartNode = this.chartDom;
    //   chartNode.style.position = 'relative';
    //   let geom = chart.getGeoms()[0]; // 获取所有的图形
    //   let items = geom.getData(); // 获取图形对应的数据
    //   let stash = {};
    //
    //   let ulNode = document.createElement('ul');
    //   ulNode.classList.add('ac-line-legend');
    //   // ulNode.style.top = config.padding[0] + 'px';
    //   if(config.legend.align === 'right'){
    //     ulNode.style.right = config.padding[1] + 'px';
    //   }else{
    //     ulNode.style.left = 5 + 'px';
    //   }
    //   ulNode.innerHTML = '';
    //   for (let i = 0, l = items.length; i < l; i++) {
    //     let item = items[i];
    //     let itemData = item._origin;
    //     let color = item.color;
    //     let type = itemData[0].type;
    //     let name = itemData.name;
    //     let value = itemData.value;
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

function propertyAssign (keys, target, source) {
  keys.forEach((key) => {
    if (source[key]) {
      target[key] = source[key];
    }
  });

  return target;
}
