'use strict';

import { Chart, Types, BaseChartConfig, ChartData, Colors } from '../common/types';
import Base from '../common/Base';
import themes from '../themes/index';
import { propertyAssign, propertyMap } from '../common/common';
import rectXAxis, { XAxisConfig } from '../common/rectXAxis';
import rectYAxis, { YAxisConfig } from '../common/rectYAxis';
import rectTooltip, { TooltipConfig } from '../common/rectTooltip';
import rectLegend, { LegendConfig } from '../common/rectLegend';
import guide, { GuideConfig } from '../common/guide';
import { LabelConfig } from '../common/label';
import geomSize, { GeomSizeConfig } from '../common/geomSize';
import geomStyle, { GeomStyleConfig } from '../common/geomStyle';
import errorWrap from '../common/errorWrap';
import { activeRegionWithTheme } from '../common/interaction';

function computeDataType(data: any) {
  if (Array.isArray(data)) {
    data.forEach((d) => {
      if (Array.isArray(d.y)) {
        const [start, end] = d.y;
        d.trend = start <= end ? 'up' : 'down';
      }
    });
  }
  return data;
}

interface labelAlias {
  start?: string;
  end?: string;
  min?: string;
  max?: string;
}

export interface WcandlestickConfig extends BaseChartConfig {
  colors?: Colors;
  xAxis?: (Types.ScaleOption & XAxisConfig) | false;
  yAxis?: (Types.ScaleOption & YAxisConfig) | false;
  legend?: LegendConfig | boolean;
  tooltip?: (TooltipConfig & { labelAlias?: labelAlias }) | false;
  guide?: GuideConfig;
  label?: LabelConfig | boolean;
  grid?: boolean;
  size: GeomSizeConfig;
  geomStyle?: GeomStyleConfig;
}

export class Candlestick extends Base<WcandlestickConfig> {
  // 原 g2Factory 的第一个参数，改为类的属性。
  chartName = 'G2Wcandlestick';
  legendField = 'trend';
  // convertData: false,
  getDefaultConfig(): WcandlestickConfig {
    return {
      colors: [themes['widgets-color-red'], themes['widgets-color-green']],
      // padding: ['auto', 'auto', 'auto', 'auto'],
      xAxis: {
        type: 'time',
        mask: 'YYYY-MM-DD',
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
        // align: 'left',
        nameFormatter: null, // 可以强制覆盖，手动设置label
      },
      tooltip: {
        showTitle: true,
        titleFormatter: null,
        nameFormatter: null,
        valueFormatter: null,
      },
      grid: false,
      // zoom: false,
      size: null,
      // label: false,
    };
  }
  init(chart: Chart, config: WcandlestickConfig, data: any) {
    // 设置数据度量
    const defs: Record<string, Types.ScaleOption> = {
      x: propertyAssign(
        propertyMap.axis,
        {
          type: 'time',
        },
        config.xAxis,
      ),
      y: propertyAssign(
        propertyMap.axis,
        {
          type: 'linear',
          tickCount: 5,
          nice: true,
        },
        config.yAxis,
      ),
      type: {
        type: 'cat',
      },
      trend: {
        type: 'cat',
      },
    };

    chart.scale(defs);
    chart.data(computeDataType(data));

    // 设置单个Y轴
    rectYAxis(this, chart, config);

    // 设置X轴
    rectXAxis(this, chart, config);

    chart.legend('x', false);
    chart.legend('y', false);
    // 设置图例
    rectLegend(
      this,
      chart,
      config,
      {
        // useHtml: false,
      },
      'single',
      'trend',
    );

    // tooltip
    const { showTitle, showColon } = config.tooltip || {};
    rectTooltip(this, chart, config, {}, null, {
      showTitle: true,
      showCrosshairs: false,
      showMarkers: false,
      itemTpl: `<div>
            ${
              showTitle
                ? '<div style="margin:10px 0;"><span style="background-color:{color};width:6px;height:6px;border-radius:50%;display:inline-block;margin-right:8px;"></span>{group}</div>'
                : ''
            }
            <div style="margin:8px 0;"><span class="g2-tooltip-item-name">{labelStart}</span>${
              showColon ? ':' : ''
            }<span class="g2-tooltip-item-value">{start}</span></div><div style="margin:8px 0;"><span class="g2-tooltip-item-name">{labelEnd}</span>${
        showColon ? ':' : ''
      }<span class="g2-tooltip-item-value">{end}</span></div><div style="margin:8px 0;"><span class="g2-tooltip-item-name">{labelMax}</span>${
        showColon ? ':' : ''
      }<span class="g2-tooltip-item-value">{max}</span></div><div style="margin:8px 0;"><span class="g2-tooltip-item-name">{labelMin}</span>${
        showColon ? ':' : ''
      }<span class="g2-tooltip-item-value">{min}</span></div>
          </div>`,
    });
    activeRegionWithTheme(chart);

    // 绘制辅助线，辅助背景区域
    guide(chart, config);

    drawCandle(chart, config, config.colors);
  }
  changeData(chart: Chart, config: WcandlestickConfig, data: ChartData) {
    chart.changeData(computeDataType(data));
  }
}

const Wcandlestick: typeof Candlestick = errorWrap(Candlestick);

export default Wcandlestick;

function drawCandle(chart: Chart, config: WcandlestickConfig, colors: Colors) {
  // 分组
  const geom = chart
    .schema()
    .position(['x', 'y'])
    .shape('candle')
    .color('trend', (trend) => {
      if (Array.isArray(colors)) {
        const [colorUp, colorDown] = colors;
        return trend === 'up' ? colorUp : colorDown;
      }
      if (typeof colors === 'function') {
        return colors(trend);
      }
      return colors;
    })
    // .tooltip('type*start*end*max*min', (group, start, end, max, min) => {
    .tooltip('y*type', (y, group) => {
      const { labelAlias = {} } = config.tooltip || {};
      const { start: labelStart, end: labelEnd, max: labelMax, min: labelMin } = labelAlias;

      const [start, end, max, min] = y;

      return {
        group,
        start,
        end,
        max,
        min,
        labelStart: labelStart || 'start',
        labelEnd: labelEnd || 'end',
        labelMax: labelMax || 'max',
        labelMin: labelMin || 'min',
      };
    })
    .state({
      active: {
        style: (ele: any) => {
          return {
            stroke: ele?.model?.color,
          };
        },
      },
      selected: {
        style: (ele: any) => {
          return {
            stroke: ele?.model?.color,
          };
        },
      },
    });

  geomSize(geom, config.size, null, 'y', 'x*y*trend*extra');

  geomStyle(geom, config.geomStyle);
}
