'use strict';
import { Chart, Types, BaseChartConfig } from '../common/types';
import Base from '../common/Base';

import rectXAxis, { XAxisConfig } from '../common/rectXAxis';
import rectYAxis, { YAxisConfig } from '../common/rectYAxis';
import rectTooltip, { TooltipConfig } from '../common/rectTooltip';
import rectLegend, { LegendConfig } from '../common/rectLegend';
import guide, { GuideConfig } from '../common/guide';
import { LabelConfig } from '../common/label';
import themes from '../themes/index';
import { propertyAssign, propertyMap } from '../common/common';
import legendFilter from '../common/legendFilter';
import './index.scss';

// 3.x代码
interface WheatmapConfig extends BaseChartConfig {
  colors?: string[];
  xAxis?: Types.ScaleOption & XAxisConfig | false,
  yAxis?: Types.ScaleOption & YAxisConfig | false,
  legend?: LegendConfig | boolean;
  tooltip?: TooltipConfig | boolean;
  guide?: GuideConfig;
  label?: LabelConfig | boolean;
  geomStyle?: Types.LooseObject;
  coordinate?: Types.LooseObject;
}

class Wheatmap extends Base<WheatmapConfig> {
  chartName = 'G2Heatmap';

  getDefaultConfig(): WheatmapConfig {
    return {
      colors: themes.category_12,
      // padding: ['auto', 'auto', 'auto', 'auto'],
      xAxis: {
        type: 'cat',
        labelFormatter: null, // 可以强制覆盖，手动设置label
        categories: null,
        autoRotate: false,
      },
      yAxis: {
        labelFormatter: null, // 可以强制覆盖，手动设置label
        max: null,
        min: null,
      },
      legend: {
        align: 'left',
        nameFormatter: null, // 可以强制覆盖，手动设置label
      },
      tooltip: {
        titleFormatter: null,
        nameFormatter: null,
        valueFormatter: null,
      },
      // grid: false,
      // label: false,
      coordinate: null,
    };
  }
  init(chart: Chart, config: WheatmapConfig, data: any) {
    const defs: Record<string, Types.ScaleOption> = {
      x: propertyAssign(
        propertyMap.xAxis,
        {
          type: 'cat',
        },
        config.xAxis,
      ),
      y: propertyAssign(
        propertyMap.yAxis,
        {
          type: 'cat',
        },
        config.yAxis,
      ),
      type: {
        type: 'cat',
      },
    };

    chart.scale(defs);

    chart.data(data);

    if (config.coordinate) {
      const { type = 'rect', reflect } = config.coordinate;
      const coord = chart.coord(type);
      if (reflect) {
        coord.reflect(reflect);
      }
    }

    // 设置单个Y轴
    rectYAxis.call(this, chart, config, undefined, {
      grid: null,
    });

    // 设置X轴
    rectXAxis.call(this, chart, config);

    chart.legend('x', false);
    chart.legend('y', false);
    // 设置图例
    rectLegend.call(this, chart, config);

    legendFilter.call(this, chart, config);

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
        showMarkers: false,
        showCrosshairs: false,
      },
    );

    // 绘制辅助线，辅助背景区域
    guide(chart, config);

    const geomStyle = config.geomStyle || {};

    chart
      .polygon()
      .position('x*y')
      .color('type', config.colors)
      .tooltip('x*y*extra', (x, y, extra) => {
        return {
          name: `${x} - ${y}`,
          value: (Array.isArray(extra) ? extra[0] : extra.value) || '-',
        };
      })
      .style({
        lineWidth: 1,
        stroke: themes['widgets-map-area-border'],
        ...geomStyle,
      });
  }
}
export default Wheatmap;

// export default /*#__PURE__*/ errorWrap(g2Factory('G2Heatmap', {
//   getDefaultConfig() {
//     return {
//       colors: themes.category_12,
//       padding: ['auto', 'auto', 'auto', 'auto'],
//       xAxis: {
//         type: 'cat',
//         labelFormatter: null, // 可以强制覆盖，手动设置label
//         categories: null,
//         autoRotate: false,
//       },
//       yAxis: {
//         labelFormatter: null, // 可以强制覆盖，手动设置label
//         max: null,
//         min: null,
//       },
//       legend: {
//         align: 'left',
//         nameFormatter: null, // 可以强制覆盖，手动设置label
//       },
//       tooltip: {
//         titleFormatter: null,
//         nameFormatter: null,
//         valueFormatter: null,
//       },
//       // grid: false,
//       // label: false,
//       coordinate: null,
//     };
//   },
//   beforeInit(props) {
//     const { config } = props;
//     const newConfig = merge({}, this.defaultConfig, config);

//     // TODO 处理padding
//     return Object.assign({}, props, {
//       padding: defaultPadding(props.padding || config.padding, newConfig, ...this.defaultConfig.padding),
//       config: newConfig,
//     });
//   },
//   init(chart, userConfig, data) {
//     const config = userConfig;

//     // 设置数据度量
//     const defs = {
//       x: propertyAssign(propertyMap.xAxis, {
//         type: 'cat',
//       }, config.xAxis),
//       y: propertyAssign(propertyMap.yAxis, {
//         type: 'cat',
//       }, config.yAxis),
//       type: {
//         type: 'cat',
//         // sync: true,
//       },
//     };

//     chart.source(data, defs);

//     if (config.coordinate) {
//       const { type = 'rect', reflect } = config.coordinate;
//       const coord = chart.coord(type);
//       if (reflect) {
//         coord.reflect(reflect);
//       }
//     }

//     // 设置单个Y轴
//     rectYAxis.call(this, chart, config, undefined, {
//       grid: null,
//     });

//     // 设置X轴
//     rectXAxis.call(this, chart, config);

//     chart.legend('x', false);
//     chart.legend('y', false);
//     // 设置图例
//     rectLegend.call(this, chart, config);

//     legendFilter.call(this, chart, config);

//     // tooltip
//     rectTooltip.call(this, chart, config, {
//       showTitle: false,
//       crosshairs: null,
//     });

//     // 绘制辅助线，辅助背景区域
//     guide(chart, config);

//     const geomStyle = config.geomStyle || {};

//     chart.polygon()
//       .position('x*y')
//       .color('type', config.colors)
//       .tooltip('x*y*extra', (x, y, extra) => {
//         return {
//           name: `${x} - ${y}`,
//           value: (Array.isArray(extra) ? extra[0] : extra.value) || '-',
//         };
//       })
//       .style('x*y*type*extra', {
//         lineWidth: 1,
//         stroke: themes['widgets-map-area-border'],
//         ...geomStyle,
//       });

//     // label(geom, config, 'extra');

//     chart.render();
//   },
//   // changeData(chart, config, data) {
//   //   chart.changeData(data);
//   // },
//   // destroy() {
//   // },
// }));

