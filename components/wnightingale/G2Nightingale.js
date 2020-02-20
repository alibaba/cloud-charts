'use strict';

// 引入所需要的库和样式
import g2Factory from '../common/g2Factory';
import merge from '../common/merge';
import themes from '../theme/index';
import './G2Nightingale.scss';
import rectLegend from '../common/rectLegend';
import rectTooltip from '../common/rectTooltip';
import label from '../common/label';

// 对外暴露一个对象，除了init方法必选外，其余均为可选项，按组件需要选择性使用。
// 方法运行时的this指向图表实例，所以可以在this上挂载需要保留的数据。
export default g2Factory('G2Nightingale', {
  getDefaultConfig() {
    return {
      padding: [20, 20, 20, 20],
      colors: themes.category_12,
      cycle: false,
      innerRadius: 0.5, // 内环半径大小，仅cycle为true时可用
      label: {
        key: 'x',
      },
      legend: {
        position: 'bottom',
        align: 'center',
        nameFormatter: null,
      },
      tooltip: {
        nameFormatter: null,
        valueFormatter: null,
      },
    };
  },
  // 初始化前对props的预处理函数
  beforeInit(props) {
    const { config } = props;
    // TODO 处理padding
    return Object.assign({}, props, {
      padding: props.padding || config.padding || this.defaultConfig.padding,
    });
  },
  // 图表绘制主函数，必选
  init(chart, userConfig, data) {
    const config = merge({}, this.defaultConfig, userConfig);
    chart.source(data);
    chart.coord('polar', {
      innerRadius: config.cycle ? Math.max(Math.min(config.innerRadius, 1), 0) : 0,
    });

    // 设置图例
    rectLegend.call(this, chart, config, null, true);

    // tooltip
    rectTooltip.call(this, chart, config, {
      showTitle: false,
      crosshairs: null,
    });

    if (config.axis) {
      chart.axis('x', {
        grid: {
          align: 'center',
          hideFirstLine: false,
          hideLastLine: false,
        },
        label: {
          offset: 10,
          autoRotate: true,
          textStyle: {
            textAlign: 'center',
          },
        },
      });

      chart.axis('y', {
        tickLine: null,
        label: null,
        line: null,
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
        stroke: themes['widgets-color-white'],
      });

    label(geom, config, config.label.key || 'x', {
      offset: -15,
    });

    chart.render();
  },
});
