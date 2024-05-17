'use strict';

import { Chart, Types, BaseChartConfig } from '../common/types';
import Base from "../common/Base";
import errorWrap from '../common/errorWrap';
import rectXAxis, { XAxisConfig } from '../common/rectXAxis';
import rectYAxis, { YAxisConfig } from '../common/rectYAxis';
import rectTooltip, { TooltipConfig } from '../common/rectTooltip';
import rectLegend, { LegendConfig } from '../common/rectLegend';
import guide, { GuideConfig } from '../common/guide';
import { propertyAssign, propertyMap } from '../common/common';
import legendFilter from '../common/legendFilter';
import drawLine, { DrawLineConfig } from '../common/drawLine';
import polarLegendLayout from '../common/polarLegendLayout';
import autoTimeScale from '../common/autoTimeScale';
import themes from '../themes';
import './index.scss';

// 3.x代码
export interface WradarConfig extends BaseChartConfig, DrawLineConfig {
  xAxis?: Types.ScaleOption & XAxisConfig | false,
  yAxis?: Types.ScaleOption & YAxisConfig | false,
  legend?: LegendConfig | boolean,
  tooltip?: TooltipConfig | boolean,
  guide?: GuideConfig,
  radius?: number;
}

export class Radar extends Base<WradarConfig> {
  chartName = 'G2Radar';

  getDefaultConfig(): WradarConfig {
    return {
      colors: themes.category_12,
      areaColors: [],
      xAxis: {
        labelFormatter: null,
      },
      yAxis: {
        labelFormatter: null, // 可以强制覆盖，手动设置label
        min: 0,
      },
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
      radius: 1,
    }
  }
  init(chart: Chart, config: WradarConfig, data: any) {

    const defs: Record<string, Types.ScaleOption> = {
      x: propertyAssign(propertyMap.axis, {
        // type: 'time',
        // 折线图X轴的范围默认覆盖全部区域，保证没有空余
        // range: [0, 1],
      }, config.xAxis),
      y: propertyAssign(propertyMap.axis, {
        type: 'linear',
        tickCount: 5,
        nice: true,
      }, config.yAxis),
      type: {
        type: 'cat',
      },
    };

    autoTimeScale(defs, this.rawData, this.language || this.context.language);

    chart.scale(defs);
    chart.data(data);

    // 极坐标配置
    chart.coordinate('polar', {
      radius: config.radius,
    });

    // 设置X轴
    rectXAxis(this, chart, config);

      // 设置单个Y轴
    rectYAxis(this, chart, config);

    // 设置图例
    rectLegend(this, chart, config, null, 'multiple', 'type', true);

    legendFilter(this, chart);

    // tooltip
    rectTooltip(this, chart, config, {}, null, {
      showCrosshairs: true,
      crosshairs: {
        type: 'xy',
        // line: {
        //   style: {
        //     stroke: '#565656',
        //     lineDash: [4],
        //   },
        // },
        // follow: true
      }
    });

    // 绘制辅助线，辅助背景区域
    guide(chart, config);

    drawLine(chart, config);

    polarLegendLayout(chart);
  }
}

const Wradar: typeof Radar = errorWrap(Radar);

export default Wradar;
