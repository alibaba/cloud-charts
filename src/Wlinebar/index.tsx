'use strict';

import { Chart, View, Geometry, Types, BaseChartConfig, ChartData } from '../common/types';
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
import './index.scss';

interface WlinebarConfig extends BaseChartConfig, BarConfig, LineConfig {
  xAxis?: Types.ScaleOption & XAxisConfig | false,
  yAxis?: Types.ScaleOption & YAxisConfig | false,
  legend?: LegendConfig | boolean,
  tooltip?: TooltipConfig | boolean,
  guide?: GuideConfig,
  grid?: boolean,
}

function getLegendItems(
  lineData: DataAdapterData[],
  barData: DataAdapterData[],
  lineGeom: Geometry,
  barGeom: Geometry,
  config: WlinebarConfig
) {
  const result: any[] = [];
  const reMap: { [key: string]: boolean } = {};
  const { lineColors, barColors } = config;
  function getItems(
    data: DataAdapterData[],
    geom: Geometry,
    shapeType: string,
    colors: string[],
    style?: Types.LooseObject,
  ) {
    data.forEach((d, i) => {
      const { name, visible } = d;
      if (reMap[name]) {
        return;
      } else {
        reMap[name] = true;
      }
      let marker;
      const shapeFactory = getShapeFactory(geom.shapeType);
      if (shapeFactory) {
        marker = shapeFactory.getMarker(shapeType, {
          color: colors[i % colors.length],
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
  getItems(barData, barGeom, 'point', barColors);
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
  // lineData.forEach((d, i) => {
  //   const { name, visible } = d;
  //   if (reMap[name]) {
  //     return;
  //   }
  //   let marker;
  //   const shapeFactory = getShapeFactory(lineGeom.shapeType);
  //   if (shapeFactory) {
  //     marker = shapeFactory.getMarker('point', {
  //       color: lineColors[i % lineColors.length],
  //       isInPolar: false,
  //     });
  //     // lineGeom.getShapeMarker
  //
  //     const symbol = marker.symbol;
  //     // @ts-ignore
  //     if (typeof symbol === 'string' && MarkerSymbols[symbol]) {
  //       // @ts-ignore
  //       marker.symbol = MarkerSymbols[symbol];
  //     }
  //   }
  //
  //   result.push({
  //     id: name,
  //     name,
  //     value: name,
  //     marker,
  //     unchecked: visible === false,
  //   });
  //   reMap[name] = true;
  // });
  // barData.forEach((d, i) => {
  //   const { name, visible } = d;
  //   if (reMap[name]) {
  //     return;
  //   }
  //   let marker;
  //   const shapeFactory = getShapeFactory(barGeom.shapeType);
  //   if (shapeFactory) {
  //     marker = shapeFactory.getMarker('point', {
  //       color: barColors[i % barColors.length],
  //       isInPolar: false,
  //     });
  //
  //     const symbol = marker.symbol;
  //     // @ts-ignore
  //     if (typeof symbol === 'string' && MarkerSymbols[symbol]) {
  //       // @ts-ignore
  //       marker.symbol = MarkerSymbols[symbol];
  //     }
  //   }
  //
  //   result.push({
  //     id: name,
  //     name,
  //     value: name,
  //     marker,
  //     unchecked: visible === false,
  //   });
  //   reMap[name] = true;
  // });
  return result;
}

export class Linebar extends Base<WlinebarConfig> {
  chartName = 'G2LineBar';

  convertData = false;

  getDefaultConfig(): WlinebarConfig {
    return {
      lineColors: themes.category_12.slice(1),
      barColors: themes.linear_10,
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
      dodgeStack: false,
      stack: false, // 仅Area有效
      stackReverse: true,
      marginRatio: 0,
      spline: false,
      grid: false,
      symbol: false,
      // lineLabel: undefined,
      // barLabel: undefined,
      // TODO
      // zoom: false,
      // mini: false,
      // dataConfig: {
      //   nameKey: 'name',
      //   valueKey: 'value',
      //   // valueKey: ['value1', 'value2'],
      //   typeKey: 'type'
      // }
    }
  }

  beforeInit(props: ChartProps<WlinebarConfig>): ChartProps<WlinebarConfig> {
    return {
      syncViewPadding: true,
      ...props,
    }
  }

  rawLineData: DataAdapterData[] = [];
  lineView: View;

  rawBarData: DataAdapterData[] = [];
  barView: View;

  init(chart: Chart, config: WlinebarConfig, data: ChartData) {
    const rawLineData: DataAdapterData[] = [];
    this.rawLineData = rawLineData;
    const rawBarData: DataAdapterData[] = [];
    this.rawBarData = rawBarData;
    (data || []).forEach((d: DataAdapterData) => {
      if (d.type === 'line') {
        rawLineData.push(d);
      } else if (d.type === 'bar') {
        rawBarData.push(d);
      }
    });

    const lineData = highchartsDataToG2Data(rawLineData, config as DataAdapterConfig, {
      // type: 'lineType',
    });
    const barData = highchartsDataToG2Data(rawBarData, config as DataAdapterConfig, {
      // type: 'barType',
    });

    const defs: Record<string, Types.ScaleOption> = {
      x: propertyAssign(propertyMap.xAxis, {
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

    autoTimeMask(defs, this.rawData);

    chart.scale(defs);

    // 设置X轴
    rectXAxis.call(this, chart, config);

    if (Array.isArray(config.yAxis)) {
      config.yAxis.forEach((axis, yIndex) => {
        const axisColor = getDataIndexColor(config.lineColors, rawLineData, yIndex) || getDataIndexColor(config.barColors, rawBarData, yIndex) || themes['widgets-axis-line'];
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

        rectYAxis.call(this, chart, { ...config, yAxis: axis }, `y${yIndex}`, yAxisConfig);
      });
    } else {
      // 设置单个Y轴
      rectYAxis.call(this, chart, config);
    }

    // 设置图例
    // const legendStyle = {
    //   ...legendHtmlContainer,
    //   display: 'inline-block',
    //   position: 'relative',
    // };
    // // const legendItemStyle = {
    // //   ...legendHtmlListItem,
    // // };
    // if (config.legend !== false) {
    //   const { position, align } = config.legend || {};
    //
    //   // if (position === 'top') {
    //   //   legendStyle.top = themes['widgets-font-size-1'];
    //   // }
    //
    //   if (align === 'right') {
    //     legendStyle.marginLeft = themes['widgets-font-size-1'];
    //   } else if (align === 'left') {
    //     legendStyle.marginRight = themes['widgets-font-size-1'];
    //   } else if (align === 'center') {
    //     legendStyle.marginRight = themes['widgets-font-size-1'];
    //   } else {
    //     // 默认放到左边
    //     legendStyle.marginRight = themes['widgets-font-size-1'];
    //   }
    //
    //   if (position === 'bottom') {
    //     legendStyle.top = '100%';
    //     legendStyle.transform = 'translate(0, -100%)';
    //     legendStyle.overflow = 'visible';
    //     legendStyle.verticalAlign = 'top';
    //
    //     // legendItemStyle.marginBottom = 0;
    //     // legendItemStyle.marginTop = themes['widgets-font-size-1'];
    //   }
    // }


    // tooltip
    rectTooltip.call(this, chart, config, {}, null, {
      showCrosshairs: false,
      showMarkers: false
    });

    // 正式开始绘图，创建两个不同的view
    const barView = chart.createView({
      padding: config.padding === 'auto' ? 'auto' : 0,
    });
    barView.data(barData);
    this.barView = barView;

    // Tooltip 背景区域
    barView.interaction('active-region');

    const lineView = chart.createView({
      padding: config.padding === 'auto' ? 'auto' : 0,
    });
    lineView.data(lineData);
    this.lineView = lineView;
    // 关闭一个View的X轴，避免重叠字体变粗
    lineView.axis('x', false);

    if (Array.isArray(config.yAxis)) {
      config.yAxis.forEach((asix, yIndex) => {
        if (getDataIndexColor(config.barColors, rawBarData, yIndex)) {
          drawBar(barView, config, `y${yIndex}`, 'type');
        }
        if (getDataIndexColor(config.lineColors, rawLineData, yIndex)) {
          drawLine(lineView, config, `y${yIndex}`, 'type');
        }
      });
    } else {
      // 单Y轴时同时关闭一个View的Y轴，避免重叠字体变粗
      lineView.axis('y', false);

      drawBar(barView, config, 'y', 'type');
      drawLine(lineView, config, 'y', 'type');
    }

    // 绘制辅助线，辅助背景区域
    viewGuide(config, lineView, rawLineData, barView, rawBarData);

    legendFilter.call(this, barView, config, 'rawBarData');
    legendFilter.call(this, lineView, config, 'rawLineData');

    rectLegend.call(this, chart, config, {
      items: getLegendItems(rawLineData, rawBarData, lineView.geometries[0], barView.geometries[0], config),
    }, false);

    // chart.on('afterrender', () => {
    //   // chart.getLegendAttributes()
    //   // console.log('getLegendAttributes', barView.geometries[0].getAttribute('shape'));
    //   // console.log('getLegendAttributes', lineView.geometries[0].getAttribute('shape'));
    //   lineView.geometries.forEach((geom) => {
    //     const shapeAttr = geom.getAttribute('shape');
    //
    //     const shape = getMappingValue(shapeAttr, '机房3', 'point');
    //     let marker = geom.getShapeMarker(shape, {
    //       color: 'red',
    //       isInPolar: false,
    //     });
    //
    //     console.log(marker);
    //   })
    //   // console.log(getLegendItems(rawLineData, rawBarData, lineView.geometries[0], barView.geometries[0], config));
    //
    //   // console.log(chart.getController('legend'));
    // })
  }

  changeData(chart: Chart, config: WlinebarConfig, data: ChartData) {
    const rawLineData: DataAdapterData[] = [];
    this.rawLineData = rawLineData;
    const rawBarData: DataAdapterData[] = [];
    this.rawBarData = rawBarData;
    (data || []).forEach((d: DataAdapterData) => {
      if (d.type === 'line') {
        rawLineData.push(d);
      } else if (d.type === 'bar') {
        rawBarData.push(d);
      }
    });

    const lineData = highchartsDataToG2Data(rawLineData, config as DataAdapterConfig, {
      // type: 'lineType',
    });
    const barData = highchartsDataToG2Data(rawBarData, config as DataAdapterConfig, {
      // type: 'barType',
    });

    this.barView && this.barView.data(barData);
    this.lineView && this.lineView.data(lineData);

    if (this.barView && this.lineView) {
      const chartOptions = chart.getOptions();
      const legend = chart.getController('legend');
      const legendCos = legend.getComponents();
      // 图例项可见，更新图例项
      if (legend.visible && legendCos.length > 0 && typeof chartOptions.legends === 'object') {
        chartOptions.legends.items = getLegendItems(
          rawLineData,
          rawBarData,
          this.lineView.geometries[0],
          this.barView.geometries[0],
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

const Wlinebar: typeof Linebar = errorWrap(Linebar);

export default Wlinebar;

interface BarConfig {
  barColors?: string[];
  stack?: boolean;
  stackReverse?: boolean;
  marginRatio?: number;
  dodgeStack?: boolean;
  lineLabel?: LabelConfig | boolean,
  barGeomStyle?: GeomStyleConfig;
}
function drawBar(chart: View, config: WlinebarConfig, yAxisKey = 'y', legendKey = 'type') {
  const { stack, stackReverse, marginRatio, dodgeStack } = config;

  let intervalGeom = null;
  if (dodgeStack) {
    intervalGeom = chart.interval()
      .position(['x', yAxisKey])
      .color(legendKey, config.barColors)
      .adjust([
        {
          type: 'dodge',
          marginRatio: marginRatio || 0, // 数值范围为 0 至 1，用于调整分组中各个柱子的间距
          dodgeBy: 'dodge',
        },
        {
          type: 'stack',
          reverseOrder: !stackReverse, // 层叠顺序倒序
        },
      ]);
  } else if (stack) {
    intervalGeom = chart.interval()
      .position(['x', yAxisKey])
      .color(legendKey, config.barColors)
      .adjust([{
        type: 'stack',
        reverseOrder: !stackReverse, // 层叠顺序倒序
      }]);
  } else {
    intervalGeom = chart.interval()
      .position(['x', yAxisKey])
      .color(legendKey, config.barColors)
      .adjust([{
        type: 'dodge',
        marginRatio: marginRatio || 0, // 数值范围为 0 至 1，用于调整分组中各个柱子的间距
      }]);
  }

  geomStyle(intervalGeom, config.barGeomStyle, {}, `x*${yAxisKey}*${legendKey}*extra`);

  label(intervalGeom, config, yAxisKey, null, 'barLabel');

  return intervalGeom;
}

interface LineConfig {
  // colors?: string[];
  // areaColors?: string[];
  lineColors?: string[];
  area?: boolean,
  stack?: boolean, // 仅Area有效
  spline?: boolean,
  step?: string | boolean,
  symbol?: {
    size?: GeomSizeConfig;
    geomStyle?: GeomStyleConfig;
  } | boolean,
  lineLabel?: LabelConfig | boolean,
  lineWidth?: number;
  lineGeomStyle?: GeomStyleConfig;
}
function drawLine(chart: View, config: WlinebarConfig, yAxisKey = 'y', legendKey = 'type') {
  let lineGeom = null;
  const { lineWidth } = config;
  // const geomStyle = config.lineGeomStyle || {};
  // if (lineWidth !== undefined) {
  //   geomStyle.lineWidth = lineWidth;
  // }

  // 区域、堆叠、平滑曲线
  const lineShape = config.spline ? 'smooth' : 'line';
  const areaShape = config.spline ? 'smooth' : 'area';

  const stack = config.stack || config.dodgeStack;

  if (config.area && stack) {
    chart.area()
      .position(['x', yAxisKey])
      .color(legendKey, config.lineColors)
      .shape(areaShape)
      .adjust('stack');
    lineGeom = chart.line()
      .position(['x', yAxisKey])
      .color(legendKey, config.lineColors)
      .shape(lineShape)
      .adjust('stack');
      // .style({
      //   lineJoin: 'round',
      //   ...geomStyle,
      // });
  } else if (config.area && !stack) {
    chart.area()
      .position(['x', yAxisKey])
      .color(legendKey, config.lineColors)
      .shape(areaShape)
    lineGeom = chart.line()
      .position(['x', yAxisKey])
      .color(legendKey, config.lineColors)
      .shape(lineShape);
      // .style({
      //   lineJoin: 'round',
      //   ...geomStyle,
      // });
  } else {
    lineGeom = chart.line()
      .position(['x', yAxisKey])
      .color(legendKey, config.lineColors)
      .shape(lineShape);
      // .style({
      //   lineJoin: 'round',
      //   ...geomStyle,
      // });
  }

  geomStyle(lineGeom, config.lineGeomStyle, {
    lineWidth,
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

function viewGuide(config: WlinebarConfig, lineView: View, rawLineData: DataAdapterData[], barView: View, rawBarData: DataAdapterData[]) {
  const { guide } = config;
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

type SimpleGuideConfig = { target?: string; } & ( GuideLineConfig | GuideAreaConfig | GuideFilterConfig );
function getGuideView(config: WlinebarConfig, guide: SimpleGuideConfig, lineView: View, rawLineData: DataAdapterData[], barView: View, rawBarData: DataAdapterData[]) {
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
