'use strict';

// 引入所需要的库和样式
import g2Factory from '../common/g2Factory';
import errorWrap from '../common/errorWrap';
import merge from '../common/merge';
import themes from '../themes/index';
import { propertyAssign, propertyMap, defaultPadding } from '../common/common';
import rectXAxis from '../common/rectXAxis';
import rectYAxis from '../common/rectYAxis';
import autoTimeMask from '../common/autoTimeMask';
import rectAutoTickCount from '../common/rectAutoTickCount';
import rectLegend from '../common/rectLegend';
import legendFilter from '../common/legendFilter';
import rectTooltip from '../common/rectTooltip';
import label from '../common/label';
import guide from '../common/guide';
import getGeomSizeConfig from '../common/geomSize';

const setSource = (chart, config, data) => {

};

export default /*#__PURE__*/ errorWrap(g2Factory('G2Scatter', {
  getDefaultConfig() {
    return {
      padding: ['auto', 'auto', 'auto', 'auto'],
      colors: themes.category_12,
      xAxis: {
        type: 'linear',
        mask: 'auto',
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
  },
  beforeInit(props) {
    const { config } = props;
    const preConfig = {};
    if (config.jitter) {
      preConfig.xAxis = {
        type: 'cat',
      };
    }
    const newConfig = merge({}, this.defaultConfig, preConfig, config);

    return Object.assign({}, props, {
      padding: defaultPadding(props.padding || config.padding, newConfig, ...this.defaultConfig.padding),
      config: newConfig,
    });
  },
  init(chart, userConfig, data) {
    const config = userConfig;
    const { colors, jitter, size, geomStyle } = config;

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

    autoTimeMask(defs, this.rawData);

    rectAutoTickCount(chart, config, defs, false);

    chart.source(data, defs);

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

    rectTooltip.call(this, chart, config, {
      crosshairs: null,
    });

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

    if (size) {
      const sizeConfig = getGeomSizeConfig(size, 4, 'y', 'x*y*type*extra');
      geom.size(...sizeConfig);
      chart.legend('x', false);
      chart.legend('y', false);
      chart.legend('extra', false);
    }

    // fix: 设置 rectLegend 后如果再调用 chart.legend 会生成默认图例
    rectLegend.call(this, chart, config, null, false, 'type');

    chart.render();
  },
}));
