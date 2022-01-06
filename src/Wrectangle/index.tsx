'use strict';
import { Chart, Types, BaseChartConfig, Colors } from '../common/types';
import Base from '../common/Base';
import errorWrap from '../common/errorWrap';
import rectXAxis, { XAxisConfig } from '../common/rectXAxis';
import rectYAxis, { YAxisConfig } from '../common/rectYAxis';
import rectTooltip, { TooltipConfig } from '../common/rectTooltip';
import { LegendConfig } from '../common/rectLegend';
import guide, { GuideConfig } from '../common/guide';
import label, { LabelConfig } from '../common/label';
import geomStyle, { GeomStyleConfig } from '../common/geomStyle';
import themes from '../themes/index';
import { propertyAssign, propertyMap } from '../common/common';
import { DataSet } from '@antv/data-set/lib/data-set';
import '@antv/data-set/lib/api/statistics';
import '@antv/data-set/lib/transform/bin/rectangle';

import './index.scss';

// 3.x代码
export interface WrectangleConfig extends BaseChartConfig {
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
}

export class Rectangle extends Base<WrectangleConfig> {
  chartName = 'G2Rectangle';

  convertData = false;
  getDefaultConfig(): WrectangleConfig {
    return {
      colors: themes.order_10.slice().reverse(),
      xAxis: {
        labelFormatter: null, // 可以强制覆盖，手动设置label
        autoRotate: false,
        max: null,
        min: null,
      },
      yAxis: {
        labelFormatter: null, // 可以强制覆盖，手动设置label
        max: null,
        min: null,
      },
      tooltip: {
        nameFormatter: null,
        valueFormatter: null,
      },
      bin: {
        fields: ['x', 'y'],
        bins: [20, 10], // 两个方向上的分箱个数
        // binWidth: [ 10, 1000 ],    // 两个方向上的分箱步长（会覆盖bins的配置）
        // offset: [ 0, 0 ],
      },
      grid: false,
      label: false,
    };
  }
  init(chart: Chart, config: WrectangleConfig, data: any) {
    const defs: Record<string, Types.ScaleOption> = {
      x: propertyAssign(propertyMap.axis, {
        // 折线图X轴的范围默认覆盖全部区域，保证没有空余
        range: [0, 1],
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
    const ds = new DataSet();

    const rectangleDataView = ds
      .createView('diamond')
      .source(data)
      .transform({
        type: 'bin.rectangle',
        fields: ['x', 'y'], // 对应坐标轴上的一个点
        bins: [20, 10], // 两个方向上的分箱个数
        // binWidth: [10, 10], // 两个方向上的分箱步长（会覆盖bins配置）
        // offset: [0, 0], // 两个方向上的分箱偏移量
        // sizeByCount: false, // 是否根据分箱个数调整分箱大小
        // as: ['x', 'y', 'count'], // 这个点落在的六边形的顶点坐标集
      });
    chart.scale(defs);

    chart.data(rectangleDataView.rows);

    // 设置X轴
    rectXAxis(this, chart, config);

    // 设置单个Y轴
    rectYAxis(this, chart, config);

    // 设置图例
    chart.legend(false);

    // tooltip
    rectTooltip(
      this,
      chart,
      config,
      {
        // 指定为 count，避免 Axis 类型为 time 时会报错。
        title: 'count',
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

    // 绘制辅助线，辅助背景区域
    guide(chart, config);

    const geom = chart.polygon().position('x*y').color('count', config.colors).tooltip('x*y*count', (x, y, count) => ({
      // title: x,
      name: '数量',
      value: count,
    }));

    geomStyle(geom, config.geomStyle, undefined, 'x*y*count');

    label(geom, config, 'count', {
      offset: 0,
    });

    // chart.render();
  }
  changeData(chart: Chart, config: WrectangleConfig, data: any) {

    const ds = new DataSet();

    const rectangleDataView = ds
      .createView('diamond')
      .source(data)
      .transform({
        type: 'bin.rectangle',
        fields: ['x', 'y'], // 对应坐标轴上的一个点
        bins: [20, 10], // 两个方向上的分箱个数
        // binWidth: [10, 10], // 两个方向上的分箱步长（会覆盖bins配置）
        // offset: [0, 0], // 两个方向上的分箱偏移量
        // sizeByCount: false, // 是否根据分箱个数调整分箱大小
        // as: ['x', 'y', 'count'], // 这个点落在的六边形的顶点坐标集
      });

    chart && chart.changeData(rectangleDataView.rows);
  }
}

const Wrectangle: typeof Rectangle = errorWrap(Rectangle);

export default Wrectangle;
