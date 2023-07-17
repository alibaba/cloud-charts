'use strict';

import { Chart, View, Geometry, Types, BaseChartConfig, ChartData, Colors } from '../common/types';
import Base, { ChartProps } from '../common/Base';
import errorWrap from '../common/errorWrap';
import themes from '../themes/index';
import { getShapeFactory } from '@antv/g2/esm/core';
import { propertyAssign, getDataIndexColor, propertyMap } from '../common/common';
import highchartsDataToG2Data, { DataAdapterConfig, DataAdapterData } from '../common/dataAdapter';
import { GuideConfig } from '../common/guide';
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

interface WlineboxConfig extends BaseChartConfig, BoxConfig, LineConfig {
  xAxis?: (Types.ScaleOption & XAxisConfig) | false;
  yAxis?: (Types.ScaleOption & YAxisConfig) | false;
  legend?: LegendConfig | boolean;
  tooltip?: TooltipConfig | boolean;
  guide?: GuideConfig;
  grid?: boolean;
}

function getLegendItems(
  lineData: DataAdapterData[],
  boxData: DataAdapterData[],
  lineGeom: Geometry,
  boxGeom: Geometry,
  config: WlineboxConfig,
) {
  const result: any[] = [];
  const reMap: { [key: string]: boolean } = {};
  const { lineColors, boxColors } = config;
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
          color: typeof colors === 'string' ? colors : Array.isArray(colors) ? colors[i % colors.length] : colors(name),
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
  getItems(boxData, boxGeom, 'box', boxColors);
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

export class Linebox extends Base<WlineboxConfig> {
  chartName = 'G2Linebox';

  convertData = false;

  getDefaultConfig(): WlineboxConfig {
    return {
      lineColors: themes.category_12.slice(1),
      boxColors: themes.linear_10,
      padding: 'auto',
      xAxis: {
        type: 'timeCat', // 默认为线性
        mask: 'auto',
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
      dodge: true,
      marginRatio: 0,
      grid: false,
      symbol: false,
      boxSize: null,
    };
  }

  beforeInit(props: ChartProps<WlineboxConfig>): ChartProps<WlineboxConfig> {
    return {
      syncViewPadding: true,
      ...props,
    };
  }

  rawLineData: DataAdapterData[] = [];
  lineView: View;

  rawBoxData: DataAdapterData[] = [];
  boxView: View;

  init(chart: Chart, config: WlineboxConfig, data: ChartData) {
    const rawLineData: DataAdapterData[] = [];
    this.rawLineData = rawLineData;
    const rawBoxData: DataAdapterData[] = [];
    this.rawBoxData = rawBoxData;

    (data || []).forEach((d: DataAdapterData) => {
      if (d.type === 'line') {
        rawLineData.push(d);
      } else if (d.type === 'box') {
        rawBoxData.push(d);
      }
    });

    const lineData = highchartsDataToG2Data(rawLineData, config as DataAdapterConfig, {});
    const boxData = highchartsDataToG2Data(rawBoxData, config as DataAdapterConfig, {});

    const defs: Record<string, Types.ScaleOption> = {
      x: propertyAssign(
        propertyMap.axis,
        {
          type: 'cat',
          // fix 更新数据时x轴无法清除数据
          sync: true,
        },
        config.xAxis,
      ),
      type: {
        type: 'cat',
      },
    };

    // 双轴
    if (Array.isArray(config.yAxis)) {
      config.yAxis.forEach((axis, yIndex) => {
        defs[`y${yIndex}`] = propertyAssign(
          propertyMap.axis,
          {
            type: 'linear',
            tickCount: 5,
            nice: true,
          },
          axis,
        );
      });
    } else {
      defs.y = propertyAssign(
        propertyMap.axis,
        {
          type: 'linear',
          tickCount: 5,
          // 单轴时，必须同步度量，否则会两个度量叠加在一起
          sync: true,
          nice: true,
        },
        config.yAxis,
      );
    }

    autoTimeMask(defs, this.rawData);

    chart.scale(defs);

    // 设置X轴
    rectXAxis(this, chart, config);

    if (Array.isArray(config.yAxis)) {
      config.yAxis.forEach((axis, yIndex) => {
        const axisColor =
          getDataIndexColor(config.lineColors, rawLineData, yIndex) ||
          getDataIndexColor(config.boxColors, rawBoxData, yIndex) ||
          themes['widgets-axis-line'];
        const yAxisConfig: Types.AxisCfg = {
          line: {
            style: {
              stroke: axisColor,
            },
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

    rectTooltip(this, chart, config, {}, null, {
      showCrosshairs: false,
      showMarkers: false,
    });

    // 正式开始绘图，创建两个不同的view
    const boxView = chart.createView({
      padding: config.padding === 'auto' ? 'auto' : 0,
    });
    boxView.data(boxData);
    this.boxView = boxView;

    // Tooltip 背景区域
    activeRegionWithTheme(boxView);

    const lineView = chart.createView({
      padding: config.padding === 'auto' ? 'auto' : 0,
    });
    lineView.data(lineData);
    this.lineView = lineView;
    // 关闭一个View的X轴，避免重叠字体变粗
    lineView.axis('x', false);

    if (Array.isArray(config.yAxis)) {
      config.yAxis.forEach((asix, yIndex) => {
        if (getDataIndexColor(config.boxColors, rawBoxData, yIndex)) {
          drawBox(boxView, config, `y${yIndex}`, 'type');
        }
        if (getDataIndexColor(config.lineColors, rawLineData, yIndex)) {
          drawLine(lineView, config, `y${yIndex}`, 'type');
        }
      });
    } else {
      // 单Y轴时同时关闭一个View的Y轴，避免重叠字体变粗
      lineView.axis('y', false);

      drawBox(boxView, config, 'y', 'type');
      drawLine(lineView, config, 'y', 'type');
    }

    // 绘制辅助线，辅助背景区域
    // viewGuide(config, lineView, rawLineData, boxView, rawBoxData);

    legendFilter(this, boxView, 'rawBoxData');
    legendFilter(this, lineView, 'rawLineData');

    rectLegend(
      this,
      chart,
      config,
      {
        items: getLegendItems(rawLineData, rawBoxData, lineView.geometries[0], boxView.geometries[0], config),
      },
      false,
    );
  }

  changeData(chart: Chart, config: WlineboxConfig, data: ChartData) {
    const rawLineData: DataAdapterData[] = [];
    this.rawLineData = rawLineData;
    const rawBoxData: DataAdapterData[] = [];
    this.rawBoxData = rawBoxData;
    (data || []).forEach((d: DataAdapterData) => {
      if (d.type === 'line') {
        rawLineData.push(d);
      } else if (d.type === 'box') {
        rawBoxData.push(d);
      }
    });

    const lineData = highchartsDataToG2Data(rawLineData, config as DataAdapterConfig, {});
    const boxData = highchartsDataToG2Data(rawBoxData, config as DataAdapterConfig, {});

    this.boxView && this.boxView.data(boxData);
    this.lineView && this.lineView.data(lineData);

    if (this.boxView && this.lineView) {
      const chartOptions = chart.getOptions();
      const legend = chart.getController('legend');
      const legendCos = legend.getComponents();
      // 图例项可见，更新图例项
      if (legend.visible && legendCos.length > 0 && typeof chartOptions.legends === 'object') {
        chartOptions.legends.items = getLegendItems(
          rawLineData,
          rawBoxData,
          this.lineView.geometries[0],
          this.boxView.geometries[0],
          config,
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

const Wlinebox: typeof Linebox = errorWrap(Linebox);

export default Wlinebox;

interface BoxConfig {
  boxColors?: Colors;
  marginRatio?: number;
  dodge?: boolean;
  boxLabel?: LabelConfig | boolean;
  boxGeomStyle?: GeomStyleConfig;
  boxSize?: GeomSizeConfig;
  boxMinSize?: number;
  boxMaxSize?: number;
}

function drawBox(chart: View, config: WlineboxConfig, yAxisKey = 'y', legendKey = 'type') {
  const { marginRatio, dodge, boxSize, boxColors, boxMinSize = 20, boxMaxSize = 24 } = config;
  const geomConfig = {
    minColumnWidth: boxMinSize || null,
    maxColumnWidth: boxMaxSize || null,
  };

  const intervalGeom = chart.schema(geomConfig).position(['x', 'y']).shape('box').color(legendKey, boxColors);

  if (dodge !== false) {
    intervalGeom.adjust([
      {
        type: 'dodge',
        marginRatio: marginRatio || 0.5, // 数值范围为 0 至 1，用于调整分组中各个柱子的间距
      },
    ]);
  }
  geomSize(intervalGeom, boxSize, null, yAxisKey, `x*${yAxisKey}*${legendKey}*extra`);

  geomStyle(
    intervalGeom,
    config.boxGeomStyle,
    {
      lineWidth: 2,
    },
    `x*${yAxisKey}*${legendKey}*extra`,
  );

  return intervalGeom;
}

interface LineConfig {
  // colors?: string[];
  areaColors?: string[];
  lineColors?: Colors;
  area?:
    | boolean
    | {
        geomStyle?: GeomStyleConfig;
      };
  stack?: boolean; // 仅Area有效
  spline?: boolean;
  step?: string | boolean;
  symbol?:
    | {
        size?: GeomSizeConfig;
        geomStyle?: GeomStyleConfig;
      }
    | boolean;
  lineLabel?: LabelConfig | boolean;
  lineWidth?: number;
  lineGeomStyle?: GeomStyleConfig;
}
function drawLine(chart: View, config: WlineboxConfig, yAxisKey = 'y', legendKey = 'type') {
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
    areaGeom = chart
      .area()
      .position(['x', yAxisKey])
      .color(legendKey, areaColors)
      .tooltip(false)
      .shape(areaShape)
      .adjust('stack');
    lineGeom = chart
      .line()
      .position(['x', yAxisKey])
      .color(legendKey, config.lineColors)
      .shape(lineShape)
      .adjust('stack');
  } else if (config.area && !stack) {
    areaGeom = chart.area().position(['x', yAxisKey]).color(legendKey, areaColors).tooltip(false).shape(areaShape);
    lineGeom = chart.line().position(['x', yAxisKey]).color(legendKey, config.lineColors).shape(lineShape);
  } else {
    lineGeom = chart.line().position(['x', yAxisKey]).color(legendKey, config.lineColors).shape(lineShape);
  }

  if (areaGeom && typeof config.area === 'object') {
    if (config.area.geomStyle) {
      geomStyle(areaGeom, config.area.geomStyle, {}, `x*${yAxisKey}*type*extra`);
    }
  }

  geomStyle(
    lineGeom,
    config.lineGeomStyle,
    {
      lineWidth: lineWidth || themes['widgets-line-width'],
      lineJoin: 'round',
    },
    `x*${yAxisKey}*${legendKey}*extra`,
  );

  label({ geom: lineGeom, config: config, field: yAxisKey, extraConfigKey: 'lineLabel' });

  // 曲线默认点
  if (config.symbol) {
    let pointGeom = null;

    if (config.area && stack) {
      pointGeom = chart
        .point()
        .adjust('stack')
        .position(['x', yAxisKey])
        .color(legendKey, config.lineColors)
        .shape('circle')
        .size(3);
    } else {
      pointGeom = chart.point().position(['x', yAxisKey]).color(legendKey, config.lineColors).shape('circle').size(3);
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
