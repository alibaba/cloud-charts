'use strict';

// 引入所需要的库和样式
import merge from '../utils/merge';
import { color } from '../theme/normal';
import './G2-base.scss';

// 建议将默认配置放在外层，方便后续维护
const defaultConfig = {
  padding: [20, 20, 20, 20],
  colors: color.category_12,
  label: {
    key: 'x'
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
