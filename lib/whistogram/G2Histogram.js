'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import { View } from '@antv/data-set';

import g2Factory from '../common/g2Factory';
import merge from '../common/merge';
import themes from '../theme/index';
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
  var _config$bin = config.bin,
      bins = _config$bin.bins,
      binWidth = _config$bin.binWidth,
      offset = _config$bin.offset;


  var dv = new View().source(data);
  dv.transform({
    type: 'bin.histogram',
    field: 'x',
    bins: bins,
    binWidth: binWidth,
    offset: offset,
    groupBy: ['type', 'visible'],
    as: ['x', 'y']
  });

  if (config.normalize) {
    var total = dv.rows.reduce(function (acc, cur) {
      return acc + cur.y;
    }, 0);
    dv.transform({
      type: 'map',
      callback: function callback(row) {
        row.y = row.y / total;
        return row;
      }
    });
  }

  return dv;
}

export default /*#__PURE__*/g2Factory('G2Histogram', {
  // convertData: false,
  getDefaultConfig: function getDefaultConfig() {
    return {
      colors: themes.category_12,
      padding: [28, 'auto', 'auto', 'auto'],
      xAxis: {
        // type: "cat",
        labelFormatter: null, // 可以强制覆盖，手动设置label
        categories: null,
        autoRotate: false
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
        offset: 0
      },
      // 是否归一化
      normalize: false
    };
  },
  beforeInit: function beforeInit(props) {
    var config = props.config;

    var newConfig = merge({}, this.defaultConfig, config);

    // TODO 处理padding
    return _extends({}, props, {
      padding: defaultPadding.apply(undefined, [props.padding || config.padding, newConfig].concat(this.defaultConfig.padding)),
      config: newConfig
    });
  },
  init: function init(chart, userConfig, data) {
    var config = userConfig;

    // 设置数据度量
    var defs = {
      x: propertyAssign(propertyMap.xAxis, {
        // 折线图X轴的范围默认覆盖全部区域，保证没有空余
        // range: [0, 1],
      }, config.xAxis),
      y: propertyAssign(propertyMap.yAxis, {
        type: 'linear'
        // tickCount: 5,
      }, config.yAxis),
      type: {
        type: 'cat'
      }
    };

    var dataView = computerData(config, data);
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
    var chartCoord = config.polar ? chart.coord("polar", {
      innerRadius: config.innerRadius || 0
    }) : chart.coord();

    // 横向柱状图
    if (!config.column) {
      chartCoord.transpose();
    }

    drawHist(chart, config, config.colors);

    chart.render();
  },
  changeData: function changeData(chart, config, data) {
    if (this.dataView) {
      this.dataView.source(data);
    }
    // chart.changeData(data);
  }
});

function drawHist(chart, config, colors) {
  var field = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "type";
  var size = config.size;

  var geom = chart.intervalStack().position('x*y').color(field, colors);

  if (size) {
    var sizeConfig = getGeomSizeConfig(size, 20, "y", "x*y*type*extra");
    geom.size.apply(geom, sizeConfig);
  }

  label(geom, config);
}