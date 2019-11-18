'use strict';

// 引入所需要的库和样式
import merge from '../common/merge';
import themes from '../theme/index';
import { propertyAssign, propertyMap, noop } from '../common/common';
import rectLegend from '../common/rectLegend';
import legendFilter from '../common/legendFilter';
import rectTooltip from '../common/rectTooltip';
import drawLine from '../common/drawLine';
import './G2Radar.scss';

// 建议将默认配置放在外层，方便后续维护
const defaultConfig = {
  padding: [20, 20, 40, 20],
  colors: themes.category_12,
  xAxis: {
    labelFormatter: null, // 可以强制覆盖，手动设置label
  },
  yAxis: {
    labelFormatter: null, // 可以强制覆盖，手动设置label
    // max: 100,
    min: 0,
  },
  radius: 0.8,
  area: false,
  symbol: false,
  label: false,
  spline: false,
  // stack: false,
  legend: {
    position: 'bottom',
    align: 'center',
    nameFormatter: null,
  },
  tooltip: {
    titleFormatter: null,
    nameFormatter: null,
    valueFormatter: null,
  },
};

// 对外暴露一个对象，除了init方法必选外，其余均为可选项，按组件需要选择性使用。
// 方法运行时的this指向图表实例，所以可以在this上挂载需要保留的数据。
export default {
  // 初始化前对props的预处理函数
  beforeInit(props) {
    const { config } = props;
    // TODO 处理padding
    return Object.assign({}, props, {
      padding: props.padding || config.padding || defaultConfig.padding,
    });
  },
  // 图表绘制主函数，必选
  init(chart, userConfig, data) {
    const config = merge({}, defaultConfig, userConfig);

    const defs = {
      x: propertyAssign(propertyMap.xAxis, {
        // type: 'cat',
        // 折线图X轴的范围默认覆盖全部区域，保证没有空余
        // range: [0, 1],
      }, config.xAxis),
      type: {
        type: 'cat',
      },
    };

    defs.y = propertyAssign(propertyMap.yAxis, {
      type: 'linear',
      tickCount: 5,
    }, config.yAxis);

    chart.source(data, defs);

    chart.coord('polar', {
      radius: config.radius,
    });

    chart.axis('x', {
      label: {
        formatter: config.xAxis.labelFormatter,
      },
      line: null,
      tickLine: null,
      grid: {
        lineStyle: {
          lineDash: null,
        },
        // hideFirstLine: false
      },
    });
    chart.axis('y', {
      label: {
        offset: 8,
        textStyle: {
          fill: themes['widgets-axis-label'],
          textAlign: 'right', // 文本右对齐
        },
        formatter: config.yAxis.labelFormatter,
        // 之前使用 htmlTemplate 是为了覆盖在line图形之上，和视觉确认后不需要这么做，直接使用默认 formatter 即可。
        // htmlTemplate(text, item, index) {
        //   if (config.yAxis.labelFormatter) {
        //     return config.yAxis.labelFormatter(text, item, index);
        //   }
        //   return `<span style="color: ${themes['widgets-axis-label']}">${text}</span>`;
        // }
      },
      line: null,
      tickLine: null,
      grid: {
        type: 'polygon',
        lineStyle: {
          lineDash: null,
        },
      },
    });

    // 设置图例
    rectLegend.call(this, chart, config, {
      itemTpl: (value, itemColor, checked, index) => {
        const item = (this.rawData && this.rawData[index]) || {};
        const result = config.legend.nameFormatter ? config.legend.nameFormatter(value, {
          ...item,
          itemColor,
          checked,
        }, index) : value;
        return `${'<li class="g2-legend-list-item item-{index} {checked}" data-color="{originColor}" data-value="{originValue}">' +
        '<i class="g2-legend-marker" style="background-color:{color};"></i>' +
        '<span class="g2-legend-text">'}${result}</span></li>`;
      },
    }, true);

    legendFilter.call(this, chart, config);

    // tooltip
    rectTooltip.call(this, chart, config, {
      crosshairs: null,
    });

    drawLine(chart, config);

    chart.render();
  },
};
