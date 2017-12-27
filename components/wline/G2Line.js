'use strict';

import G2 from '@antv/g2';
import merge from '../utils/merge';
import {color, fonts, size} from "../theme/normal";
import { propertyAssign, getDataIndexColor } from '../chartCommon/common';
import guide from '../chartCommon/guide';
import './G2Line.scss';
const Util = G2.Util;

const propertyMap = {
  xAxis: ['type', 'alias', 'tickCount', 'tickInterval', 'formatter', 'min', 'max', 'mask'],
  yAxis: ['type', 'alias', 'tickCount', 'tickInterval', 'formatter', 'min', 'max', 'mask'],
};

const defaultConfig = {
  colors: color.colors_12,
  padding: [32, 5, 32, 45],
  xAxis: {
    type: 'linear', //默认为线性
    mask: 'YYYY-MM-DD HH:mm:ss', //上述type为time时，此字段生效
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
      padding: props.padding || config.padding || (Array.isArray(config.yAxis) ? [32, 45, 32, 45] : defaultConfig.padding)
    });
  },
  init(chart, userConfig, data, rawData) {
    const config = merge({}, defaultConfig, userConfig);

    // G2 3.0 暂不支持框选模式
    // if (config.zoom) {
    //   chart.setMode('select'); // 开启框选模式
    //   chart.select('rangeX'); // 选择框选交互形式
    // }

    const defs = {
      x: propertyAssign(propertyMap.xAxis, {
        type: 'linear',
      }, config.xAxis),
      type: {
        type: 'cat'
      }
    };

    if (Array.isArray(config.yAxis)) {
      config.yAxis.forEach((axis, yIndex) => {
        defs['y' + yIndex] = propertyAssign(propertyMap.yAxis, {
          type: 'linear',
          tickCount: 5
        }, axis);
      });
    } else {
      defs.y = propertyAssign(propertyMap.yAxis, {
        type: 'linear',
        tickCount: 5
      }, config.yAxis);
    }

    chart.source(data, defs);

    const xAxis = {
      title: null, // 不展示坐标轴的标题
      label:{
        formatter:config.xAxis.labelFormatter,
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
        const yAxis = {
          title: null, // 不展示坐标轴的标题
          line: {
            stroke: getDataIndexColor(config.colors, rawData, yIndex) || color.colorN16
          },
          label:{
            formatter: axis.labelFormatter,
          }
        };
        if (yIndex !== 0) {
          yAxis.grid = null;
        }

        chart.axis('y' + yIndex, yAxis);
      });
    } else {
      const yAxis = {
        title: null, // 不展示坐标轴的标题
        label:{
          formatter:config.yAxis.labelFormatter,
        }
      };

      chart.axis('y', yAxis);
    }

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
          top: '6px',
        }, config.legend.align === 'right' ? { right: 0 } : { left: 0 }),
      });
    } else {
      chart.legend(false);
    }

    // tooltip
    if (config.tooltip) {
      let tooltipCfg = {
        // crosshairs 空对象不可省略，否则在混合图表中会没有crosshairs line
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

    // 绘制辅助线，辅助背景区域
    guide(chart, config);

    // 区域、堆叠、平滑曲线
    const lineShape = config.spline ? 'smooth' : 'line';
    const areaShape = config.spline ? 'smooth' : 'area';

    if (Array.isArray(config.yAxis)) {
      config.yAxis.forEach((asix, yIndex) => {
        drawLine(chart, config, lineShape, areaShape, 'y' + yIndex);
      });
    } else {
      drawLine(chart, config, lineShape, areaShape);
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

function drawLine(chart, config, lineShape, areaShape, yAxisKey = 'y') {
  if (config.area && config.stack) {
    chart.areaStack().position(['x', yAxisKey]).color('type', config.colors).shape(areaShape);
    chart.lineStack().position(['x', yAxisKey]).color('type', config.colors).shape(lineShape);
  } else if (config.area && !config.stack) {
    chart.area().position(['x', yAxisKey]).color('type', config.colors).shape(areaShape);
    chart.line().position(['x', yAxisKey]).color('type', config.colors).shape(lineShape);
  } else {
    chart.line().position(['x', yAxisKey]).color('type', config.colors).shape(lineShape);
  }
  // 曲线默认点
  if (config.symbol && config.area && config.stack) {
    chart.point().adjust('stack').position(['x', yAxisKey]).color('type', config.colors).shape('circle').size(3);
  } else if (config.symbol) {
    chart.point().position(['x', yAxisKey]).color('type', config.colors).shape('circle').size(3);
  }
}

function getLegendNode(target){
  if(target.tagName === 'LI') return target;
  else return target.parentNode;
}
