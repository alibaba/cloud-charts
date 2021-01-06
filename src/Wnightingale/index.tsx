'use strict';

import { Chart, Types, BaseChartConfig, Colors } from '../common/types';
import Base from '../common/Base';
import errorWrap from '../common/errorWrap';
import rectXAxis, { XAxisConfig } from '../common/rectXAxis';
import rectYAxis, { YAxisConfig } from '../common/rectYAxis';
import rectTooltip, { TooltipConfig } from '../common/rectTooltip';
import rectLegend, { LegendConfig } from '../common/rectLegend';
import { GuideConfig } from '../common/guide';
import label, { LabelConfig } from '../common/label';
import geomStyle, { GeomStyleConfig } from '../common/geomStyle';
import polarLegendLayout from '../common/polarLegendLayout';
import updateChildrenPosition from '../common/updateChildrenPosition';
import themes from '../themes/index';
import './index.scss';
import { warn } from '../common/log';

// 3.x代码
export interface WnightingaleConfig extends BaseChartConfig {
  /** X轴配置项 */
  xAxis?: Types.ScaleOption & XAxisConfig | false,
  /** Y轴配置项 */
  yAxis?: Types.ScaleOption & YAxisConfig | false,
  /** @deprecated axis 属性已废弃，请使用 xAxis 属性 */
  axis?: boolean;
  colors?: Colors;
  legend?: LegendConfig | boolean;
  tooltip?: TooltipConfig | boolean;
  guide?: GuideConfig;
  label?: LabelConfig | boolean;
  cycle?: boolean;
  innerRadius?: number;
  outerRadius?: number;
  geomStyle?: GeomStyleConfig;
}

export class Nightingale extends Base<WnightingaleConfig> {
  chartName = 'G2Nightingale';

  getDefaultConfig(): WnightingaleConfig {
    return {
      // padding: [20, 20, 20, 20],
      colors: themes.category_12,
      xAxis: false,
      yAxis: false,
      cycle: false,
      innerRadius: 0.5, // 内环半径大小，仅cycle为true时可用
      outerRadius: 1,
      label: {
        offset: -15
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
  }
  init(chart: Chart, config: WnightingaleConfig, data: any) {
    const defs: Record<string, Types.ScaleOption> = {
      type: {
        type: 'cat',
      },
    };

    chart.scale(defs);

    chart.data(data);
    chart.coordinate('polar', {
      innerRadius: config.cycle ? Math.max(Math.min(config.innerRadius, 1), 0) : 0,
      radius: Math.max(Math.min(config.outerRadius, 1), 0.01),
    });

    // 设置图例
    rectLegend.call(this, chart, config, null, true);

    // tooltip
    rectTooltip.call(
      this,
      chart,
      config,
      {
        showMarkers: false,
        showCrosshairs: false,
      },
      (ev: any) => {},
      {
        showTitle: false,
        showMarkers: false,
        showCrosshairs: false,
      },
    );

    if (config.axis) {
      warn('config.axis', '属性已废弃，请使用 config.xAxis 属性');
    }

    rectXAxis.call(this, chart, config);

    rectYAxis.call(this, chart, config);

    const geom = chart
      .interval()
      .position('x*y')
      .color('x', config.colors);

    geomStyle(geom, config.geomStyle, {
      lineWidth: 1,
      stroke: themes['widgets-color-background'],
    });

    label(geom, config, 'x', {});

    polarLegendLayout(chart);

    chart.on('afterrender', () => {
      updateChildrenPosition(chart, this.chartDom);
    });
  }
}
const Wnightingale: typeof Nightingale = errorWrap(Nightingale);

export default Wnightingale;

// 对外暴露一个对象，除了init方法必选外，其余均为可选项，按组件需要选择性使用。
// 方法运行时的this指向图表实例，所以可以在this上挂载需要保留的数据。
// export default /*#__PURE__*/ errorWrap(g2Factory('G2Nightingale', {
//   getDefaultConfig() {
//     return {
//       padding: [20, 20, 20, 20],
//       colors: themes.category_12,
//       cycle: false,
//       innerRadius: 0.5, // 内环半径大小，仅cycle为true时可用
//       label: {
//         key: 'x',
//       },
//       legend: {
//         position: 'bottom',
//         align: 'center',
//         nameFormatter: null,
//       },
//       tooltip: {
//         nameFormatter: null,
//         valueFormatter: null,
//       },
//     };
//   },
//   // 初始化前对props的预处理函数
//   beforeInit(props) {
//     const { config } = props;
//     // TODO 处理padding
//     return Object.assign({}, props, {
//       padding: props.padding || config.padding || this.defaultConfig.padding,
//     });
//   },
//   // 图表绘制主函数，必选
//   init(chart, userConfig, data) {
//     const config = merge({}, this.defaultConfig, userConfig);
//     chart.source(data);
//     chart.coord('polar', {
//       innerRadius: config.cycle ? Math.max(Math.min(config.innerRadius, 1), 0) : 0,
//     });

//     // 设置图例
//     rectLegend.call(this, chart, config, null, true);

//     // tooltip
//     rectTooltip.call(this, chart, config, {
//       showTitle: false,
//       crosshairs: null,
//     });

//     if (config.axis) {
//       chart.axis('x', {
//         grid: {
//           align: 'center',
//           hideFirstLine: false,
//           hideLastLine: false,
//         },
//         label: {
//           offset: 10,
//           autoRotate: true,
//           textStyle: {
//             textAlign: 'center',
//           },
//         },
//       });

//       chart.axis('y', {
//         tickLine: null,
//         label: null,
//         line: null,
//       });
//     } else {
//       chart.axis(false);
//     }

//     const geomStyle = config.geomStyle || {};
//     const geom = chart
//       .interval()
//       .position('x*y')
//       .color('x', config.colors)
//       .style('x*y*extra', {
//         lineWidth: 1,
//         stroke: themes['widgets-color-background'],
//         ...geomStyle
//       });

//     label(geom, config, config.label.key || 'x', {
//       offset: -15,
//     });

//     chart.render();
//   },
// }));
