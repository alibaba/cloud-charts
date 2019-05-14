'use strict';

import merge from '../common/merge';
import themes from '../theme/index';
import { propertyAssign, getDataIndexColor, propertyMap, defaultPadding } from '../common/common';
import highchartsDataToG2Data from '../common/dataAdapter';
import { drawGuideArea, drawGuideLine, drawGuideFilter } from '../common/guide';
import rectXAxis from '../common/rectXAxis';
import rectYAxis from '../common/rectYAxis';
import rectTooltip from '../common/rectTooltip';
import rectLegend from '../common/rectLegend';
import legendFilter from '../common/legendFilter';
import label from '../common/label';
import './G2LineBar.scss';
import { legendHtmlContainer } from '../common/g2Theme';

const defaultConfig = {
  lineColors: themes.category_12.slice(1),
  barColors: themes.linear_10,
  padding: [40, 45, 32, 44],
  xAxis: {
    type: 'timeCat', // 默认为线性
    mask: 'YYYY-MM-DD HH:mm:ss', // 上述type为time时，此字段生效
    labelFormatter: null, // 可以强制覆盖，手动设置label
    categories: null,
    autoRotate: false,
    max: null,
    min: null,
  },
  yAxis: {
    labelFormatter: null, // 可以强制覆盖，手动设置label
    max: null,
    min: null,
  },
  legend: {
    align: 'left',
    nameFormatter: null, // 可以强制覆盖，手动设置label
  },
  tooltip: {
    titleFormatter: null,
    nameFormatter: null,
    valueFormatter: null,
  },
  area: false,
  stack: false, // 仅Area有效
  stackReverse: true,
  spline: false,
  grid: false,
  symbol: false,
  lineLabel: undefined,
  barLabel: undefined,
  label: false,
  // TODO
  // zoom: false,
  // mini: false,
  // dataConfig: {
  //   nameKey: 'name',
  //   valueKey: 'value',
  //   // valueKey: ['value1', 'value2'],
  //   typeKey: 'type'
  // }
};

export default {
  beforeInit(props) {
    const { config } = props;
    const newConfig = merge({}, defaultConfig, config);
    // TODO 处理padding
    return Object.assign({}, props, {
      padding: defaultPadding(props.padding || config.padding, newConfig, ...defaultConfig.padding),
      config: newConfig,
    });
  },
  init(chart, userConfig, data) {
    const config = userConfig;

    const rawLineData = [];
    this.rawLineData = rawLineData;
    const rawBarData = [];
    this.rawBarData = rawBarData;
    data.forEach((d) => {
      if (d.type === 'line') {
        rawLineData.push(d);
      } else if (d.type === 'bar') {
        rawBarData.push(d);
      }
    });

    const lineData = highchartsDataToG2Data(rawLineData, config);
    const barData = highchartsDataToG2Data(rawBarData, config);

    const defs = {
      x: propertyAssign(propertyMap.xAxis, {
        type: 'cat',
        // fix 更新数据时x轴无法清除数据
        // sync: true,
      }, config.xAxis),
      type: {
        type: 'cat',
      },
    };

    if (Array.isArray(config.yAxis)) {
      config.yAxis.forEach((axis, yIndex) => {
        defs[`y${yIndex}`] = propertyAssign(propertyMap.yAxis, {
          type: 'linear',
          tickCount: 5,
        }, axis);
      });
    } else {
      defs.y = propertyAssign(propertyMap.yAxis, {
        type: 'linear',
        tickCount: 5,
        // 单轴时，必须同步度量，否则会两个度量叠加在一起
        sync: true,
      }, config.yAxis);
    }

    chart.scale(defs);

    // 设置X轴
    rectXAxis.call(this, chart, config);

    if (Array.isArray(config.yAxis)) {
      config.yAxis.forEach((axis, yIndex) => {
        const axisColor = getDataIndexColor(config.lineColors, rawLineData, yIndex) || getDataIndexColor(config.barColors, rawBarData, yIndex) || themes['widgets-axis-line'];
        const yAxisConfig = {
          line: {
            stroke: axisColor,
          },
        };
        if (yIndex !== 0) {
          yAxisConfig.grid = null;
          // 因为是多个view组成的图表，所以这里需要移动位置
          yAxisConfig.position = 'right';
        }

        rectYAxis.call(this, chart, { ...config, yAxis: axis }, `y${yIndex}`, yAxisConfig);
      });
    } else {
      // 设置单个Y轴
      rectYAxis.call(this, chart, config);
    }

    // 设置图例
    const legendStyle = {
      ...legendHtmlContainer,
      display: 'inline-block',
      position: 'relative',
    };
    if (config.legend !== false) {
      const { position = 'top', align } = config.legend || {};

      if (position === 'top') {
        legendStyle.top = themes.s3;
      }

      if (align === 'right') {
        legendStyle.marginLeft = themes.s3;
      } else if (align === 'left') {
        legendStyle.marginRight = themes.s3;
      } else if (align === 'center') {
        legendStyle.marginRight = themes.s3;
      } else {
        // 默认放到左边
        legendStyle.marginRight = themes.s3;
      }
    }
    rectLegend.call(this, chart, config, {
      'g2-legend': legendStyle,
    });

    // tooltip
    rectTooltip.call(this, chart, config);

    // 正式开始绘图，创建两个不同的view
    const barView = chart.view();
    barView.source(barData);
    this.barView = barView;

    const lineView = chart.view();
    lineView.source(lineData);
    this.lineView = lineView;

    const lineShape = config.spline ? 'smooth' : 'line';
    const areaShape = config.spline ? 'smooth' : 'area';

    if (Array.isArray(config.yAxis)) {
      config.yAxis.forEach((asix, yIndex) => {
        if (getDataIndexColor(config.barColors, rawBarData, yIndex)) {
          drawBar(barView, config, `y${yIndex}`);
        }
        if (getDataIndexColor(config.lineColors, rawLineData, yIndex)) {
          drawLine(lineView, config, lineShape, areaShape, `y${yIndex}`);
        }
      });
    } else {
      drawBar(barView, config);
      drawLine(lineView, config, lineShape, areaShape);
    }

    // 绘制辅助线，辅助背景区域
    viewGuide(config, lineView, rawLineData, barView, rawBarData);

    legendFilter.call(this, barView, config, 'rawBarData');
    legendFilter.call(this, lineView, config, 'rawLineData');

    chart.render();
  },
  changeData(chart, userConfig, data) {
    const rawLineData = [];
    this.rawLineData = rawLineData;
    const rawBarData = [];
    this.rawBarData = rawBarData;
    data.forEach((d) => {
      if (d.type === 'line') {
        rawLineData.push(d);
      } else if (d.type === 'bar') {
        rawBarData.push(d);
      }
    });

    const lineData = highchartsDataToG2Data(rawLineData, userConfig);
    const barData = highchartsDataToG2Data(rawBarData, userConfig);

    this.barView && this.barView.source(barData);
    this.lineView && this.lineView.source(lineData);
    chart.render();

    // hackLegendPosition.call(this, userConfig);
  },
  afterRender(chart, config) {
    if (config.legend !== false) {
      const { position = 'top', align } = config.legend || {};

      // hack 图例的位置
      const dom = this.chartDom && this.chartDom.querySelector('.g2-legend');
      if (dom && dom.parentNode) {
        dom.parentNode.className = '';

        if (position === 'bottom') {
          dom.parentNode.classList.add('position-bottom');
        }
        dom.parentNode.classList.add(align || 'left');
      }
    } else {
      // 清空类名
      const dom = this.chartDom && this.chartDom.querySelector('.g2-legend');
      if (dom && dom.parentNode) {
        dom.parentNode.className = '';
      }
    }
  },
};

function drawBar(chart, config, yAxisKey = 'y') {
  let intervalGeom = null;
  if (config.stack) {
    intervalGeom = chart.interval().position(['x', yAxisKey]).color('type', config.barColors).adjust([{
      type: 'stack',
      reverseOrder: !config.stackReverse, // 层叠顺序倒序
    }]);
  } else {
    intervalGeom = chart.interval().position(['x', yAxisKey]).color('type', config.barColors).adjust([{
      type: 'dodge',
      marginRatio: 0, // 数值范围为 0 至 1，用于调整分组中各个柱子的间距
    }]);
  }

  label(intervalGeom, config, yAxisKey, null, 'barLabel');
}

function drawLine(chart, config, lineShape, areaShape, yAxisKey = 'y') {
  let lineGeom = null;
  const lineWidth = config.lineWidth;
  const geomStyle = {};
  if (lineWidth !== undefined) {
    geomStyle.lineWidth = lineWidth;
  }

  if (config.area && config.stack) {
    chart.areaStack().position(['x', yAxisKey]).color('type', config.lineColors).shape(areaShape)
      .active(false);
    lineGeom = chart.lineStack().position(['x', yAxisKey]).color('type', config.lineColors).shape(lineShape)
      .style({
        lineJoin: 'round',
        ...geomStyle,
      });
  } else if (config.area && !config.stack) {
    chart.area().position(['x', yAxisKey]).color('type', config.lineColors).shape(areaShape)
      .active(false);
    lineGeom = chart.line().position(['x', yAxisKey]).color('type', config.lineColors).shape(lineShape)
      .style({
        lineJoin: 'round',
        ...geomStyle,
      });
  } else {
    lineGeom = chart.line().position(['x', yAxisKey]).color('type', config.lineColors).shape(lineShape)
      .style({
        lineJoin: 'round',
        ...geomStyle,
      });
  }

  label(lineGeom, config, yAxisKey, null, 'lineLabel');

  // 曲线默认点
  if (config.symbol && config.area && config.stack) {
    chart.point().adjust('stack').position(['x', yAxisKey]).color('type', config.lineColors)
      .shape('circle')
      .size(3)
      .active(false);
  } else if (config.symbol) {
    chart.point().position(['x', yAxisKey]).color('type', config.lineColors).shape('circle')
      .size(3)
      .active(false);
  }
}

function viewGuide(config, lineView, rawLineData, barView, rawBarData) {
  const guide = config.guide;
  if (!guide) {
    return;
  }

  const { line: guideLine, area: guideArea, filter: guideFilter, ...other } = guide;

  if (guideLine) {
    if (Array.isArray(guideLine)) {
      guideLine.forEach((line) => {
        drawGuideLine(getGuideView(config, line, lineView, rawLineData, barView, rawBarData), line);
      });
    } else {
      drawGuideLine(getGuideView(config, guideLine, lineView, rawLineData, barView, rawBarData), guideLine);
    }
  }

  if (guideArea) {
    if (Array.isArray(guideArea)) {
      guideArea.forEach((area) => {
        drawGuideArea(getGuideView(config, area, lineView, rawLineData, barView, rawBarData), area);
      });
    } else {
      drawGuideArea(getGuideView(config, guideArea, lineView, rawLineData, barView, rawBarData), guideArea);
    }
  }

  if (guideFilter) {
    if (Array.isArray(guideFilter)) {
      guideFilter.forEach((filter) => {
        drawGuideFilter(getGuideView(config, filter, lineView, rawLineData, barView, rawBarData), filter);
      });
    } else {
      drawGuideFilter(getGuideView(config, guideFilter, lineView, rawLineData, barView, rawBarData), guideFilter);
    }
  }

  if (!guideLine && !guideArea && !guideFilter && Object.keys(other).length > 0) {
    console.warn('guide 定义异常，请使用 guide.line 或 guide.area');
  }
}

function getGuideView(config, guide, lineView, rawLineData, barView, rawBarData) {
  const { target, axis, value } = guide;

  // 如果用户指定了绘制目标，直接使用
  if (target === 'line') {
    return lineView;
  } else if (target === 'bar') {
    return barView;
  }

  if (axis && (value || value === 0) && /y\d/.test(axis)) {
    const yIndex = Number(axis.replace(/^y/, ''));
    if (getDataIndexColor(config.barColors, rawBarData, yIndex)) {
      return barView;
    }
  }

  return lineView;
}
