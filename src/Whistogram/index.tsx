'use strict';
import { View } from '@antv/data-set/lib/view';
import '@antv/data-set/lib/api/statistics';
import '@antv/data-set/lib/transform/bin/histogram';

import { Chart, Types, BaseChartConfig, ChartData, Colors } from '../common/types';
import Base from '../common/Base';
import errorWrap from '../common/errorWrap';
import themes from '../themes/index';
import { propertyAssign, propertyMap } from '../common/common';

import rectXAxis, { XAxisConfig } from '../common/rectXAxis';
import rectYAxis, { YAxisConfig } from '../common/rectYAxis';
import rectLegend, { LegendConfig } from '../common/rectLegend';
import rectTooltip, { TooltipConfig } from '../common/rectTooltip';
import guide, { GuideConfig } from '../common/guide';
import label, { LabelConfig } from '../common/label';
import legendFilter from '../common/legendFilter';
import geomStyle, { GeomStyleConfig } from '../common/geomStyle';
import { activeRegionWithTheme } from '../common/interaction';

// 3.x代码
export interface WhistogramConfig extends BaseChartConfig {
  colors?: Colors;
  xAxis?: Types.ScaleOption & XAxisConfig | false,
  yAxis?: Types.ScaleOption & YAxisConfig | false,
  legend?: LegendConfig | boolean;
  tooltip?: TooltipConfig | boolean;
  guide?: GuideConfig;
  label?: LabelConfig | boolean;
  bin?: any;
  grid?: boolean;
  geomStyle?: GeomStyleConfig;
  normalize?: boolean;
  polar?: boolean;
  innerRadius?: number;
  column?: boolean;
}

export class Histogram extends Base<WhistogramConfig> {
  chartName = 'G2Histogram';

  getDefaultConfig(): WhistogramConfig {
    return {
      colors: themes.category_12,
      xAxis: {
        // type: "cat",
        labelFormatter: null, // 可以强制覆盖，手动设置label
        categories: null,
        autoRotate: false,
        // 坐标轴粒度
        // tickInterval: 1,
      },
      yAxis: {
        labelFormatter: null, // 可以强制覆盖，手动设置label
        max: null,
        min: null
      },
      legend: {
        align: "left",
        nameFormatter: null // 可以强制覆盖，手动设置label
      },
      tooltip: {
        titleFormatter: null,
        nameFormatter: null,
        valueFormatter: null
      },
      grid: false,
      label: false,
      // 分箱粒度
      bin: {
        // bins: 10, // 分箱个数
        binWidth: 1, // 分箱步长（会覆盖bins的配置）
        offset: 0,
      },
      column: true,
      // 是否归一化
      normalize: false
    };
  }
  init(chart: Chart, config: WhistogramConfig, data: any) {
    const defs: Record<string, Types.ScaleOption> = {
      x: propertyAssign(propertyMap.axis, {
        range: [0, 1],
      }, config.xAxis),
      y: propertyAssign(propertyMap.axis, {
        type: 'linear',
        nice: true,
        // tickCount: 5,
      }, config.yAxis),
      type: {
        type: 'cat',
      },
    };

    const dataView = computerData(config, data);

    chart.scale(defs);

    chart.data(dataView.rows);


    // 设置X轴
    rectXAxis(this, chart, config);

    // 设置单个Y轴
    rectYAxis(this, chart, config);

    // 设置图例
    rectLegend(this, chart, config, null, false, "type");

    legendFilter(this, chart);

    // tooltip
    rectTooltip(
      this,
      chart,
      config,
      {
        position: 'top',
        shared: true,
        showMarkers: false,
      },
      null,
      {
        position: 'top',
        shared: true,
        showMarkers: false,
      },
    );

    // 绘制辅助线，辅助背景区域
    guide(chart, config);

    // 设置坐标系：极坐标/直角坐标
    const chartCoord = config.polar
      ? chart.coordinate("polar", {
          innerRadius: config.innerRadius || 0
        })
      : chart.coordinate();

    // 横向柱状图
    if (!config.column) {
      chartCoord.transpose();
    }

    activeRegionWithTheme(chart);

    drawHist(chart, config);
  }
  changeData(chart: Chart, config: WhistogramConfig, data: any) {
    const dataView = computerData(config, data);
    chart && chart.changeData(dataView.rows);
  }
}

function drawHist(chart: Chart, config: WhistogramConfig, field = "type") {
  const { colors } = config;
  const geom = chart
    .interval()
    .position('x*y')
    .color(field, colors)
    .adjust('stack');

  geomStyle(geom, config.geomStyle);

  label(geom, config);
}

function computerData(config: WhistogramConfig, data: ChartData) {
  const { bins, binWidth, offset } = config.bin;

  const dv = new View().source(data);
  dv.transform({
    type: 'bin.histogram',
    field: 'x',
    bins,
    binWidth,
    offset,
    groupBy: ['type', 'visible'],
    as: ['x', 'y'],
  });

  if (config.normalize) {
    const total = dv.rows.reduce((acc, cur) => acc + cur.y, 0);
    dv.transform({
      type: 'map',
      callback(row) {
        row.y = row.y / total;
        return row;
      },
    });
  }

  return dv;
}

const Whistogram: typeof Histogram = errorWrap(Histogram);

export default Whistogram;
