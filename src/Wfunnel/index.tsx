'use strict';

import { Chart, Types, BaseChartConfig, ChartData, Colors } from '../common/types';
import Base from '../common/Base';
import errorWrap from '../common/errorWrap';
import rectTooltip, { TooltipConfig } from '../common/rectTooltip';
import rectLegend, { LegendConfig } from '../common/rectLegend';
import { GuideConfig } from '../common/guide';
import label, { LabelConfig } from '../common/label';
import themes from '../themes/index';
import { pxToNumber, numberDecimal } from '../common/common';
import geomStyle, { GeomStyleConfig } from '../common/geomStyle';
import './index.scss';

// 3.x代码
export interface WfunnelConfig extends BaseChartConfig {
  colors?: Colors;
  legend?: LegendConfig | boolean;
  tooltip?: TooltipConfig | boolean;
  guide?: GuideConfig;
  pyramid?: boolean;
  label?: LabelConfig | boolean;
  direction?: string;
  align?: string;
  percent?: Types.LooseObject | boolean;
  geomStyle?: GeomStyleConfig;
}

export class Funnel extends Base<WfunnelConfig> {
  chartName = 'G2Funnel';

  getDefaultConfig(): WfunnelConfig {
    return {
      colors: themes.order_10,
      legend: {
        position: 'top',
        align: '',
        nameFormatter: null, // 可以强制覆盖，手动设置label
      },
      tooltip: {
        titleFormatter: null,
        nameFormatter: null,
        valueFormatter: null,
      },
      label: false,
      pyramid: false,
      // 主方向，从上到下(vertical)、从左到右(horizontal)
      direction: 'vertical',
      // 排列位置 start,center,end
      align: 'center',
      // 尖顶漏斗图
      percent: true,
    };
  }
  init(chart: Chart, config: WfunnelConfig, data: any) {
    const defs: Record<string, Types.ScaleOption> = {
      type: {
        type: 'cat',
      },
    };

    chart.scale(defs);
    chart.interaction('element-active');
    chart.axis(false);
    chart.data(data);

    // 设置图例
    rectLegend(this, chart, config, null, true);

    // tooltip
    rectTooltip(
      this,
      chart,
      config,
      {
        showTitle: false,
        showMarkers: false,
        showCrosshairs: false,
      },
      null,
      {
        showTitle: false,
        showMarkers: false,
        showCrosshairs: false,
      },
    );

    // 根据传入的 direction 和 align 设置坐标系，并绘制图形
    const drawType = `${config.direction}-${config.align}`;
    let geom = null;
    const fontSize1 = pxToNumber(themes['widgets-font-size-1']);
    let percentOffsetX = 0;
    let percentOffsetY = 0;
    const funnelShape = config.align === 'center' && config.pyramid ? 'pyramid' : 'funnel';

    switch (drawType) {
      case 'vertical-left':
      case 'vertical-start':
        chart.coordinate('rect').transpose().scale(1, -1);
        geom = chart.interval()
          .position('x*y')
          .shape(funnelShape)
          .color('x', config.colors);
        percentOffsetX = 3 * fontSize1;
        break;
      case 'vertical-center':
        chart.coordinate('rect').transpose().scale(1, -1);
        geom = chart.interval()
          .adjust([{
            type: 'symmetric',
          }])
          .position('x*y')
          .shape(funnelShape)
          .color('x', config.colors);
        break;
      case 'vertical-right':
      case 'vertical-end':
        chart.coordinate('rect').transpose().scale(-1, -1);
        geom = chart.interval()
          .position('x*y')
          .shape(funnelShape)
          .color('x', config.colors);
        percentOffsetX = -3 * fontSize1;
        break;
      case 'horizontal-top':
      case 'horizontal-start':
        chart.coordinate('rect').reflect('y');
        geom = chart.interval()
          .position('x*y')
          .shape(funnelShape)
          .color('x', config.colors);
        percentOffsetY = 3 * fontSize1;
        break;
      case 'horizontal-center':
        geom = chart.interval()
          .position('x*y')
          .shape(funnelShape)
          .color('x', config.colors)
          .adjust([{
            type: 'symmetric',
          }]);
        break;
      // case 'horizontal-bottom':
      // case 'horizontal-end':
      // 和 default 时相同
      default:
        geom = chart.interval()
          .position('x*y')
          .shape(funnelShape)
          .color('x', config.colors);
        percentOffsetY = -3 * fontSize1;
    }

    geomStyle(geom, config.geomStyle);

    if (config.label) {
      label({
        geom: geom,
        config: config,
        useCustomOffset: true,
        componentConfig: {
          labelLine: {
            style: {
              lineWidth: 1,
              stroke: themes['widgets-axis-line'],
            },
          },
          content: (v, item, index) => {
            if (typeof config.label === 'boolean') {
              return v['y'];
            }
            if (config.label.labelFormatter) {
              return config.label.labelFormatter(v['y'], item, index);
            }
            return v['y'];
          },
        }
      });
    }

    // 绘制辅助线，辅助背景区域
    renderGuide(chart, config, data, percentOffsetX, percentOffsetY);
  }
}

function renderGuide(chart: Chart, config: WfunnelConfig, data: ChartData, percentOffsetX: number, percentOffsetY: number) {
  // 中间标签文本
  chart.annotation().clear(true);
  let configPercent = config.percent;

  if (!configPercent) {
    return;
  }

  if (configPercent === true) {
    configPercent = {};
  }

  const {
    labelFormatter,
    offsetX = 0,
    offsetY = 0,
    top = true,
    style = {}
  } = configPercent;
  const positionY = config.align === 'center' ? 'center' : 'start';

  data.forEach((d: { y: any; x: any; }, i: any) => {
    let content = `${numberDecimal(100 * d.y / data[0].y)}%`;
    if (labelFormatter) {
      content = labelFormatter(d.y / data[0].y, d, i);
    }
    chart.annotation().text({
      top,
      position: [
        d.x,
        positionY,
      ],
      offsetX: percentOffsetX + offsetX,
      offsetY: percentOffsetY + offsetY,
      content: content, // 显示的文本内容
      style: {
        fill: themes['widgets-label-text'],
        fontSize: pxToNumber(themes['widgets-font-size-1']),
        textAlign: 'center',
        shadowBlur: 2,
        shadowColor: 'rgba(255, 255, 255, .3)',
        ...style,
      },
    });
  });
}

const Wfunnel: typeof Funnel = errorWrap(Funnel);

export default Wfunnel;
