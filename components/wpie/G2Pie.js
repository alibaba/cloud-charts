'use strict';

import G2 from '@antv/g2';
import merge from '../utils/merge';
import {color, fonts, size} from "../theme/normal";
import './G2Pie.scss';
const Util = G2.Util;

let defaultConfig = {
  colors: color.category_12,
  padding: [20, 120, 20, 20],
  legend: {
    // position: 'right',
    nameFormatter: null, //可以强制覆盖，手动设置label
    valueFormatter: null
  },
  tooltip: {
    nameFormatter: null,
    valueFormatter: null,
  },
  cycle: false,
  innerRadius: 0.8, // 内环半径大小，仅cycle为true时可用
  outerRadius: 0.8, // 饼图半径大小，初始化时可用
};

export default {
  beforeInit(props) {
    const {config} = props;
    const element = this.chartDom;
    const padding = props.padding || config.padding || defaultConfig.padding;
    const outerRadius = config.outerRadius || defaultConfig.outerRadius;

    const boxHeight = element.offsetHeight - padding[0] - padding[2];
    const boxWidth = element.offsetWidth - padding[1] - padding[3];
    const diameter = boxHeight < boxWidth ? boxHeight * outerRadius : boxWidth * outerRadius;

    element.style.paddingTop = `${padding[0]}px`;
    element.style.paddingRight = `${padding[1]}px`;
    element.style.paddingBottom = `${padding[2]}px`;
    element.style.paddingLeft = `${padding[3]}px`;

    // TODO 处理padding
    return Object.assign({}, props, {
      width: diameter,
      height: diameter,
      // forceFit: true,
      padding: 0
    });
  },
  init(chart, userConfig, data, rawData) {
    const config = merge({}, defaultConfig, userConfig);

    let defs = {
      type: {
        type: 'cat'
      },
    };

    chart.source(data, defs);

    // 重要：绘制饼图时，必须声明 theta 坐标系
    let thetaConfig = {
      radius: 1 // 设置饼图的为100% 大小，具体大小改变在 beforeInit 中diameter的值，目前为0.8
    };
    if (config.cycle) {
      thetaConfig.innerRadius = config.innerRadius;
    }
    chart.coord('theta', thetaConfig);

    if (config.legend) {
      chart.legend({
        useHtml: true,
        title: null,
        position: 'right',
        itemTpl: (value, color, checked, index) => {
          const item = (data && data[index]) || {};
          const raw = (rawData && rawData[0]) || {};
          const result = config.legend.nameFormatter ? config.legend.nameFormatter(value, {
            ...raw,
            color,
            checked
          }, index) : value;
          const number = config.legend.valueFormatter ? config.legend.valueFormatter(item['y'], {
            ...raw,
            color,
            checked
          }, index) : item['y'];
          return '<li class="g2-legend-list-item item-{index} {checked}" data-color="{originColor}" data-value="{originValue}">' +
            '<i class="g2-legend-marker" style="background-color:{color};"></i>' +
            '<span class="g2-legend-text">' + result + '</span>' + '<span class="g2-legend-value">' + number + '</span></li>';
        },
        'g2-legend': {
          position: 'static',
          marginLeft: size.s5, // inline flex items 不能使用百分比的margin/padding，先改为固定大小
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
        showTitle: false,
        // crosshairs: {},
      };
      chart.tooltip(tooltipCfg);
      if (config.tooltip.nameFormatter || config.tooltip.valueFormatter) {
        chart.on('tooltip:change', function (ev) {
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

    // position若直接使用value导致图例点击某项隐藏，余下展示不为值和不为1
    // var Stat = G2.Stat;

    chart.intervalStack().position('y').color('x', config.colors).select(false);

    // chart.legend(false);
    // // 设置提示
    // // tooltip
    // if (config.tooltip) {
    //   let tooltipCfg = {
    //     custom: true,
    //     offset: 8,
    //     padding: [12, 12, 12, 12],
    //     html: '<div class="ac-tooltip" style="position:absolute;visibility: hidden;"><ul class="ac-list"></ul></div>',
    //     itemTpl: '<li><i style="background-color:{color}"></i>{name}<span>{value}</span></li>',
    //   };
    //   chart.tooltip(true, tooltipCfg);
    //   if (config.tooltip.nameFormatter || config.tooltip.valueFormatter) {
    //     chart.on('tooltipchange', function (ev) {
    //       ev.items.forEach((item, index) => {
    //         item.value = config.tooltip.valueFormatter ? config.tooltip.valueFormatter(item.value, ev.items, index, item.point._origin) : item.value;
    //         item.name = config.tooltip.nameFormatter ? config.tooltip.nameFormatter(item.name, ev.items, index, item.point._origin) : item.name;
    //       });
    //     });
    //   }
    // } else {
    //   chart.tooltip(false);
    // }

    chart.render();

    // 自定义图例html
    // if (config.legend) {
    //   let chartNode = this.chartDom;
    //   chartNode.style.position = 'relative';
    //   let boxHeight = chartNode.offsetHeight - config.padding[0] - config.padding[2];
    //   let boxWidth = chartNode.offsetWidth  - config.padding[1] - config.padding[3] - boxHeight * 0.6;
    //   let diameter = boxHeight < boxWidth ? boxHeight * 0.6 : boxWidth * 0.6;
    //
    //   let geom = chart.getAllGeoms()[0]; // 获取所有的图形
    //   let items = geom.get('frames'); // 获取图形对应的数据
    //   let stash = {};
    //
    //   let ulNode = document.createElement('ul');
    //   ulNode.classList.add('ac-pie-legend');
    //   ulNode.style.top = config.padding[0] + + diameter* 0.3 + 'px';
    //   ulNode.style.left = config.padding[3] + diameter + boxWidth * 0.55  + 'px';
    //   ulNode.style.height = diameter + 'px';
    //   // if(config.legend.align === 'right'){
    //   //   ulNode.style.right = config.padding[1] + 'px';
    //   // }else{
    //   //   ulNode.style.left = 5 + 'px';
    //   // }
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
    //     let nameFormatter = config.legend.nameFormatter ? config.legend.nameFormatter(name, item, i) : name ;
    //     let valueFormatter = config.legend.valueFormatter ? config.legend.valueFormatter(value, item, i) : value ;
    //
    //     let liHtml = '<li class="item" data-id="' + name + '"><i class="dot" style="background:' + color + ';"></i><b>' + nameFormatter + '</b><span>' + valueFormatter + '</span></li>';
    //     ulNode.innerHTML += liHtml;
    //     chartNode.appendChild(ulNode);
    //
    //     stash[name] = {
    //       item: item,
    //       color: color,
    //       name: name,
    //       isChecked: true,
    //       index: i
    //     };
    //   }
    //   let dotDom = chartNode.getElementsByClassName('dot');
    //   Array.prototype.forEach.call(ulNode.querySelectorAll('li'), (item) => {
    //     item.addEventListener('click', (e) => {
    //       let node = getLegendNode(e.target);
    //       let name = node.getAttribute('data-id');
    //       // filter(name);
    //       g2LegendFilter(name, stash, Util, dotDom, chart, 'name');
    //     });
    //   });
    //   // function filter(name) {
    //   //   let obj = stash[name];
    //   //   let filterNames = [];
    //   //   obj.isChecked = obj.isChecked ? false : true;
    //   //   Util.each(stash, function (v) {
    //   //     if (v.isChecked) {
    //   //       dotDom[v.index].style.background = v.color;
    //   //       filterNames.push(v.name);
    //   //     } else {
    //   //       dotDom[v.index].style.background = '#999';
    //   //     }
    //   //   });
    //   //
    //   //   chart.filter('name', filterNames);
    //   //   chart.repaint();
    //   // }
    // }

  }
};

function getLegendNode(target){
  if(target.tagName === 'LI') return target;
  else return target.parentNode;
}

