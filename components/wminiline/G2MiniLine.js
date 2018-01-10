'use strict';

import merge from '../utils/merge';
import {color, fonts, size} from "../theme/normal";
import { propertyAssign, getDataIndexColor, propertyMap } from '../chartCommon/common';
import guide from '../chartCommon/guide';

const defaultConfig = {
  colors: color.category_12,
  padding: [0, 0, 0, 0],
  xAxis: {
    type: 'time', //默认为线性
    mask: 'YYYY-MM-DD HH:mm:ss', //上述type为time时，此字段生效
    categories: null,
    max: null,
    min: null,
  },
  yAxis: {
    max: null,
    min: null,
  },
  tooltip: false,
  area: false,
  spline: false,
  symbol:false,
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
    const newConfig = merge({}, defaultConfig, config);

    // TODO 处理padding
    return Object.assign({}, props, {
      padding: props.padding || config.padding || defaultConfig.padding,
      config: newConfig
    });
  },
  init(chart, userConfig, data, rawData) {
    const config = userConfig;

    if (config.xAxis && config.xAxis.type === 'datetime') {
      config.xAxis.type = 'time';
    }

    const defs = {
      x: propertyAssign(propertyMap.xAxis, {
        type: 'time',
        // 折线图X轴的范围默认覆盖全部区域，保证没有空余
        range: [0, 1]
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

    chart.axis(false);

    chart.legend(false);

    // tooltip
    if (config.tooltip) {
      let tooltipCfg = {
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

    // 区域、堆叠、平滑曲线
    const lineShape = config.spline ? 'smooth' : 'line';
    const areaShape = config.spline ? 'smooth' : 'area';

    drawLine(chart, config, lineShape, areaShape);

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
