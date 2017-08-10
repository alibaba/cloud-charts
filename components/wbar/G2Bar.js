'use strict';

import COLORS from '../chartCommon/colors';
import merge from '../utils/merge';
import G2 from 'g2';
const Util = G2.Util;
import './index.scss';

let defaultConfig = {
  padding: [32, 5, 32, 45],
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
    align: 'left',
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
  column: false,
  polar: false,
  max: null
};

export default {
  beforeInit(props) {
    const {config, plotCfg} = props;
    plotCfg.margin = config.padding || defaultConfig.padding;
    return props;
  },
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
      count: {
        max: config.max
      }
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


    if (config.polar) {
      chart.coord('theta', {
        inner: 0.6
      });

      chart.point().position('name*0').color('name').shape('circle');
      chart.interval().position('name*value').color('name').shape('line').size(8); // 线状柱状图
      chart.point().position('name*value').color('name').shape('circle');

      chart.legend(false);
      // for (let i = 0, l = data.length; i < l; i++) {
      //   let obj = data[i];
      //   chart.guide().text([obj.name, 0], obj.name, {
      //     textAlign: 'right'
      //   });
      // }
      // chart.guide().text([0, 0], 'Music', {
      //   textAlign: 'center',
      //   fontSize: 24,
      // });
    } else {
      // 设置图例
      chart.legend(false);

      // tooltip
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
          ev.items.forEach((item) => {
            item.title = config.tooltip.titleFormatter ? config.tooltip.titleFormatter(item.title) : item.title;
            item.value = config.tooltip.valueFormatter ? config.tooltip.valueFormatter(item.value) : item.value;
            item.name = config.tooltip.nameFormatter ? config.tooltip.nameFormatter(item.name) : item.name;
          });
        });
      }

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
    }

    chart.render();

    // 自定义图例html
    if (config.legend) {
      let id = chart._attrs.id;
      let chartNode = document.getElementById(id);
      chartNode.style.position = 'relative';
      let geom = chart.getAllGeoms()[0]; // 获取所有的图形
      let items = geom.get('frames'); // 获取图形对应的数据
      let stash = {};

      let ulNode = document.createElement('ul');
      ulNode.classList.add('ac-bar-legend');
      // ulNode.style.top = config.padding[0] + 'px';
      if(config.legend.align === 'right'){
        ulNode.style.right = config.padding[1] + 'px';
      }else{
        ulNode.style.left = 5 + 'px';
      }
      ulNode.innerHTML = '';

      for (let i = 0, l = items.length; i < l; i++) {
        let item = items[i];
        let itemData = item.data[0];
        if (!itemData) {
          return;
        };
        let color = itemData.color;
        if(!itemData._origin){
          return;
        }
        let type = itemData._origin.type;
        let name = itemData._origin.name;
        let value = itemData._origin.value;

        let typeFormatter = config.legend.labelFormatter ? config.legend.labelFormatter(type) : type ;

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
          filter(type);
        });
      });
      function filter(name) {
        let obj = stash[name];
        let filterNames = [];
        obj.isChecked = obj.isChecked ? false : true;
        Util.each(stash, function (v) {
          if (v.isChecked) {
            dotDom[v.index].style.background = v.color;
            filterNames.push(v.name);
          } else {
            dotDom[v.index].style.background = '#999';
          }
        });

        chart.filter('type', filterNames);
        chart.repaint();
      }
    }
  }
};

function getLegendNode(target){
  if(target.tagName === 'LI') return target;
  else return target.parentNode;
}
