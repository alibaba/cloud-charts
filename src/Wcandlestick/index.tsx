'use strict';

import { Chart, Types, BaseChartConfig } from '../common/types';
import Base from "../common/Base";
// import errorWrap from '../common/errorWrap';
import themes from '../themes/index';
import { propertyAssign, propertyMap } from '../common/common';
import legendFilter from '../common/legendFilter';
// import getGeomSizeConfig from '../common/geomSize';
import rectXAxis, { XAxisConfig } from '../common/rectXAxis';
import rectYAxis, { YAxisConfig } from '../common/rectYAxis';
import rectTooltip, { TooltipConfig } from '../common/rectTooltip';
import rectLegend, { LegendConfig } from '../common/rectLegend';
import guide, { GuideConfig } from '../common/guide';
import { LabelConfig } from "../common/label";

import './index.scss';
import errorWrap from "../common/errorWrap";

function computeDataType(data: any) {
  if (Array.isArray(data)) {
    data.forEach((d) => {
      if (Array.isArray(d.y)) {
        const [start, end] = d.y;
        d.trend = start <= end ? 'up' : 'down';
      }
    })
  }
  return data;
}

interface WcandlestickConfig extends BaseChartConfig {
  colors?: string[];
  xAxis?: Types.ScaleOption & XAxisConfig | false,
  yAxis?: Types.ScaleOption & YAxisConfig | false,
  legend?: LegendConfig | boolean,
  tooltip?: TooltipConfig | false,
  guide?: GuideConfig,
  label?: LabelConfig | boolean,
  grid?: boolean,
  size: string | number,

  // 剩余部分自行定义
}

class Candlestick extends Base<WcandlestickConfig> {
  // 原 g2Factory 的第一个参数，改为类的属性。
  chartName = 'G2Wcandlestick';
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
  // beforeInit(props) {
  //   const { config } = props;
  //   const newConfig = config;
  //
  //   // TODO 处理padding
  //   return Object.assign({}, props, {
  //     padding: defaultPadding(
  //       props.padding || config.padding,
  //       newConfig,
  //       ...this.defaultConfig.padding
  //     ),
  //     config: newConfig,
  //   });
  // }
  init(chart: Chart, config: WcandlestickConfig, data: any) {

    // 设置数据度量
    const defs: Record<string, Types.ScaleOption> = {
      x: propertyAssign(
        propertyMap.xAxis,
        {
          type: 'time',
        },
        config.xAxis
      ),
      y: propertyAssign(
        propertyMap.yAxis,
        {
          type: 'linear',
          tickCount: 5,
        },
        config.yAxis
      ),
      type: {
        type: 'cat',
      },
      trend: {
        type: 'cat',
      }
    };


    chart.scale(defs);
    chart.data(computeDataType(data));

    // 设置单个Y轴
    rectYAxis.call(this, chart, config);

    // 设置X轴
    rectXAxis.call(this, chart, config);

    chart.legend('x', false);
    chart.legend('y', false);
    // 设置图例
    rectLegend.call(this, chart, config, {
      // useHtml: false,
    }, true, 'trend');

    legendFilter.call(this, chart, config);

    // tooltip
    const { showTitle, showColon } = config.tooltip || {};
    rectTooltip.call(
      this,
      chart,
      config,
      {},
      null,
      {
        showTitle: true,
        crosshairs: {
          type: 'rect',
        },
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
          </div>`
      }
    );

    // 绘制辅助线，辅助背景区域
    guide(chart, config);

    drawCandle(chart, config, config.colors);

    chart.render();
  }
  // changeData(chart, data) {
  //   chart.changeData(computeDataType(data));
  // }
};

const Wcandlestick: typeof Candlestick = errorWrap(Candlestick);

export default Wcandlestick;

function drawCandle(chart: Chart, config: any, colors: any) {
  // const { size } = config;
  /*let geom: any = null;

  // 分组
  geom =*/ chart
    .schema()
    .position(['x', 'y'])
    .shape('candle')
    .color('trend', trend => {
      const [colorUp, colorDown] = colors;
      return trend === 'up' ? colorUp : colorDown;
    })
    // .tooltip('type*start*end*max*min', (group, start, end, max, min) => {
    .tooltip('y*type', (y, group) => {
      const { labelAlias = {} } = config.tooltip || {};
      console.log(config.tooltip, y, group)
      const {
        start: labelStart,
        end: labelEnd,
        max: labelMax,
        min: labelMin,
      } = labelAlias;

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
    });
  // if (size) {
  //   const sizeConfig = getGeomSizeConfig(size, 20, 'y', 'x*y*type*extra');
  //   geom.size(...sizeConfig);
  // }
}
