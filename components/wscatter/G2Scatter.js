'use strict';

// 引入所需要的库和样式
import G2 from '@antv/g2';
import merge from '../utils/merge';
import { g2LegendFilter } from '../chartCommon/common';
import './index.scss';

const Util = G2.Util;

// 建议将默认配置放在外层，方便后续维护
const defaultConfig = {
  padding: [32, 5, 32, 45],
  colors: [],
  width: 1200,
  height: 800,
  xAxis: { index: 2, type: 'datetime' },
  yAxis: {
    index: 0,
    alias: '国家/地区'
  },
  alias: ['国家/地区', '人均寿命', '人均国内生产总值', '人口总数']
};

const colorMap = {
  Asia: '#2889EC',
  Americas: '#F6A71F',
  Europe: '#EF5350',
  Oceania: '#4AD051',
  Africa: '#8B73CC'
};

const setAxis = (chart, config) => {
  const { xFormator } = config;

  chart.axis('x', {
    // 格式化坐标轴的显示
    label: {
      autoRotate: false
    },
    textStyle: {
      textAlign: 'center', // 文本对齐方向，可取值为： start middle end
      fill: '#999', // 文本的颜色
      fontSize: '12' // 文本大小
    }
  });
  chart.axis('y', {
    tickLine: null,
    title: null,
    line: null,
    labels: {
      autoRotate: false,
      label: {
        textAlign: 'center',
        fill: '#333',
        fontSize: 12
      }
    },
    grid: {
      line: {
        stroke: '#F2F3F7',
        lineWidth: 1,
        lineDash: [1, 0]
      }
    },
    formatter(value) {
      return xFormator ? xFormator(value) : value;
    }
  });
};

const setSource = (chart, config, data) => {
  chart.source(data);
};

export default {
  beforeInit(props) {
    const { config } = props;

    return Object.assign({}, props, {
      padding: props.padding || config.padding || defaultConfig.padding,
      tooltip: true,
      legend: true
    });
  },
  init(chart, userConfig, data) {
    const config = merge({}, defaultConfig, userConfig);
    // 设置数据展示
    setSource(chart, config, data);

    // 设置轴
    setAxis(chart, config);

    // 设置tooltip
    setToolTip(chart, config);

    chart
      .point()
      .position('x*y')
      .size(4)
      .shape('circle');

    chart.render();

    // 设置图例;
    setLegend(chart, config);
  },
  // 自定义更新数据函数，常用于多view的情况更新数据
  changeData(chart, newConfig, newData) {},
  // 自定义更新大小函数
  changeSize(chart, newConfig, newWidth, newHeight) {},
  // 自定义销毁函数
  destroy(chart) {}
};

// 从其他图表复制，待改动
const setLegend = (chart, config) => {
  if (config.legend) {
    const id = chart._attrs.id;
    const chartNode = document.getElementById(id);
    chartNode.style.position = 'relative';
    const geom = chart.getGeoms()[0]; // 获取所有的图形
    const items = geom.getData(); // 获取图形对应的数据
    const stash = {};

    const ulNode = document.createElement('ul');
    ulNode.classList.add('ac-line-legend');
    // ulNode.style.top = config.padding[0] + 'px';
    if (config.legend.align === 'right') {
      ulNode.style.right = `${config.padding[1]}px`;
    } else {
      ulNode.style.left = `${5}px`;
    }
    ulNode.innerHTML = '';
    for (let i = 0, l = items.length; i < l; i++) {
      const item = items[i];
      const itemData = item._origin;
      const color = item.color;
      const type = itemData[0].type;
      const name = itemData.name;
      const value = itemData.value;

      const typeFormatter = config.legend.nameFormatter ? config.legend.nameFormatter(type, item, i) : type;

      const liHtml = `<li class="item" data-id="${type}"><i class="dot" style="background:${color};"></i><span>${typeFormatter}</span></li>`;
      ulNode.innerHTML += liHtml;
      chartNode.appendChild(ulNode);

      stash[type] = {
        item,
        color,
        name: type,
        isChecked: true,
        index: i
      };
    }
    const dotDom = chartNode.getElementsByClassName('dot');
    Array.prototype.forEach.call(ulNode.querySelectorAll('li'), (item) => {
      item.addEventListener('click', (e) => {
        const node = getLegendNode(e.target);
        const type = node.getAttribute('data-id');
        g2LegendFilter(type, stash, Util, dotDom, chart);
      });
    });
  }
};

const setToolTip = (chart, config) => {
  if (config.tooltip) {
    const tooltipCfg = {
      custom: true,
      offset: 8,
      crosshairs: {
        type: 'y' // 启用水平方向的辅助线
      },
      crossLine: null,
      padding: [12, 12, 12, 12],
      labels: {
        autoRotate: false
      },
      html: '<div class="ac-tooltip" style="position:absolute;visibility: hidden;"><h4 class="ac-title"></h4><ul class="ac-list"></ul></div>',
      itemTpl: '<li><i style="background-color:{color}"></i>{name}<span>{value}</span></li>'
    };
    chart.tooltip(true, tooltipCfg);
    if (config.tooltip.titleFormatter || config.tooltip.nameFormatter || config.tooltip.valueFormatter) {
      chart.on('tooltipchange', (ev) => {
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
};

const getLegendNode = (target) => {
  if (target.tagName === 'LI') return target;
  return target.parentNode;
};
