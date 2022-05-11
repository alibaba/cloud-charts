'use strict';

// 引入所需要的库和样式
import { Chart, Types, BaseChartConfig, Colors } from '../common/types';
import Base from "../common/Base";
import rectXAxis, { XAxisConfig } from '../common/rectXAxis';
import rectYAxis, { YAxisConfig } from '../common/rectYAxis';
import rectTooltip, { TooltipConfig } from '../common/rectTooltip';
import rectLegend, { LegendConfig } from '../common/rectLegend';
import guide, { GuideConfig } from '../common/guide';
import label, { LabelConfig } from "../common/label";
import geomSize, { GeomSizeConfig } from '../common/geomSize';
import geomStyle, { GeomStyleConfig } from '../common/geomStyle';
import errorWrap from '../common/errorWrap';
import themes from '../themes/index';
import { propertyAssign, propertyMap } from '../common/common';
import autoTimeMask from '../common/autoTimeMask';
import legendFilter from '../common/legendFilter';

interface jitterConfig {
  adjustNames?: string[];
}

interface WscatterConfig extends BaseChartConfig {
  xAxis?: Types.ScaleOption & XAxisConfig | false;
  yAxis?: Types.ScaleOption & YAxisConfig | false;
  legend?: LegendConfig | boolean;
  tooltip?: TooltipConfig | boolean;
  guide?: GuideConfig;
  grid?: boolean;
  colors?: Colors;
  size?: GeomSizeConfig;
  jitter?: jitterConfig | boolean;
  label?: LabelConfig | boolean;
  geomStyle?: GeomStyleConfig;
}


export class Scatter extends Base<WscatterConfig> {
  chartName = 'G2Scatter';

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
    const { colors, jitter } = config;

    const defs: Record<string, Types.ScaleOption> = {
      x: propertyAssign(
        propertyMap.axis,
        {
          type: config.jitter ? 'cat' : 'linear',
        },
        config.xAxis
      ),
      type: {
        type: 'cat',
      },
    };

    defs.y = propertyAssign(
      propertyMap.axis,
      {
        type: 'linear',
        tickCount: 5,
        nice: true,
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

    rectXAxis(this, chart, config, xAxis);

    // 设置单个Y轴
    rectYAxis(this, chart, config);

    rectTooltip(this, chart, config, {
      crosshairs: null,
    }, null, {crosshairs: {type: 'xy'}});

    legendFilter(this, chart);

    // 绘制辅助线，辅助背景区域
    guide(chart, config);

    const geom = chart
      .point()
      .color('type', colors)
      .position('x*y')
      .shape('circle');

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

    geomStyle(geom, config.geomStyle)

    label({ geom: geom, config: config });

    geomSize(geom, config.size, 4, 'y', 'x*y*type*extra');
    chart.legend('x', false);
    chart.legend('y', false);
    chart.legend('extra', false);

    // fix: 设置 rectLegend 后如果再调用 chart.legend 会生成默认图例
    rectLegend(this, chart, config, null, false, 'type');
  }
}

const Wscatter: typeof Scatter = errorWrap(Scatter);
export default Wscatter;

