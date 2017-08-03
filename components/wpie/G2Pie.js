'use strict';

import COLORS from '../chartCommon/colors';
import merge from '../utils/merge';
import G2 from 'g2';
import './index.scss';
const Util = G2.Util;

let defaultConfig = {
  legend: {
    position: 'right',
    labelFormatter: null, //可以强制覆盖，手动设置label
  },
  tooltip: {
    nameFormatter: null,
    valueFormatter: null,
  },
  cycle: false,
  padding: [40, 40, 40, 40],
};

export default {
  beforeInit(props) {
    const {config, plotCfg, height} = props;
    plotCfg.margin = config.padding || defaultConfig.padding;
    return props;
  },

  init(chart, userConfig, data) {
    const config = merge({}, defaultConfig, userConfig);

    let defs = {
      type: {
        type: 'cat'
      },
    };

    chart.source(data, defs);
    // 重要：绘制饼图时，必须声明 theta 坐标系
    let thetaConfig = {
      radius: 0.84 // 设置饼图的大小
    }
    if (config.cycle) {
      thetaConfig = merge({}, thetaConfig, {
        inner: 0.66
      });
    }
    chart.coord('theta', thetaConfig);



    // position若直接使用value导致图例点击某项隐藏，余下展示不为值和不为1
    var Stat = G2.Stat;

    //labelFormatter
    if (config.labelFormatter) {
      chart.intervalStack().position(Stat.summary.percent('value')).color('name').label('name*..percent', config.labelFormatter);
    } else {
      chart.intervalStack().position(Stat.summary.percent('value')).color('name');
    }

    chart.legend(false);

    // 设置提示
    // tooltip
    let tooltipCfg = {
      custom: true,
      offset: 8,
      padding: [12, 12, 12, 12],
      html: '<div class="ac-tooltip" style="position:absolute;visibility: hidden;"><ul class="ac-list"></ul></div>',
      itemTpl: '<li><i style="background-color:{color}"></i>{name}<span>{value}</span></li>',
    };
    chart.tooltip(true, tooltipCfg);
    if (config.tooltip.nameFormatter || config.tooltip.valueFormatter) {
      chart.on('tooltipchange', function (ev) {
        ev.items.forEach((item) => {
          item.value = config.tooltip.valueFormatter ? config.tooltip.valueFormatter(item.value) : item.value;
          item.name = config.tooltip.nameFormatter ? config.tooltip.nameFormatter(item.name) : item.name;
        });
      });
    }

    chart.render();

    // 自定义图例html
    if (config.legend) {
      let id = chart._attrs.id;
      let chartNode = document.getElementById(id);
      chartNode.style.position = 'relative';
      let boxHeight = chartNode.offsetHeight - config.padding[0] - config.padding[2];
      let boxWidth = chartNode.offsetWidth  - config.padding[1] - config.padding[3] - boxHeight * 0.84;
      let diameter = boxHeight < boxWidth ? boxHeight * 0.84 : boxWidth * 0.84;

      let geom = chart.getAllGeoms()[0]; // 获取所有的图形
      let items = geom.get('frames'); // 获取图形对应的数据
      let stash = {};

      let ulNode = document.createElement('ul');
      ulNode.classList.add('ac-legend');
      ulNode.style.top = config.padding[0] + boxHeight * 0.1 + 'px';
      ulNode.style.left = config.padding[3] + diameter + boxWidth * 0.55  + 'px';
      ulNode.style.height = diameter + 'px';
      // if(config.legend.align === 'right'){
      //   ulNode.style.right = config.padding[1] + 'px';
      // }else{
      //   ulNode.style.left = 5 + 'px';
      // }
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

        let liHtml = '<li class="item" data-id="' + name + '"><i class="dot" style="background:' + color + ';"></i><b>' + name + '</b><span>' + value + '</span></li>';
        ulNode.innerHTML += liHtml;
        chartNode.appendChild(ulNode);

        stash[name] = {
          item: item,
          color: color,
          name: name,
          isChecked: true,
          index: i
        };
      }
      let dotDom = chartNode.getElementsByClassName('dot');
      Array.prototype.forEach.call(ulNode.querySelectorAll('li'), (item) => {
        item.addEventListener('click', (e) => {
          let node = getLegendNode(e.target);
          let name = node.getAttribute('data-id');
          filter(name);
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

        chart.filter('name', filterNames);
        chart.repaint();
      }
    }

  }
};

function getLegendNode(target){
  if(target.tagName === 'LI') return target;
  else return target.parentNode;
}

