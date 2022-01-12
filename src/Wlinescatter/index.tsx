'use strict';

import { Chart, View, Geometry, Types, BaseChartConfig, ChartData, Colors } from '../common/types';
import Base, { ChartProps } from "../common/Base";
import { MarkerSymbols } from "@antv/g2/esm/util/marker";
import { getShapeFactory } from "@antv/g2/esm/core";
import errorWrap from '../common/errorWrap';
import themes from '../themes/index';
import { propertyAssign, getDataIndexColor, propertyMap } from '../common/common';
import highchartsDataToG2Data, { DataAdapterConfig, DataAdapterData } from '../common/dataAdapter';
import { drawGuideArea, drawGuideLine, drawGuideFilter, GuideConfig, GuideLineConfig, GuideAreaConfig, GuideFilterConfig } from '../common/guide';
import rectXAxis, { XAxisConfig } from '../common/rectXAxis';
import rectYAxis, { YAxisConfig } from '../common/rectYAxis';
import autoTimeMask from '../common/autoTimeMask';
import rectTooltip, { TooltipConfig } from '../common/rectTooltip';
import rectLegend, { LegendConfig } from '../common/rectLegend';
import legendFilter from '../common/legendFilter';
import label, { LabelConfig } from '../common/label';
import geomSize, { GeomSizeConfig } from '../common/geomSize';
import geomStyle, { GeomStyleConfig } from '../common/geomStyle';
import { activeRegionWithTheme } from '../common/interaction';
import { warn } from '../common/log';
import './index.scss';

interface WlinescatterConfig extends BaseChartConfig, ScatterConfig, LineConfig {
  xAxis?: Types.ScaleOption & XAxisConfig | false;
  yAxis?: Types.ScaleOption & YAxisConfig | false;
  legend?: LegendConfig | boolean;
  tooltip?: TooltipConfig | boolean;
  guide?: GuideConfig;
  grid?: boolean;
}

function getLegendItems(
  lineData: DataAdapterData[],
  scatterData: DataAdapterData[],
  lineGeom: Geometry,
  scatterGeom: Geometry,
  config: WlinescatterConfig
) {
  const result: any[] = [];
  const reMap: { [key: string]: boolean } = {};
  const { lineColors, scatterColors } = config;
  function getItems(
    data: DataAdapterData[],
    geom: Geometry,
    shapeType: string,
    colors: Colors,
    style?: Types.LooseObject,
  ) {
    data.forEach((d, i) => {
      const { name, visible, data } = d;
      if (reMap[name] || !data || data.length === 0) {
        return;
      } else {
        reMap[name] = true;
      }
      let marker;
      const shapeFactory = getShapeFactory(geom.shapeType);
      if (shapeFactory) {
        marker = shapeFactory.getMarker(shapeType, {
          color: typeof colors === 'string' ? colors : (Array.isArray(colors) ? colors[i % colors.length] : colors(name)),
          isInPolar: false,
        });

        const symbol = marker.symbol;
        // @ts-ignore
        if (typeof symbol === 'string' && MarkerSymbols[symbol]) {
          // @ts-ignore
          marker.symbol = MarkerSymbols[symbol];
        }
      }
      if (style) {
        Object.assign(marker.style, style);
      }
      result.push({
        id: name,
        name,
        value: name,
        marker,
        unchecked: visible === false,
      });
    });
  }
  getItems(scatterData, scatterGeom, 'point', scatterColors);
  const { area, spline } = config;
  let lineShapeType = 'line';
  const lineStyle: Types.LooseObject = {};
  if (area) {
    lineShapeType = 'area';
  }
  if (spline) {
    lineShapeType = 'smooth';
  }
  if (!area && spline) {
    lineStyle.fill = null;
  }
  getItems(lineData, lineGeom, lineShapeType, lineColors, lineStyle);
  
  return result;
}

export class Linescatter extends Base<WlinescatterConfig> {
  chartName = 'G2LineScatter';

  convertData = false;

  getDefaultConfig(): WlinescatterConfig {
    return {
      lineColors: themes.category_12.slice(1),
      scatterColors: themes.linear_10,
      padding: 'auto',
      xAxis: {
        type: 'timeCat', // 默认为线性
        mask: 'YYYY-MM-DD HH:mm:ss', // 上述type为time时，此字段生效
        labelFormatter: null, // 可以强制覆盖，手动设置label
        categories: null,
        // autoRotate: false,
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
      spline: false,
      grid: false,
      symbol: false,
      scatterSize: null,
    }
  }

  beforeInit(props: ChartProps<WlinescatterConfig>): ChartProps<WlinescatterConfig> {
    return {
      syncViewPadding: true,
      ...props,
    }
  }

  rawLineData: DataAdapterData[] = [];
  lineView: View;

  rawScatterData: DataAdapterData[] = [];
  scatterView: View;

  init(chart: Chart, config: WlinescatterConfig, data: ChartData) {
    const rawLineData: DataAdapterData[] = [];
    this.rawLineData = rawLineData;
    const rawScatterData: DataAdapterData[] = [];
    this.rawScatterData = rawScatterData;
    (data || []).forEach((d: DataAdapterData) => {
      if (d.type === 'line') {
        rawLineData.push(d);
      } else if (d.type === 'scatter') {
        rawScatterData.push(d);
      }
    });

    const lineData = highchartsDataToG2Data(rawLineData, config as DataAdapterConfig, {
      // type: 'lineType',
    });
    const scatterData = highchartsDataToG2Data(rawScatterData, config as DataAdapterConfig, {
      // type: 'scatterType',
    });
    console.log(rawScatterData, scatterData);

    const defs: Record<string, Types.ScaleOption> = {
      x: propertyAssign(propertyMap.axis, {
        type: 'cat',
        // fix 更新数据时x轴无法清除数据
        // sync: 'x',
      }, config.xAxis),
      type: {
        type: 'cat',
      },
    };

    if (Array.isArray(config.yAxis)) {
      config.yAxis.forEach((axis, yIndex) => {
        defs[`y${yIndex}`] = propertyAssign(propertyMap.axis, {
          type: 'linear',
          tickCount: 5,
          nice: true,
        }, axis);
      });
    } else {
      defs.y = propertyAssign(propertyMap.axis, {
        type: 'linear',
        tickCount: 5,
        // 单轴时，必须同步度量，否则会两个度量叠加在一起
        sync: true,
        nice: true,
      }, config.yAxis);
    }

    autoTimeMask(defs, this.rawData);

    chart.scale(defs);

    // 设置X轴
    rectXAxis(this, chart, config);

    if (Array.isArray(config.yAxis)) {
      config.yAxis.forEach((axis, yIndex) => {
        const axisColor = getDataIndexColor(config.lineColors, rawLineData, yIndex) || getDataIndexColor(config.scatterColors, rawScatterData, yIndex) || themes['widgets-axis-line'];
        const yAxisConfig: Types.AxisCfg = {
          line: {
            style: {
              stroke: axisColor,
            }
          },
        };
        if (yIndex !== 0) {
          yAxisConfig.grid = null;
          // 因为是多个view组成的图表，所以这里需要移动位置
          yAxisConfig.position = 'right';
        }

        rectYAxis(this, chart, { ...config, yAxis: axis }, `y${yIndex}`, yAxisConfig);
      });
    } else {
      // 设置单个Y轴
      rectYAxis(this, chart, config);
    }

    // tooltip
    rectTooltip(this, chart, config, {}, null, {
      showCrosshairs: false,
      showMarkers: false
    });

    // 正式开始绘图，创建两个不同的view
    const scatterView = chart.createView({
      padding: config.padding === 'auto' ? 'auto' : 0,
    });
    scatterView.data(scatterData);
    this.scatterView = scatterView;

    // Tooltip 背景区域
    activeRegionWithTheme(scatterView);

    const lineView = chart.createView({
      padding: config.padding === 'auto' ? 'auto' : 0,
    });
    lineView.data(lineData);
    this.lineView = lineView;
    // 关闭一个View的X轴，避免重叠字体变粗
    lineView.axis('x', false);

    if (Array.isArray(config.yAxis)) {
      config.yAxis.forEach((asix, yIndex) => {
        if (getDataIndexColor(config.scatterColors, rawScatterData, yIndex)) {
          drawScatter(scatterView, config, `y${yIndex}`, 'type');
        }
        if (getDataIndexColor(config.lineColors, rawLineData, yIndex)) {
          drawLine(lineView, config, `y${yIndex}`, 'type');
        }
      });
    } else {
      // 单Y轴时同时关闭一个View的Y轴，避免重叠字体变粗
      lineView.axis('y', false);

      drawScatter(scatterView, config, 'y', 'type');
      drawLine(lineView, config, 'y', 'type');
    }

    // 绘制辅助线，辅助背景区域
    viewGuide(config, lineView, rawLineData, scatterView, rawScatterData);

    legendFilter(this, scatterView, 'rawScatterData');
    legendFilter(this, lineView, 'rawLineData');

    rectLegend(this, chart, config, {
      items: getLegendItems(rawLineData, rawScatterData, lineView.geometries[0], scatterView.geometries[0], config),
    }, false);
  }

  changeData(chart: Chart, config: WlinescatterConfig, data: ChartData) {
    const rawLineData: DataAdapterData[] = [];
    this.rawLineData = rawLineData;
    const rawScatterData: DataAdapterData[] = [];
    this.rawScatterData = rawScatterData;
    (data || []).forEach((d: DataAdapterData) => {
      if (d.type === 'line') {
        rawLineData.push(d);
      } else if (d.type === 'scatter') {
        rawScatterData.push(d);
      }
    });

    const lineData = highchartsDataToG2Data(rawLineData, config as DataAdapterConfig, {
      // type: 'lineType',
    });
    const scatterData = highchartsDataToG2Data(rawScatterData, config as DataAdapterConfig, {
      // type: 'scatterType',
    });

    this.scatterView && this.scatterView.data(scatterData);
    this.lineView && this.lineView.data(lineData);

    if (this.scatterView && this.lineView) {
      const chartOptions = chart.getOptions();
      const legend = chart.getController('legend');
      const legendCos = legend.getComponents();
      // 图例项可见，更新图例项
      if (legend.visible && legendCos.length > 0 && typeof chartOptions.legends === 'object') {
        chartOptions.legends.items = getLegendItems(
          rawLineData,
          rawScatterData,
          this.lineView.geometries[0],
          this.scatterView.geometries[0],
          config
        );
        // chart.legend({
        //   items: newItems
        // });
      }
    }

    // 更新数据后再次render，保证 padding 能正确计算。
    chart.render(true);
  }
}

const Wlinescatter: typeof Linescatter = errorWrap(Linescatter);

export default Wlinescatter;

interface jitterConfig {
  adjustNames?: string[];
}

interface ScatterConfig {
  scatterColors?: Colors;
  scatterSize?: GeomSizeConfig;
  jitter?: jitterConfig | boolean;
  scatterLabel?: LabelConfig | boolean;
  scatterGeomStyle?: GeomStyleConfig;
}
function drawScatter(chart: View, config: WlinescatterConfig, yAxisKey = 'y', legendKey = 'type') {
  const { scatterColors, jitter, scatterSize, scatterGeomStyle } = config;

  let intervalGeom = null;

  intervalGeom = chart
  .point()
  .color('type', scatterColors)
  .position('x*y')
  .shape('circle');

  if (jitter) {
    if (typeof jitter === 'object') {
      intervalGeom.adjust({
        type: 'jitter',
        ...jitter,
      });
    } else {
      intervalGeom.adjust('jitter');
    }
  }

  geomStyle(intervalGeom, scatterGeomStyle)

  label(intervalGeom, config, yAxisKey, null, 'scatterLabel');

  geomSize(intervalGeom, scatterSize, 4, 'y', 'x*y*type*extra');

  return intervalGeom;
}

interface LineConfig {
  // colors?: string[];
  areaColors?: string[];
  lineColors?: Colors;
  area?: boolean | {
    geomStyle?: GeomStyleConfig;
  };
  stack?: boolean; // 仅Area有效
  spline?: boolean;
  step?: string | boolean;
  symbol?: {
    size?: GeomSizeConfig;
    geomStyle?: GeomStyleConfig;
  } | boolean;
  lineLabel?: LabelConfig | boolean;
  lineWidth?: number;
  lineGeomStyle?: GeomStyleConfig;
}
function drawLine(chart: View, config: WlinescatterConfig, yAxisKey = 'y', legendKey = 'type') {
  let areaColors = config.areaColors || config.lineColors;
  if (Array.isArray(config.lineColors) && Array.isArray(config.areaColors)) {
    areaColors = mergeArray([], config.lineColors, config.areaColors);
  }

  let lineGeom = null;
  let areaGeom = null;
  const { lineWidth } = config;

  // 区域、堆叠、平滑曲线
  const lineShape = config.spline ? 'smooth' : 'line';
  const areaShape = config.spline ? 'smooth' : 'area';

  const stack = config.stack;

  if (config.area && stack) {
    areaGeom = chart.area()
      .position(['x', yAxisKey])
      .color(legendKey, areaColors)
      .tooltip(false)
      .shape(areaShape)
      .adjust('stack');
    lineGeom = chart.line()
      .position(['x', yAxisKey])
      .color(legendKey, config.lineColors)
      .shape(lineShape)
      .adjust('stack');
  } else if (config.area && !stack) {
    areaGeom = chart.area()
      .position(['x', yAxisKey])
      .color(legendKey, areaColors)
      .tooltip(false)
      .shape(areaShape)
    lineGeom = chart.line()
      .position(['x', yAxisKey])
      .color(legendKey, config.lineColors)
      .shape(lineShape);
  } else {
    lineGeom = chart.line()
      .position(['x', yAxisKey])
      .color(legendKey, config.lineColors)
      .shape(lineShape);
  }

  if (areaGeom && typeof config.area === 'object') {
    if (config.area.geomStyle) {
      geomStyle(areaGeom, config.area.geomStyle, {}, `x*${yAxisKey}*type*extra`);
    }
  }

  geomStyle(lineGeom, config.lineGeomStyle, {
    lineWidth: lineWidth || themes['widgets-line-width'],
    lineJoin: 'round',
  }, `x*${yAxisKey}*${legendKey}*extra`);

  label(lineGeom, config, yAxisKey, null, 'lineLabel');

  // 曲线默认点
  if (config.symbol) {
    let pointGeom = null;

    if (config.area && stack) {
      pointGeom = chart.point()
        .adjust('stack')
        .position(['x', yAxisKey])
        .color(legendKey, config.lineColors)
        .shape('circle')
        .size(3)
    } else {
      pointGeom = chart.point()
        .position(['x', yAxisKey])
        .color(legendKey, config.lineColors)
        .shape('circle')
        .size(3)
    }

    if (typeof config.symbol === 'object') {
      geomSize(pointGeom, config.symbol.size, 3, yAxisKey, legendKey);

      if (config.symbol.geomStyle) {
        geomStyle(pointGeom, config.symbol.geomStyle, {}, `x*${yAxisKey}*${legendKey}*extra`);
      }
    }
  }

  return lineGeom;
}

function viewGuide(config: WlinescatterConfig, lineView: View, rawLineData: DataAdapterData[], scatterView: View, rawScatterData: DataAdapterData[]) {
  const { guide } = config;
  if (!guide) {
    return;
  }

  const { line: guideLine, area: guideArea, filter: guideFilter, ...other } = guide;

  if (guideLine) {
    if (Array.isArray(guideLine)) {
      guideLine.forEach((line) => {
        drawGuideLine(getGuideView(config, line, lineView, rawLineData, scatterView, rawScatterData), line);
      });
    } else {
      drawGuideLine(getGuideView(config, guideLine, lineView, rawLineData, scatterView, rawScatterData), guideLine);
    }
  }

  if (guideArea) {
    if (Array.isArray(guideArea)) {
      guideArea.forEach((area) => {
        drawGuideArea(getGuideView(config, area, lineView, rawLineData, scatterView, rawScatterData), area);
      });
    } else {
      drawGuideArea(getGuideView(config, guideArea, lineView, rawLineData, scatterView, rawScatterData), guideArea);
    }
  }

  if (guideFilter) {
    if (Array.isArray(guideFilter)) {
      guideFilter.forEach((filter) => {
        drawGuideFilter(getGuideView(config, filter, lineView, rawLineData, scatterView, rawScatterData), filter);
      });
    } else {
      drawGuideFilter(getGuideView(config, guideFilter, lineView, rawLineData, scatterView, rawScatterData), guideFilter);
    }
  }

  if (!guideLine && !guideArea && !guideFilter && Object.keys(other).length > 0) {
    warn('config.guide', '配置异常，请使用 guide.line、guide.area、guide.filter');
  }
}

type SimpleGuideConfig = { target?: string; } & ( GuideLineConfig | GuideAreaConfig | GuideFilterConfig );
function getGuideView(config: WlinescatterConfig, guide: SimpleGuideConfig, lineView: View, rawLineData: DataAdapterData[], scatterView: View, rawScatterData: DataAdapterData[]) {
  const { target, axis, value } = guide;

  // 如果用户指定了绘制目标，直接使用
  if (target === 'line') {
    return lineView;
  } else if (target === 'scatter') {
    return scatterView;
  }

  if (axis && (value || value === 0) && /y\d/.test(axis)) {
    const yIndex = Number(axis.replace(/^y/, ''));
    if (getDataIndexColor(config.scatterColors, rawScatterData, yIndex)) {
      return scatterView;
    }
  }

  return lineView;
}

function mergeArray(target: string[], ...source: string[][]) {
  source.forEach((s) => {
    if (!s || s.length === 0) {
      return;
    }
    s.forEach((item, i) => {
      if (i >= target.length) {
        target.push(item);
      } else {
        target[i] = item;
      }
    });
  });

  return target;
}