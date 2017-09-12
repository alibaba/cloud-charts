'use strict';

import COLORS from '../chartCommon/colors';
import merge from '../utils/merge';
import G2 from 'g2';
import './index.scss';
const Util = G2.Util;
const Stat = G2.Stat;

let defaultConfig = {
  legend: {
    align: 'left',
    nameFormatter: null, //可以强制覆盖，手动设置label
  },
  tooltip: {
    titleFormatter: null,
    nameFormatter: null,
    valueFormatter: null,
  },
  labels: false,
  geoData: null
};

export default {
  beforeInit(props) {
    // const {config, plotCfg} = props;
    // plotCfg.margin = config.padding || defaultConfig.padding;
    return props;
  },
  init(chart, userConfig, data) {
    const config = merge({}, defaultConfig, userConfig);
    // let defs = {
    //   name: {
    //     type: "time"
    //   },
    //   value: {
    //     type: 'linear',
    //     max: config.yAxis.max, // 自定义最大值
    //     min: config.yAxis.min // 自定义最小值
    //   },
    //   type: {
    //     type: 'cat'
    //   }
    // };
    // if (config.xAxis.type === 'datetime') {
    //   defs = merge({}, defs, !config.xAxis.labelFormatter ? {
    //     name: {
    //       mask: config.xAxis.dateFormatter
    //     }
    //   } : {});
    // }
    //
    // chart.source(data, defs);

    if (!config.geoData) {
      console.warn('config.geoData is required!');
      return;
    }

    const mapData = config.geoData.features.map((feature) => {
      return {
        name: feature.properties.name
      }
    });
    chart.source(mapData, {
      name: {
        type: 'cat'
      }
    });

    // let valueAxis = {
    //   title: null, // 不展示 xDim 对应坐标轴的标题
    //   line: {
    //     lineWidth: 0, // 设置线的宽度
    //   },
    //   tickLine: {
    //     lineWidth: 0
    //   },
    //   formatter:config.yAxis.labelFormatter,
    //   grid: {
    //     line: {
    //       stroke: '#DCDEE3',
    //       lineWidth: 1,
    //       lineDash: [4, 0]
    //     }
    //   },
    //   labels:{
    //     label: {
    //       fill: '#989898',
    //     }
    //   }
    // };
    // let nameAxis = {
    //   title: null, // 不展示 xDim 对应坐标轴的标题
    //   tickLine: {
    //     lineWidth: 0
    //   },
    //   line:{
    //     stroke: '#DCDEE3',
    //   },
    //   formatter:config.xAxis.labelFormatter,
    //   labels:{
    //     label: {
    //       fill: '#989898',
    //     }
    //   }
    // };
    //
    // // 网格线
    // if (config.grid) {
    //   valueAxis = merge({}, valueAxis, {
    //     line: {
    //       lineWidth: 1, // 设置线的宽度
    //       stroke: '#DCDEE3',
    //     }
    //   })
    //   nameAxis = merge({}, nameAxis, {
    //     grid: {
    //       line: {
    //         stroke: '#DCDEE3',
    //         lineWidth: 1,
    //         lineDash: [4, 0]
    //       }
    //     },
    //   });
    // }
    // chart.axis('value', valueAxis);
    // chart.axis('name', nameAxis);

    // 设置图例
    chart.legend(false);

    // tooltip
    if (config.tooltip) {
      let tooltipCfg = {
        custom: true,
        offset: 8,
        // crosshairs: {
        //   type: 'y' // 启用水平方向的辅助线
        // },
        // crossLine: {
        //   stroke: '#dddddd',
        //   lineWidth: 1,
        // },
        padding: [12, 12, 12, 12],
        html: '<div class="ac-tooltip" style="position:absolute;visibility: hidden;"><h4 class="ac-title"></h4><ul class="ac-list"></ul></div>',
        // itemTpl: '<li><i style="background-color:{color}"></i>{name}<span>{value}</span></li>',
      };
      chart.tooltip(true, tooltipCfg);
      if (config.tooltip.titleFormatter || config.tooltip.nameFormatter || config.tooltip.valueFormatter) {
        chart.on('tooltipchange', function (ev) {
          ev.items.forEach((item) => {
            item.title = config.tooltip.titleFormatter ? config.tooltip.titleFormatter(item.title) : item.title;
            item.value = '';
            item.name = '';
            // item.value = config.tooltip.valueFormatter ? config.tooltip.valueFormatter(item.value) : item.value;
            // item.name = config.tooltip.nameFormatter ? config.tooltip.nameFormatter(item.name) : item.name;
          });
        });
      }
    } else {
      chart.tooltip(false);
    }

    chart.polygon().position(Stat.map.region('name', config.geoData)).color('Population','#e5f5e0-#31a354').style({
      fill: 'rgba(49, 157, 255, 0.8)',
      stroke: '#999',
      lineWidth: 1
    });

    if (config.labels) {
      chart.point().position(Stat.map.center('name', geoData)).size(0).label('name', {offset: 0});
    }

    chart.render();

    // 自定义图例html
    // if (config.legend) {
    //   let id = chart._attrs.id;
    //   let chartNode = document.getElementById(id);
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

// function getLegendNode(target){
//   if(target.tagName === 'LI') return target;
//   else return target.parentNode;
// }


