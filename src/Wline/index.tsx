'use strict';

import { Chart, Types, BaseChartConfig } from '../common/types';
import Base from "../common/Base";
import errorWrap from '../common/errorWrap';
import themes from '../themes';
import { getDataIndexColor, propertyAssign, propertyMap } from '../common/common';
import guide, { GuideConfig } from '../common/guide';
import rectXAxis, { XAxisConfig } from '../common/rectXAxis';
import rectYAxis, { YAxisConfig } from '../common/rectYAxis';
import autoTimeMask from '../common/autoTimeMask';
import rectTooltip, { TooltipConfig } from '../common/rectTooltip';
import rectLegend, { LegendConfig } from '../common/rectLegend';
import legendFilter from '../common/legendFilter';
import rectZoom, { ZoomConfig } from "../common/rectZoom";
import rectSlider, { SliderConfig } from '../common/rectSlider';
import drawLine, { DrawLineConfig } from '../common/drawLine';
import './index.scss';

export interface WlineConfig extends BaseChartConfig, DrawLineConfig, ZoomConfig, SliderConfig {
  /** X轴配置项 */
  xAxis?: Types.ScaleOption & XAxisConfig | false;
  /** Y轴配置项 */
  yAxis?: Types.ScaleOption & YAxisConfig | false;
  /** 图例配置项 */
  legend?: LegendConfig | boolean;
  /** 提示信息配置项 */
  tooltip?: TooltipConfig | boolean;
  /** 辅助标记配置项 */
  guide?: GuideConfig;
  /** 显示网格线 */
  grid?: boolean;
}

export class Line extends Base<WlineConfig> {
  chartName = 'G2Line';

  getDefaultConfig(): WlineConfig {
    return {
      colors: themes.category_12,
      areaColors: [],
      xAxis: {
        type: 'time', // 默认为线性
        mask: 'auto', // 上述type为time时，此字段生效
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
      area: false,
      stack: false, // 仅Area有效
      spline: false,
      grid: false,
      symbol: false,
      zoom: false,
      label: false,
      step: null,
      // TODO
      // mini: false,
      // dataConfig: {
      //   nameKey: 'name',
      //   valueKey: 'value',
      //   // valueKey: ['value1', 'value2'],
      //   typeKey: 'type'
      // }
    };
  }
  init(chart: Chart, config: WlineConfig, data: any) {
    const defs: Record<string, Types.ScaleOption> = {
      x: propertyAssign(propertyMap.axis, {
        type: 'time',
        // 折线图X轴的范围默认覆盖全部区域，保证没有空余
        range: [0, 1],
      }, config.xAxis),
      type: {
        type: 'cat',
      },
    };

    if (Array.isArray(config.yAxis)) {
      config.yAxis.forEach((axis, yIndex) => {
        defs[`y${yIndex}`] = propertyAssign(propertyMap.axis, {
          type: 'linear',
          tickCount: 5,
          nice: true,
        }, axis);
      });
    } else {
      defs.y = propertyAssign(propertyMap.axis, {
        type: 'linear',
        tickCount: 5,
        nice: true,
      }, config.yAxis);
    }

    autoTimeMask(defs, this.rawData);

    // rectAutoTickCount(chart, config, defs, false);

    chart.scale(defs);

    chart.data(data);

    // 设置X轴
    rectXAxis.call(this, chart, config);

    if (Array.isArray(config.yAxis)) {
      config.yAxis.forEach((axis, yIndex) => {
        const yAxisConfig: Types.AxisCfg = {
          line: {
            style: {
              stroke: getDataIndexColor(config.colors, this.rawData, yIndex) || themes['widgets-axis-line'],
            },
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

    legendFilter.call(this, chart);

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

    // 拖拽缩放
    rectZoom(chart, config, this.language);

    // 缩略轴
    rectSlider(chart, config);
  }
}

/** Wline 折线图 */
const Wline: typeof Line = errorWrap(Line);

export default Wline;

// /*#__PURE__*/errorWrap(g2Factory('G2Line', {
//   beforeInit(props) {
//     const { config } = props;
//     const newConfig = merge({}, this.defaultConfig, config);
//
//     // // TODO 处理padding
//     // let defaultPaddingTop = defaultConfig.padding[0];
//     // let defaultPaddingRight = defaultConfig.padding[1];
//     // const defaultPaddingBottom = defaultConfig.padding[2];
//     // const defaultPaddingLeft = defaultConfig.padding[3];
//     // if (defaultPaddingRight !== 'auto' && Array.isArray(newConfig.yAxis)) {
//     //   defaultPaddingRight = 44;
//     // }
//     // if (defaultPaddingTop !== 'auto' && !newConfig.legend) {
//     //   defaultPaddingTop = 16;
//     // }
//     return Object.assign({}, props, {
//       // padding: props.padding || config.padding || [defaultPaddingTop, defaultPaddingRight, defaultPaddingBottom, defaultPaddingLeft],
//       padding: defaultPadding(props.padding || config.padding, newConfig, ...this.defaultConfig.padding),
//       config: newConfig,
//     });
//   },
//   changeData(chart, config, data) {
//     chart.changeData(data);
//
//     // 更新 brush 的 scale 实例，fix 数据更新后拖动缩放失效的问题。
//     if (config.zoom && this.brush) {
//       this.brush.xScale = chart.getXScale();
//       this.brush.yScale = chart.getYScales()[0];
//     }
//   },
//   destroy() {
//     // 销毁时需要额外销毁缩放重置按钮
//     if (this.brush) {
//       this.brush.destroy();
//     }
//     if (this.resetButton) {
//       this.resetButton.destroy();
//     }
//   },
// }));
