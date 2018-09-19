'use strict';

// 引入所需要的库和样式
import merge from '../common/merge';
import { color } from '../theme/index';
import { propertyAssign, propertyMap, noop } from '../common/common';
import rectTooltip from '../common/rectTooltip';
import './G2Radar.scss';
import drawLine from "../common/drawLine";

// 建议将默认配置放在外层，方便后续维护
const defaultConfig = {
  padding: [20, 20, 40, 20],
  colors: color.category_12,
  xAxis: {
    labelFormatter: null, // 可以强制覆盖，手动设置label
  },
  yAxis: {
    labelFormatter: null, // 可以强制覆盖，手动设置label
    max: 100,
    min: 0,
  },
  radius: 0.8,
  area: false,
  symbol: false,
  // stack: false,
  legend: {
    nameFormatter: null,
    offsetX: 0,
    offsetY: 0
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
      padding: props.padding || config.padding || defaultConfig.padding
    });
  },
  // 图表绘制主函数，必选
  init(chart, userConfig, data) {
    const config = merge({}, defaultConfig, userConfig);

    const defs = {
      type: {
        type: 'cat'
      }
    };

    defs.y = propertyAssign(propertyMap.yAxis, {
      type: 'linear',
      tickCount: 5
    }, config.yAxis);

    chart.source(data, defs);

    chart.coord('polar', {
      radius: config.radius
    });

    chart.axis('x', {
      label: {
        formatter: config.xAxis.labelFormatter,
      },
      line: null,
      tickLine: null,
      grid: {
        lineStyle: {
          lineDash: null
        },
        //hideFirstLine: false
      }
    });
    chart.axis('y', {
      label: {
        offset: 8,
        textStyle: {
          fill: color.widgetsAxisLabel,
          textAlign: 'right', // 文本右对齐
        },
        htmlTemplate(text, item, index) {
          if (config.yAxis.labelFormatter) {
            return config.yAxis.labelFormatter(text, item, index);
          }
          return text;
        }
      },
      line: null,
      tickLine: null,
      grid: {
        type: 'polygon',
        lineStyle: {
          lineDash: null
        }
      }
    });

    // 设置图例
    if (config.legend) {
      chart.legend({
        useHtml: true,
        title: null,
        offsetX: config.legend.offsetX || 0,
        offsetY: config.legend.offsetY || 0,
        position: 'bottom',
        // 这个属性文档里没有，设置为false可以让图例不居中，再手动设置定位样式
        // autoPosition: false,
        onHover: noop,
        itemTpl: (value, itemColor, checked, index) => {
          const item = (this.rawData && this.rawData[index]) || {};
          const result = config.legend.nameFormatter ? config.legend.nameFormatter(value, {
            ...item,
            itemColor,
            checked
          }, index) : value;
          return `${'<li class="g2-legend-list-item item-{index} {checked}" data-color="{originColor}" data-value="{originValue}">' +
            '<i class="g2-legend-marker" style="background-color:{color};"></i>' +
            '<span class="g2-legend-text">'}${result}</span></li>`;
        },
        // 'g2-legend': Object.assign({
        //   top: size.s3,
        // }, config.legend.align === 'right' ? { right: 0 } : { left: 0 }),
      });
    } else {
      chart.legend(false);
    }

    // tooltip
    rectTooltip.call(this, chart, config, {
      crosshairs: null
    });

    const lineShape = config.spline ? 'smooth' : 'line';
    const areaShape = config.spline ? 'smooth' : 'area';

    drawLine(chart, config, lineShape, areaShape);

    chart.render();
  }
};
