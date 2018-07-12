'use strict';

// 引入所需要的库和样式
import merge from '../common/merge';
import { color } from '../theme/index';
import { propertyAssign, propertyMap } from '../common/common';
import rectXAxis from '../common/rectXAxis';
import rectYAxis from '../common/rectYAxis';
import rectLegend from '../common/rectLegend';
import guide from '../common/guide';
import rectTooltip from "../common/rectTooltip";

// 建议将默认配置放在外层，方便后续维护
const defaultConfig = {
  padding: [40, 5, 32, 44],
  colors: color.category_12,
  xAxis: {
    type: 'linear',
    mask: 'YYYY-MM-DD HH:mm:ss',
    autoRotate: false,
  },
  yAxis: {
    min: 0
  },
  jitter: false,
  tooltip: true,
  legend: true
};

const setAxis = (chart, config) => {
  // 设置X轴
  const xAxis = {};

  if (config.jitter) {
    xAxis.grid = {
      align: 'center', // 网格顶点从两个刻度中间开始
      lineStyle: {
        stroke: color.widgetsAxisGrid,
        lineWidth: 1,
        // lineDash: [3, 3]
      }
    };
  }

  // 扰动点图不能打开垂直网格线
  if (config.grid && !config.jitter) {
    xAxis.grid = {
      lineStyle: {
        stroke: color.widgetsAxisGrid,
        lineWidth: 1
      }
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
        type: config.jitter ? 'cat' : 'linear'
      },
      config.xAxis
    ),
    type: {
      type: 'cat'
    }
  };

  defs.y = propertyAssign(
    propertyMap.yAxis,
    {
      type: 'linear',
      tickCount: 5
    },
    config.yAxis
  );

  chart.source(data, defs);
};

const chartRender = (chart, config) => {
  const geom = chart
    .point()
    .color('type', config.colors)
    .position('x*y')
    .size(4)
    .shape('circle')
    .active(false);

  if (config.jitter) {
    geom.adjust('jitter');
  }

  chart.render();
};

export default {
  beforeInit(props) {
    const { config } = props;
    const preConfig = {};
    if (config.jitter) {
      preConfig.xAxis = {
        type: 'cat'
      };
    }
    const newConfig = merge({}, defaultConfig, preConfig, config);

    return Object.assign({}, props, {
      padding: props.padding || config.padding || (newConfig.legend ? defaultConfig.padding : [16, 5, 32, 44]),
      config: newConfig
    });
  },
  init(chart, userConfig, data) {
    const config = userConfig;
    setSource(chart, config, data);

    setAxis(chart, config);

    rectTooltip.call(this, chart, config, {
      crosshairs: null,
    });

    rectLegend.call(this, chart, config);

    // 绘制辅助线，辅助背景区域
    guide(chart, config);

    chartRender(chart, config);
  }
};
