'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import merge from '../common/merge';
import themes from '../theme/index';
import { defaultPadding } from '../common/common';
import guide from '../common/guide';
import rectXAxis from '../common/rectXAxis';
import rectYAxis from '../common/rectYAxis';
import rectTooltip from '../common/rectTooltip';
import rectLegend from '../common/rectLegend';
import legendFilter from '../common/legendFilter';
import label from '../common/label';
import getGeomSizeConfig from '../common/geomSize';
import './G2Histogram.scss';

export default {
  getDefaultConfig: function getDefaultConfig() {
    return {
      colors: themes.category_12,
      padding: [28, 5, 24, 44],
      xAxis: {
        type: 'cat',
        labelFormatter: null, // 可以强制覆盖，手动设置label
        categories: null,
        autoRotate: false
      },
      yAxis: {
        labelFormatter: null, // 可以强制覆盖，手动设置label
        max: null,
        min: null
      },
      legend: {
        align: 'left',
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
      polar: false,
      innerRadius: 0,
      // 分享粒度
      binWidth: 1,
      // 坐标轴粒度
      tickInterval: 1,
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
    var tickInterval = config.tickInterval;

    chart.source(data, {
      x: { tickInterval: tickInterval }
    });

    // 设置Y轴
    rectYAxis.call(this, chart, config);

    // 设置X轴
    rectXAxis.call(this, chart, config);

    // 设置图例
    rectLegend.call(this, chart, config, null, false, 'type');

    legendFilter.call(this, chart, config);

    // tooltip
    rectTooltip.call(this, chart, config, {
      crosshairs: config.polar ? undefined : {}
    });

    // 绘制辅助线，辅助背景区域
    guide(chart, config);

    // 设置坐标系：极坐标/直角坐标
    var chartCoord = config.polar ? chart.coord('polar', {
      innerRadius: config.innerRadius || 0
    }) : chart.coord();

    // 横向柱状图
    if (!config.column) {
      chartCoord.transpose();
    }

    // 玉玦图，需要手动添加 数据标记
    if (config.polar && !config.column && config.dataType !== 'g2') {
      this.rawData[0].data.forEach(function (d, i) {
        var x = d.x;
        if (Array.isArray(d)) {
          x = d[0];
        } else if (config.xAxis && config.xAxis.categories && config.xAxis.categories[i]) {
          x = config.xAxis.categories[i];
          // const y = isNaN(d) ? d[0] : d;
        }

        chart.guide().text({
          position: [x, 0],
          content: x + '  ',
          style: {
            fill: themes['widgets-axis-label'],
            textAlign: 'right'
          }
        });
      });
    }

    drawHist(chart, config, config.colors);

    chart.render();
  },
  changeData: function changeData(chart, config, data) {
    chart.changeData(data);
  }
};

function drawHist(chart, config, colors) {
  var field = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'type';
  var size = config.size;

  var geom = chart.intervalStack().position('x*y').color(field);

  if (size) {
    var sizeConfig = getGeomSizeConfig(size, 20, 'y', 'x*y*type*extra');
    geom.size.apply(geom, sizeConfig);
  }

  label(geom, config);
}