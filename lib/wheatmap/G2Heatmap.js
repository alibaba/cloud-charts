'use strict';

// import G2 from '@antv/g2';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import g2Factory from '../common/g2Factory';
import errorWrap from '../common/errorWrap';
import merge from '../common/merge';
import themes from '../themes/index';
import { propertyAssign, propertyMap, defaultPadding } from '../common/common';
import guide from '../common/guide';
import rectXAxis from '../common/rectXAxis';
import rectYAxis from '../common/rectYAxis';
import rectTooltip from '../common/rectTooltip';
import rectLegend from '../common/rectLegend';
import legendFilter from '../common/legendFilter';
// import label from '../common/label';
import './G2Heatmap.scss';

export default /*#__PURE__*/errorWrap(g2Factory('G2Heatmap', {
  getDefaultConfig: function getDefaultConfig() {
    return {
      colors: themes.category_12,
      padding: ['auto', 'auto', 'auto', 'auto'],
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
      // grid: false,
      // label: false,
      coordinate: null
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
        type: 'cat'
      }, config.xAxis),
      y: propertyAssign(propertyMap.yAxis, {
        type: 'cat'
      }, config.yAxis),
      type: {
        type: 'cat'
        // sync: true,
      }
    };

    chart.source(data, defs);

    if (config.coordinate) {
      var _config$coordinate = config.coordinate,
          _config$coordinate$ty = _config$coordinate.type,
          type = _config$coordinate$ty === undefined ? 'rect' : _config$coordinate$ty,
          reflect = _config$coordinate.reflect;

      var coord = chart.coord(type);
      if (reflect) {
        coord.reflect(reflect);
      }
    }

    // 设置单个Y轴
    rectYAxis.call(this, chart, config, undefined, {
      grid: null
    });

    // 设置X轴
    rectXAxis.call(this, chart, config);

    chart.legend('x', false);
    chart.legend('y', false);
    // 设置图例
    rectLegend.call(this, chart, config);

    legendFilter.call(this, chart, config);

    // tooltip
    rectTooltip.call(this, chart, config, {
      showTitle: false,
      crosshairs: null
    });

    // 绘制辅助线，辅助背景区域
    guide(chart, config);

    var geomStyle = config.geomStyle || {};

    chart.polygon().position('x*y').color('type', config.colors).tooltip('x*y*extra', function (x, y, extra) {
      return {
        name: x + ' - ' + y,
        value: (Array.isArray(extra) ? extra[0] : extra.value) || '-'
      };
    }).style('x*y*type*extra', _extends({
      lineWidth: 1,
      stroke: themes['widgets-map-area-border']
    }, geomStyle));

    // label(geom, config, 'extra');

    chart.render();
  }
}
// changeData(chart, config, data) {
//   chart.changeData(data);
// },
// destroy() {
// },
));