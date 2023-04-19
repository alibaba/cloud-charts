'use strict';

import { Chart, Types, BaseChartConfig, Colors } from '../common/types';
import Base from "../common/Base";
import errorWrap from '../common/errorWrap';
import themes from '../themes/index';
import legendFilter from '../common/legendFilter';
import rectTooltip, { TooltipConfig } from '../common/rectTooltip';
import rectLegend, { LegendConfig } from '../common/rectLegend';
import geomSize, { GeomSizeConfig } from '../common/geomSize';
import geomStyle, { GeomStyleConfig } from '../common/geomStyle';
import circleAnnotation, { DecorationConfig } from '../common/circleAnnoation';
import updateChildrenPosition from '../common/updateChildrenPosition';
import './index.scss';

interface WmulticircleConfig extends BaseChartConfig, DecorationConfig{
  colors?: Colors;
  legend?: LegendConfig | boolean;
  tooltip?: TooltipConfig | boolean;
  size?: GeomSizeConfig;
  radius?: number;
  innerRadius?: number;
  geomStyle?: GeomStyleConfig;
  minSize?: number;
  maxSize?: number;
  marginRatio?: number;
  max?: number;
  /** 默认宽度占比，interval类型和schema类型通用 */
  columnWidthRatio?: number;
}

export class MultiCircle extends Base<WmulticircleConfig> {
  chartName = 'G2MultiCircle';

  getDefaultConfig(): WmulticircleConfig {
    return {
      colors: themes.category_12,
      legend: {
        align: 'left',
        nameFormatter: null, // 可以强制覆盖，手动设置label
      },
      tooltip: {
        titleFormatter: null,
        nameFormatter: null,
        valueFormatter: null,
      },
      marginRatio: 0,
      size: null,
      innerRadius: 0,
      radius: 1,
    };
  }

  init(chart: Chart, config: WmulticircleConfig, data: any) {
    // 设置数据度量
    const defs: Record<string, Types.ScaleOption> = {
      type: {
        type: 'cat'
      },
      y: {
        nice: false,
        max: config.max,
        // maxLimit: 0.5
      },
      // percent: {
      //   max: 1,
      //   min: 0
      // }
    };

    chart.scale(defs);

    chart.data(data);

    // 设置图例
    rectLegend(this, chart, config, null, false, 'type');

    legendFilter(this, chart);

    // tooltip
    rectTooltip(this, chart, config, {}, null, {
      showCrosshairs: false,
      showMarkers: false
    });

    circleAnnotation(chart, config, this.size, 'G2MultiCircle');

    // 设置坐标系
    chart.coordinate('theta', {
      innerRadius: config.innerRadius || 0.5,
      radius: config.radius || 1,
    });

    chart.interaction('element-active');

    drawBar(chart, config, config.colors);

    chart.on('afterpaint', () => {
      updateChildrenPosition(chart, this.chartDom);
    });
  }
}

const Wmulticircle: typeof MultiCircle = errorWrap(MultiCircle);

export default Wmulticircle;

function drawBar(chart: Chart, config: WmulticircleConfig, colors: Colors) {
  const { size, minSize = 4, maxSize, columnWidthRatio } = config;
  let geomConfig: any = {
    minColumnWidth: minSize || null,
    maxColumnWidth: maxSize || null,
    columnWidthRatio: columnWidthRatio || null,
  };

  // 多重圆环背景色
  geomConfig = {
    background: {
      style: {
        fill: themes['widgets-circle-stroke-background'],
        fillOpacity: 1
      }
    },
    ...geomConfig,
  };

  let geom = chart.interval(geomConfig).position(['x', 'y']);

  geom = geom.color('x', colors).style({
    lineCap: 'round'
  });

  geomSize(geom, size, null, 'y', 'x*y*type*extra');

  geomStyle(geom, config.geomStyle, {}, 'x*y*type*extra');
}
