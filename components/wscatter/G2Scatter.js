'use strict';

// 引入所需要的库和样式
import merge from '../common/merge';
import themes from '../theme/index';
import { propertyAssign, propertyMap, defaultPadding } from '../common/common';
import rectXAxis from '../common/rectXAxis';
import rectYAxis from '../common/rectYAxis';
import rectAutoTickCount from '../common/rectAutoTickCount';
import rectLegend from '../common/rectLegend';
import legendFilter from '../common/legendFilter';
import rectTooltip from '../common/rectTooltip';
import label from '../common/label';
import guide from '../common/guide';

// 建议将默认配置放在外层，方便后续维护
const defaultConfig = {
  padding: [28, 5, 24, 44],
  colors: themes.category_12,
  xAxis: {
    type: 'linear',
    mask: 'YYYY-MM-DD HH:mm:ss',
    autoRotate: false,
  },
  yAxis: {
    min: 0,
  },
  size: 4,
  jitter: false,
  tooltip: true,
  legend: true,
  label: false,
};

const setAxis = (chart, config) => {
  // 设置X轴
  const xAxis = {};

  if (config.jitter) {
    xAxis.grid = {
      align: 'center', // 网格顶点从两个刻度中间开始
      lineStyle: {
        stroke: themes['widgets-axis-grid'],
        lineWidth: 1,
        // lineDash: [3, 3]
      },
    };
  }

  // 扰动点图不能打开垂直网格线
  if (config.grid && !config.jitter) {
    xAxis.grid = {
      lineStyle: {
        stroke: themes['widgets-axis-grid'],
        lineWidth: 1,
      },
    };
  }

  rectXAxis.call(this, chart, config, xAxis);

  // 设置单个Y轴
  rectYAxis.call(this, chart, config);
};

const setSource = (chart, config, data) => {
  const defs = {
    x: propertyAssign(
      propertyMap.xAxis,
      {
        type: config.jitter ? 'cat' : 'linear',
      },
      config.xAxis
    ),
    type: {
      type: 'cat',
    },
  };

  defs.y = propertyAssign(
    propertyMap.yAxis,
    {
      type: 'linear',
      tickCount: 5,
    },
    config.yAxis
  );

  rectAutoTickCount(chart, config, defs, false);

  chart.source(data, defs);
};

const chartRender = (chart, config) => {

};

export default {
  beforeInit(props) {
    const { config } = props;
    const preConfig = {};
    if (config.jitter) {
      preConfig.xAxis = {
        type: 'cat',
      };
    }
    const newConfig = merge({}, defaultConfig, preConfig, config);

    return Object.assign({}, props, {
      padding: defaultPadding(props.padding || config.padding, newConfig, ...defaultConfig.padding),
      config: newConfig,
    });
  },
  init(chart, userConfig, data) {
    const config = userConfig;
    const { colors, jitter, size, geomStyle } = config;

    setSource(chart, config, data);

    setAxis(chart, config);

    rectTooltip.call(this, chart, config, {
      crosshairs: null,
    });

    rectLegend.call(this, chart, config, null, false, 'type');

    legendFilter.call(this, chart, config);

    // 绘制辅助线，辅助背景区域
    guide(chart, config);

    const geom = chart
      .point()
      .color('type', colors)
      .position('x*y')
      .shape('circle')
      .style('x*y*type*extra', geomStyle || {})
      .active(false);

    if (jitter) {
      geom.adjust('jitter');
    }

    label(geom, config);

    // TODO 暂时没有更好的方案
    if (size) {
      let sizeConfig = size || 4;
      if (Array.isArray(size)) {
        sizeConfig = ['y', size];
      } else if (G2.Util.isFunction(size)) {
        sizeConfig = ['x*y*type*facet', size];
      } else if (typeof size === 'object') {
        sizeConfig = [sizeConfig.field, sizeConfig.param];
      } else {
        sizeConfig = [size];
      }
      geom.size(...sizeConfig);
    }

    chart.render();
  },
};
