'use strict';

import merge from '../utils/merge';
import { color, size } from '../theme/normal';
import { numberDecimal } from '../chartCommon/common';
import './G2Pie.scss';

const defaultConfig = {
  colors: color.category_12,
  padding: [20, 20, 20, 20],
  legend: {
    // position: 'right',
    nameFormatter: null, // 可以强制覆盖，手动设置label
    valueFormatter: null
  },
  tooltip: {
    nameFormatter: null,
    valueFormatter: null,
  },
  autoSort: true,
  cycle: false,
  innerRadius: 0.8, // 内环半径大小，仅cycle为true时可用
  outerRadius: 0.8, // 饼图半径大小，初始化时可用
};

export default {
  beforeInit(props) {
    const { config } = props;
    const element = this.chartDom;
    const padding = props.padding || config.padding || defaultConfig.padding;
    const outerRadius = Math.max(Math.min(config.outerRadius || defaultConfig.outerRadius, 1), 0.01);

    const boxHeight = element.offsetHeight - padding[0] - padding[2];
    const boxWidth = element.offsetWidth - padding[1] - padding[3];
    // 饼本体大小，向下取整
    const diameter = Math.floor(boxHeight < boxWidth ? boxHeight * outerRadius : boxWidth * outerRadius);

    element.style.paddingTop = `${padding[0]}px`;
    element.style.paddingRight = `${padding[1]}px`;
    element.style.paddingBottom = `${padding[2]}px`;
    element.style.paddingLeft = `${padding[3]}px`;

    this.childrenDom = element.querySelector('.aisc-widgets-children');
    if (this.childrenDom) {
      this.childrenDom.style.width = `${diameter}px`;
      this.childrenDom.style.height = `${boxHeight}px`;
    }

    // TODO 处理padding
    return Object.assign({}, props, {
      width: diameter,
      height: diameter,
      // forceFit: true,
      padding: 0
    });
  },
  changeSize(chart, config, w, h) {
    const padding = config.padding || defaultConfig.padding;
    const outerRadius = Math.max(Math.min(config.outerRadius || defaultConfig.outerRadius, 1), 0.01);

    const boxHeight = h - padding[0] - padding[2];
    const boxWidth = w - padding[1] - padding[3];
    // 饼本体大小，向下取整
    const diameter = Math.floor(boxHeight < boxWidth ? boxHeight * outerRadius : boxWidth * outerRadius);

    if (this.childrenDom) {
      this.childrenDom.style.width = `${diameter}px`;
      this.childrenDom.style.height = `${boxHeight}px`;
    }

    chart.changeSize(diameter, diameter);
  },
  changeData(chart, config, data) {
    // 更新数据总和值，保证百分比的正常
    let totalData = 0;
    data.forEach((d) => {
      totalData += d.y;
    });
    this.totalData = totalData;

    // 不要忘记排序的状态
    if (config.autoSort) {
      data.sort((a, b) => b.y - a.y);
    }
    // 更新挂载的转换数据
    this.data = data;

    chart.changeData(data);
  },
  init(chart, userConfig, data) {
    const config = merge({}, defaultConfig, userConfig);

    const defs = {
      type: {
        type: 'cat'
      },
    };

    if (config.autoSort) {
      data.sort((a, b) => b.y - a.y);
    }
    // 挂载转换后的数据
    this.data = data;

    chart.source(data, defs);

    // 重要：绘制饼图时，必须声明 theta 坐标系
    const thetaConfig = {
      radius: 1 // 设置饼图的为100% 大小，具体大小改变在 beforeInit 中diameter的值，目前为0.8
    };
    if (config.cycle) {
      thetaConfig.innerRadius = Math.max(Math.min(config.innerRadius, 1), 0);
    }
    chart.coord('theta', thetaConfig);

    // 计算得总数据
    let totalData = 0;
    data.forEach((d) => {
      totalData += d.y;
    });
    this.totalData = totalData;

    if (config.legend) {
      chart.legend({
        useHtml: true,
        title: null,
        position: 'right',
        itemTpl: (value, color, checked, index) => {
          const item = (this.data && this.data[index]) || {};
          const raw = (this.rawData && this.rawData[0]) || {};
          const percent = numberDecimal(item.y / this.totalData, 4);

          const result = config.legend.nameFormatter ? config.legend.nameFormatter(value, {
            ...raw,
            percent,
            color,
            checked
          }, index) : value;
          const number = config.legend.valueFormatter ? config.legend.valueFormatter(item.y, {
            ...raw,
            percent,
            color,
            checked
          }, index) : item.y;
          return '<li class="g2-legend-list-item item-{index} {checked}" data-color="{originColor}" data-value="{originValue}">' +
            '<i class="g2-legend-marker" style="background-color:{color};"></i>' +
            '<span class="g2-legend-text">' + result + '</span>' + '<span class="g2-legend-value">' + number + '</span></li>';
        },
        'g2-legend': {
          position: 'static',
          marginLeft: size.s5, // inline flex items 不能使用百分比的margin/padding，先改为固定大小
        },
      });
    } else {
      chart.legend(false);
    }

    // tooltip
    if (config.tooltip) {
      const tooltipCfg = {
        showTitle: false,
        // crosshairs: {},
      };
      chart.tooltip(tooltipCfg);
      if (config.tooltip.nameFormatter || config.tooltip.valueFormatter) {
        chart.on('tooltip:change', (ev) => {
          const raw = (this.rawData && this.rawData[0]) || {};

          ev.items.forEach((item, index) => {
            const percent = numberDecimal(item.value / this.totalData, 4);

            if (config.tooltip.valueFormatter) {
              item.value = config.tooltip.valueFormatter(item.value, {
                ...raw,
                percent
              }, index, ev.items);
            }
            if (config.tooltip.nameFormatter) {
              item.name = config.tooltip.nameFormatter(item.name, {
                ...raw,
                percent
              }, index, ev.items);
            }
          });
        });
      }
    } else {
      chart.tooltip(false);
    }

    // 下面这一句注释我还没看懂。
    // position若直接使用value导致图例点击某项隐藏，余下展示不为值和不为1
    chart.intervalStack().position('y').color('x', config.colors).select(false);

    chart.render();
  }
};
