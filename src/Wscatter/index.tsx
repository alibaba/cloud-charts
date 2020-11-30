'use strict';

// 引入所需要的库和样式
import { Chart, Types, BaseChartConfig } from '../common/types';
import Base from "../common/Base";
import rectXAxis, { XAxisConfig } from '../common/rectXAxis';
import rectYAxis, { YAxisConfig } from '../common/rectYAxis';
import rectTooltip, { TooltipConfig } from '../common/rectTooltip';
import rectLegend, { LegendConfig } from '../common/rectLegend';
import guide, { GuideConfig } from '../common/guide';
import label, { LabelConfig } from "../common/label";

// import errorWrap from '../common/errorWrap';
// import merge from '../common/merge';
import themes from '../themes/index';
import { propertyAssign, propertyMap } from '../common/common';
import autoTimeMask from '../common/autoTimeMask';
import legendFilter from '../common/legendFilter';
// import getGeomSizeConfig from '../common/geomSize';

interface jitterConfig {
  adjustNames?: string[];
}

interface WscatterConfig extends BaseChartConfig {
  xAxis?: Types.ScaleOption & XAxisConfig | false,
  yAxis?: Types.ScaleOption & YAxisConfig | false,
  legend?: LegendConfig | boolean,
  tooltip?: TooltipConfig | boolean,
  guide?: GuideConfig,
  grid?: boolean,
  colors?: string[],
  size: number,
  jitter: jitterConfig | boolean,
  label?: LabelConfig | boolean,
  geomStyle?: Types.LooseObject
}


export default class Wscatte extends Base<WscatterConfig> {
  // 原 g2Factory 的第一个参数，改为类的属性。
  chartName = 'G2Line';
  getDefaultConfig(): WscatterConfig {
    return {
      // padding: ['auto', 'auto', 'auto', 'auto'],
      colors: themes.category_12,
      xAxis: {
        mask: 'auto',
        autoRotate: false,
      },
      yAxis: {
        min: 0,
      },
      size: 4,
      jitter: false,
      tooltip: true,
      legend: true,
      label: false,
    };
  }

  init(chart: Chart, config: WscatterConfig, data: any) {
    // const config = userConfig;
    const { colors, jitter, geomStyle = {} } = config;

    const defs: Record<string, Types.ScaleOption> = {
      x: propertyAssign(
        propertyMap.xAxis,
        {
          type: config.jitter ? 'cat' : 'linear',
        },
        config.xAxis
      ),
      type: {
        type: 'cat',
      },
    };
    console.log(defs.x,defs)

    defs.y = propertyAssign(
      propertyMap.yAxis,
      {
        type: 'linear',
        tickCount: 5,
      },
      config.yAxis
    );

    autoTimeMask(defs, this.rawData);

    // rectAutoTickCount(chart, config, defs, false);

    // chart.source(data, defs);
    chart.scale(defs);
    chart.data(data);

    // 设置X轴
    const xAxis: any = {};

    if (config.jitter) {
      xAxis.grid = {
        align: 'center', // 网格顶点从两个刻度中间开始
        line:{
          style: {
            stroke: themes['widgets-axis-grid'],
            lineWidth: 1,
            // lineDash: [3, 3]
          },
        }
      };
    }

    // 扰动点图不能打开垂直网格线
    if (config.grid && !config.jitter) {
      xAxis.grid = {
        line: {
          style: {
            stroke: themes['widgets-axis-grid'],
            lineWidth: 1,
          }
        },
      };
    }

    rectXAxis.call(this, chart, config, xAxis);

    // 设置单个Y轴
    rectYAxis.call(this, chart, config);

    rectTooltip.call(this, chart, config, {
      crosshairs: null,
    }, null, {crosshairs: {type: 'xy'}});

    legendFilter.call(this, chart, config);

    // 绘制辅助线，辅助背景区域
    guide(chart, config);

    const geom = chart
      .point()
      .color('type', colors)
      .position('x*y')
      .shape('circle')
      .style(geomStyle)
      // .active(false);

    if (jitter) {
      if (typeof jitter === 'object') {
        geom.adjust({
          type: 'jitter',
          ...jitter,
        });
      } else {
        geom.adjust('jitter');
      }
    }

    label(geom, config);

    // if (size) {
    //   const sizeConfig = getGeomSizeConfig(size, 4, 'y', 'x*y*type*extra');
    //   geom.size(...sizeConfig);
    //   chart.legend('x', false);
    //   chart.legend('y', false);
    //   chart.legend('extra', false);
    // }

    // fix: 设置 rectLegend 后如果再调用 chart.legend 会生成默认图例
    rectLegend.call(this, chart, config, null, false, 'type');

    chart.render();
  }
};
