'use strict';
// 依赖更新部分
import { Chart, Types, BaseChartConfig } from '../common/types';
import Base from "../common/Base";
import rectXAxis, { XAxisConfig } from '../common/rectXAxis';
import rectYAxis, { YAxisConfig } from '../common/rectYAxis';
import rectTooltip, { TooltipConfig } from '../common/rectTooltip';
import rectLegend, { LegendConfig } from '../common/rectLegend';
import guide, { GuideConfig } from '../common/guide';
import label, { LabelConfig } from "../common/label";

// 2.x版本依赖
import errorWrap from '../common/errorWrap';
import merge from '../common/merge';
import themes from '../themes/index';
import { propertyAssign, propertyMap } from '../common/common';
import legendFilter from '../common/legendFilter';
import drawLine from '../common/drawLine';

import './index.scss';

//3.x代码
interface WRadarConfig extends BaseChartConfig {
  colors?: string[];
  areaColors?: string[];
  xAxis?: Types.ScaleOption & XAxisConfig | false,
  yAxis?: Types.ScaleOption & YAxisConfig | false,
  legend?: LegendConfig | boolean,
  tooltip?: TooltipConfig | boolean,
  guide?: GuideConfig,
  area?: boolean,
  symbol?: boolean,
  spline?: boolean,
  label?: LabelConfig | boolean,
}

class WRadar extends Base<WRadarConfig> {
  getDefaultConfig(): WRadarConfig {
    return {
      // colors: themes.category_12,
      xAxis: {
        labelFormatter: null,
      },
      yAxis: {
        labelFormatter: null, // 可以强制覆盖，手动设置label
        min: 0,
      },
      // radius: 0.8,
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
      area: false,
      symbol: false,
      label: false,
      spline: false,
    }
  }
  init(chart: Chart, config: WRadarConfig, data: any) {

    const defs: Record<string, Types.ScaleOption> = {
      x: propertyAssign(propertyMap.xAxis, {
        // type: 'cat',
        // 折线图X轴的范围默认覆盖全部区域，保证没有空余
        // range: [0, 1],
      }, config.xAxis),
      type: {
        type: 'cat',
      },
    };

    if (Array.isArray(config.yAxis)) {
      config.yAxis.forEach((axis, yIndex) => {
        defs[`y${yIndex}`] = propertyAssign(propertyMap.yAxis, {
          type: 'linear',
          tickCount: 5,
        }, axis);
      });
    } else {
      defs.y = propertyAssign(propertyMap.yAxis, {
        type: 'linear',
        tickCount: 5,
      }, config.yAxis);
    }

    chart.scale(defs);

    chart.data(data);

    // 设置X轴
    rectXAxis.call(this, chart, config);

    if (Array.isArray(config.yAxis)) {
      config.yAxis.forEach((axis, yIndex) => {
        const yAxisConfig: Types.AxisCfg = {
          label: {
            offset: 8,
          },
          line: null,
          tickLine: null,
          grid: {
            // type: 'polygon',
            // lineStyle: {
            //   lineDash: null,
            // },
          },
        };
        if (yIndex !== 0) {
          yAxisConfig.grid = null;
        }

        rectYAxis.call(this, chart, { ...config, yAxis: axis }, `y${yIndex}`, yAxisConfig);
      });
    } else {
      // 设置单个Y轴
      rectYAxis.call(this, chart, config);
    }

    // 设置图例
    rectLegend.call(this, chart, config, null, false, 'type');

    legendFilter.call(this, chart, config);

    // tooltip
    rectTooltip.call(this, chart, config);

    // 绘制辅助线，辅助背景区域
    guide(chart, config);

    if (Array.isArray(config.yAxis)) {
      config.yAxis.forEach((asix, yIndex) => {
        drawLine(chart, config, `y${yIndex}`);
      });
    } else {
      drawLine(chart, config);
    }
  }
}

export default WRadar;

// 2.x版本
// 对外暴露一个对象，除了init方法必选外，其余均为可选项，按组件需要选择性使用。
// 方法运行时的this指向图表实例，所以可以在this上挂载需要保留的数据。
// export default /*#__PURE__*/ errorWrap(g2Factory('G2Radar', {
//   getDefaultConfig() {
//     return {
//       padding: [20, 20, 40, 20],
//       colors: themes.category_12,
//       xAxis: {
//         labelFormatter: null, // 可以强制覆盖，手动设置label
//       },
//       yAxis: {
//         labelFormatter: null, // 可以强制覆盖，手动设置label
//         // max: 100,
//         min: 0,
//       },
//       radius: 0.8,
//       area: false,
//       symbol: false,
//       label: false,
//       spline: false,
//       // stack: false,
//       legend: {
//         position: 'bottom',
//         align: 'center',
//         nameFormatter: null,
//       },
//       tooltip: {
//         titleFormatter: null,
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

//     const defs = {
//       x: propertyAssign(propertyMap.xAxis, {
//         // type: 'cat',
//         // 折线图X轴的范围默认覆盖全部区域，保证没有空余
//         // range: [0, 1],
//       }, config.xAxis),
//       type: {
//         type: 'cat',
//       },
//     };

//     defs.y = propertyAssign(propertyMap.yAxis, {
//       type: 'linear',
//       tickCount: 5,
//     }, config.yAxis);

//     chart.source(data, defs);

//     chart.coord('polar', {
//       radius: config.radius,
//     });

//     // 设置X轴
//     rectXAxis.call(this, chart, config, {
//       line: null,
//       tickLine: null,
//       grid: {
//         lineStyle: {
//           lineDash: null,
//         },
//       },
//     });
//     // chart.axis('x', {
//     //   label: {
//     //     formatter: config.xAxis.labelFormatter,
//     //   },
//     //   line: null,
//     //   tickLine: null,
//     //   grid: {
//     //     lineStyle: {
//     //       lineDash: null,
//     //     },
//     //     // hideFirstLine: false
//     //   },
//     // });
//     // 设置Y轴
//     rectYAxis.call(this, chart, config, 'y', {
//       label: {
//         offset: 8,
//         textStyle: {
//           fill: themes['widgets-axis-label'],
//           textAlign: 'right', // 文本右对齐
//         },
//         formatter: config.yAxis.labelFormatter,
//         // 之前使用 htmlTemplate 是为了覆盖在line图形之上，和视觉确认后不需要这么做，直接使用默认 formatter 即可。
//         // htmlTemplate(text, item, index) {
//         //   if (config.yAxis.labelFormatter) {
//         //     return config.yAxis.labelFormatter(text, item, index);
//         //   }
//         //   return `<span style="color: ${themes['widgets-axis-label']}">${text}</span>`;
//         // }
//       },
//       line: null,
//       tickLine: null,
//       grid: {
//         type: 'polygon',
//         lineStyle: {
//           lineDash: null,
//         },
//       },
//     });

//     // 设置图例
//     rectLegend.call(this, chart, config);

//     legendFilter.call(this, chart, config);

//     // tooltip
//     rectTooltip.call(this, chart, config, {
//       crosshairs: null,
//     });

//     drawLine(chart, config);

//     chart.render();
//   },
// }));
