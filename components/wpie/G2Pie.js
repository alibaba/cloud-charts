'use strict';

import G2 from 'g2';
import merge from '../utils/merge';
import { colors } from '../variables';
import './index.scss';

const Util = G2.Util;

const defaultConfig = {
  legend: {
    position: 'right',
    nameFormatter: null, // 可以强制覆盖，手动设置label
    valueFormatter: null
  },
  tooltip: {
    nameFormatter: null,
    valueFormatter: null
  },
  cycle: false,
  padding: [0, 0, 0, 0]
};

export default {
  beforeInit(props) {
    const { config, plotCfg, height } = props;
    plotCfg.margin = config.padding || defaultConfig.padding;
    return props;
  },

  init(chart, userConfig, data) {
    const config = merge({}, defaultConfig, userConfig);

    const defs = {
      type: {
        type: 'cat'
      }
    };

    chart.source(data, defs);
    // 重要：绘制饼图时，必须声明 theta 坐标系
    let thetaConfig = {
      radius: 0.6 // 设置饼图的大小
    };
    if (config.cycle) {
      thetaConfig = merge({}, thetaConfig, {
        inner: 0.66
      });
    }
    chart.coord('theta', thetaConfig);

    // position若直接使用value导致图例点击某项隐藏，余下展示不为值和不为1
    const Stat = G2.Stat;

    // labelFormatter
    if (config.labelFormatter) {
      chart
        .intervalStack()
        .position(Stat.summary.percent('value'))
        .color('name')
        .label('name*..percent', config.labelFormatter)
        .selected(false);
    } else {
      chart
        .intervalStack()
        .position(Stat.summary.percent('value'))
        .color('name')
        .selected(false);
    }

    chart.legend(false);

    // 设置提示
    // tooltip
    const tooltipCfg = {
      custom: true,
      offset: 8,
      padding: [12, 12, 12, 12],
      html: '<div class="ac-tooltip" style="position:absolute;visibility: hidden;"><ul class="ac-list"></ul></div>',
      itemTpl: '<li><i style="background-color:{color}"></i>{name}<span>{value}</span></li>'
    };
    chart.tooltip(true, tooltipCfg);
    if (config.tooltip.nameFormatter || config.tooltip.valueFormatter) {
      chart.on('tooltipchange', (ev) => {
        ev.items.forEach((item) => {
          item.value = config.tooltip.valueFormatter ? config.tooltip.valueFormatter(item.value) : item.value;
          item.name = config.tooltip.nameFormatter ? config.tooltip.nameFormatter(item.name) : item.name;
        });
      });
    }

    chart.render();

    // 自定义图例html
    if (config.legend) {
      const id = chart._attrs.id;
      const chartNode = document.getElementById(id);
      chartNode.style.position = 'relative';
      const boxHeight = chartNode.offsetHeight - config.padding[0] - config.padding[2];
      const boxWidth = chartNode.offsetWidth - config.padding[1] - config.padding[3] - boxHeight * 0.6;
      const diameter = boxHeight < boxWidth ? boxHeight * 0.6 : boxWidth * 0.6;

      const geom = chart.getAllGeoms()[0]; // 获取所有的图形
      const items = geom.get('frames'); // 获取图形对应的数据
      const stash = {};

      const ulNode = document.createElement('ul');
      ulNode.classList.add('ac-pie-legend');
      ulNode.style.top = `${config.padding[0] + +diameter * 0.3}px`;
      ulNode.style.left = `${config.padding[3] + diameter + boxWidth * 0.55}px`;
      ulNode.style.height = `${diameter}px`;
      // if(config.legend.align === 'right'){
      //   ulNode.style.right = config.padding[1] + 'px';
      // }else{
      //   ulNode.style.left = 5 + 'px';
      // }
      ulNode.innerHTML = '';

      for (let i = 0, l = items.length; i < l; i++) {
        const item = items[i];
        const itemData = item.data[0];
        if (!itemData) {
          return;
        }
        const color = itemData.color;
        if (!itemData._origin) {
          return;
        }
        const type = itemData._origin.type;
        const name = itemData._origin.name;
        const value = itemData._origin.value;

        const nameFormatter = config.legend.nameFormatter ? config.legend.nameFormatter(name) : name;
        const valueFormatter = config.legend.valueFormatter ? config.legend.valueFormatter(value) : value;

        const liHtml = `<li class="item" data-id="${name}"><i class="dot" style="background:${color};"></i><b>${nameFormatter}</b><span>${valueFormatter}</span></li>`;
        ulNode.innerHTML += liHtml;
        chartNode.appendChild(ulNode);

        stash[name] = {
          item,
          color,
          name,
          isChecked: true,
          index: i
        };
      }
      const dotDom = chartNode.getElementsByClassName('dot');
      Array.prototype.forEach.call(ulNode.querySelectorAll('li'), (item) => {
        item.addEventListener('click', (e) => {
          const node = getLegendNode(e.target);
          const name = node.getAttribute('data-id');
          filter(name);
        });
      });
      function filter(name) {
        const obj = stash[name];
        const filterNames = [];
        obj.isChecked = !obj.isChecked;
        Util.each(stash, (v) => {
          if (v.isChecked) {
            dotDom[v.index].style.background = v.color;
            filterNames.push(v.name);
          } else {
            dotDom[v.index].style.background = colors.colorN22;
          }
        });

        chart.filter('name', filterNames);
        chart.repaint();
      }
    }
  }
};

function getLegendNode(target) {
  if (target.tagName === 'LI') return target;
  return target.parentNode;
}
