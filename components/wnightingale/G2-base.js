'use strict';

// 引入所需要的库和样式
import merge from '../utils/merge';
import { color } from '../theme/normal';
import './G2-base.scss';
import {noop} from "../chartCommon/common";

// 建议将默认配置放在外层，方便后续维护
const defaultConfig = {
  padding: [20, 20, 40, 20],
  colors: color.category_12,
  label: {
    key: 'x'
  },
  legend: {
    nameFormatter: null,
    offsetX: 0,
    offsetY: 0
  },
  tooltip: {
    nameFormatter: null,
    valueFormatter: null
  }
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
  init(chart, userConfig, data, rawData) {
    const config = merge({}, defaultConfig, userConfig);
    chart.source(data);
    chart.coord('polar');

    // 设置图例
    if (config.legend) {
      chart.legend({
        useHtml: true,
        title: null,
        offsetX: config.legend.offsetX || 0,
        offsetY: -50 + (config.legend.offsetY || 0),
        position: 'bottom',
        // 这个属性文档里没有，设置为false可以让图例不居中，再手动设置定位样式
        // autoPosition: false,
        onHover: noop,
        itemTpl: (value, color, checked, index) => {
          const item = (this.rawData && this.rawData[index]) || {};
          const result = config.legend.nameFormatter ? config.legend.nameFormatter(value, {
            ...item,
            color,
            checked
          }, index) : value;
          return '<li class="g2-legend-list-item item-{index} {checked}" data-color="{originColor}" data-value="{originValue}">' +
            '<i class="g2-legend-marker" style="background-color:{color};"></i>' +
            '<span class="g2-legend-text">' + result + '</span></li>';
        },
        // 'g2-legend': Object.assign({
        //   top: size.s3,
        // }, config.legend.align === 'right' ? { right: 0 } : { left: 0 }),
      });
    } else {
      chart.legend(false);
    }

    // tooltip
    if (config.tooltip) {
      let tooltipCfg = {
        showTitle: false
        // crosshairs: {},
      };
      chart.tooltip(tooltipCfg);
      if (config.tooltip.nameFormatter || config.tooltip.valueFormatter) {
        chart.on('tooltip:change', ev => {
          ev.items.forEach((item, index) => {
            const raw = (this.rawData && this.rawData[index]) || {};

            if (config.tooltip.valueFormatter) {
              item.value = config.tooltip.valueFormatter(
                item.value,
                raw,
                index,
                ev.items
              );
            }
            if (config.tooltip.nameFormatter) {
              item.name = config.tooltip.nameFormatter(
                item.name,
                raw,
                index,
                ev.items
              );
            }
          });
        });
      }
    } else {
      chart.tooltip(false);
    }

    if (config.axis) {
      chart.axis('x', {
        grid: {
          align: 'center',
          hideFirstLine: false,
          hideLastLine: false
        },
        label: {
          offset: 10,
          autoRotate: true,
          textStyle: {
            textAlign: 'center'
          }
        }
      });

      chart.axis('y', {
        tickLine: null,
        label: null,
        line: null
      });
    } else {
      chart.axis(false);
    }

    const geom = chart
      .interval()
      .position('x*y')
      .color('x', config.colors)
      .style({
        lineWidth: 1,
        stroke: color.widgetsColorWhite
      });

    if (config.label) {
      geom.label(config.label.key, {
        offset: -15
      });
    }

    chart.render();
  }
};
