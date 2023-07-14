'use strict';

import { Chart, Types, BaseChartConfig, Colors } from '../common/types';
import Base from "../common/Base";
import errorWrap from '../common/errorWrap';
import themes from '../themes/index';
import { propertyAssign, propertyMap } from '../common/common';
import legendFilter from '../common/legendFilter';
import rectXAxis, { XAxisConfig } from '../common/rectXAxis';
import rectYAxis, { YAxisConfig } from '../common/rectYAxis';
import rectTooltip, { TooltipConfig } from '../common/rectTooltip';
import rectLegend, { LegendConfig } from '../common/rectLegend';
import guide, { GuideConfig } from '../common/guide';
// import { LabelConfig } from "../common/label";
import geomSize, { GeomSizeConfig } from '../common/geomSize';
import geomStyle, { GeomStyleConfig } from '../common/geomStyle';
import { activeRegionWithTheme } from '../common/interaction';
import './index.scss';

interface WboxConfig extends BaseChartConfig {
  colors?: Colors;
  xAxis?: Types.ScaleOption & XAxisConfig | false;
  yAxis?: Types.ScaleOption & YAxisConfig | false;
  legend?: LegendConfig | boolean;
  tooltip?: TooltipConfig | boolean;
  guide?: GuideConfig;
  // label?: LabelConfig | boolean;
  dodge?: boolean;
  marginRatio?: number;
  grid?: boolean;
  size?: GeomSizeConfig;
  geomStyle?: GeomStyleConfig;
}

export class Box extends Base<WboxConfig> {

  chartName = 'G2Box';

  getDefaultConfig():WboxConfig {
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
      dodge: true,
      marginRatio: 0,
      grid: false,
      // zoom: false,
      size: null,
      // label: false,
    };
  }

  init(chart: Chart, config: WboxConfig, data: any) {

    // 设置数据度量
    const defs: Record<string, Types.ScaleOption> = {
      x: propertyAssign(propertyMap.axis, {
        type: 'cat',
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

    chart.scale(defs);
    chart.data(data);

    // 设置单个Y轴
    rectYAxis(this, chart, config);

    // 设置X轴
    rectXAxis(this, chart, config);

    // 设置图例
    rectLegend(this, chart, config, null, false, 'type');

    legendFilter(this, chart);

    // tooltip
    rectTooltip(this, chart, config, {}, null, {
      showCrosshairs: false,
      showMarkers: false,
    });
    activeRegionWithTheme(chart);

    // 绘制辅助线，辅助背景区域
    guide(chart, config);

    drawBox(chart, config, config.colors);

  }
}

const Wbox: typeof Box = errorWrap(Box);
export default Wbox;

function drawBox(chart: Chart, config: WboxConfig, colors: Colors, field = 'type') {
  const { dodge, marginRatio, size } = config;

  const geom = chart.schema().position(['x', 'y']).shape('box').color(field, colors);

  if (dodge !== false) {
    geom.adjust([{
      type: 'dodge',
      marginRatio: marginRatio || 0.5, // 数值范围为 0 至 1，用于调整分组中各个柱子的间距
    }]);
  }

  geomSize(geom, size, null, 'y', 'x*y*type*extra');
  console.log(geom)

  geomStyle(geom, config.geomStyle, {
    lineWidth: 2
  }, 'x*y*type*extra');

  // label(geom, config);
}
