'use strict';
import { View } from '@antv/data-set';

import g2Factory from '../common/g2Factory';
import errorWrap from '../common/errorWrap';
import merge from '../common/merge';
import themes from '../themes/index';
import { defaultPadding, propertyAssign, propertyMap } from '../common/common';
import guide from '../common/guide';
import rectXAxis from '../common/rectXAxis';
import rectYAxis from '../common/rectYAxis';
import rectTooltip from '../common/rectTooltip';
import rectLegend from '../common/rectLegend';
import legendFilter from '../common/legendFilter';
import label from '../common/label';
import getGeomSizeConfig from '../common/geomSize';
import './G2Histogram.scss';

function computerData(config, data) {
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

export default /*#__PURE__*/ errorWrap(g2Factory('G2Histogram', {
  // convertData: false,
  getDefaultConfig() {
    return {
      colors: themes.category_12,
      padding: ['auto', 'auto', 'auto', 'auto'],
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
      column: true,
      grid: false,
      size: null,
      label: false,
      innerRadius: 0,
      // 分箱粒度
      bin: {
        // bins: 10, // 分箱个数
        binWidth: 1, // 分箱步长（会覆盖bins的配置）
        offset: 0,
      },
      // 是否归一化
      normalize: false
    };
  },
  beforeInit(props) {
    const { config } = props;
    const newConfig = merge({}, this.defaultConfig, config);

    // TODO 处理padding
    return Object.assign({}, props, {
      padding: defaultPadding(
        props.padding || config.padding,
        newConfig,
        ...this.defaultConfig.padding
      ),
      config: newConfig
    });
  },
  init(chart, userConfig, data) {
    const config = userConfig;

    // 设置数据度量
    const defs = {
      x: propertyAssign(propertyMap.xAxis, {
        // 折线图X轴的范围默认覆盖全部区域，保证没有空余
        // range: [0, 1],
      }, config.xAxis),
      y: propertyAssign(propertyMap.yAxis, {
        type: 'linear',
        // tickCount: 5,
      }, config.yAxis),
      type: {
        type: 'cat',
      },
    };

    const dataView = computerData(config, data);
    this.dataView = dataView;

    chart.source(dataView, defs);

    // 设置Y轴
    rectYAxis.call(this, chart, config);

    // 设置X轴
    rectXAxis.call(this, chart, config);

    // 设置图例
    rectLegend.call(this, chart, config, null, false, "type");

    legendFilter.call(this, chart, config);

    // tooltip
    rectTooltip.call(this, chart, config, {
      crosshairs: config.polar ? undefined : {}
    });

    // 绘制辅助线，辅助背景区域
    guide(chart, config);

    // 设置坐标系：极坐标/直角坐标
    const chartCoord = config.polar
      ? chart.coord("polar", {
          innerRadius: config.innerRadius || 0
        })
      : chart.coord();

    // 横向柱状图
    if (!config.column) {
      chartCoord.transpose();
    }

    drawHist(chart, config, config.colors);

    chart.render();
  },
  changeData(chart, config, data) {
    if (this.dataView) {
      this.dataView.source(data);
    }
    // chart.changeData(data);
  },
}));

function drawHist(chart, config, colors, field = "type") {
  const { size } = config;
  const geom = chart
    .intervalStack()
    .position('x*y')
    .color(field, colors);

  if (size) {
    const sizeConfig = getGeomSizeConfig(size, 20, "y", "x*y*type*extra");
    geom.size(...sizeConfig);
  }

  label(geom, config);
}
