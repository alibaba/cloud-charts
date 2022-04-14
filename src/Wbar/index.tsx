'use strict';

import { Chart, Types, BaseChartConfig, Colors, G2Dependents } from '../common/types';
import Base from "../common/Base";
import { View as DataView } from '@antv/data-set/lib/view';
import '@antv/data-set/lib/transform/percent';
import errorWrap from '../common/errorWrap';
import themes from '../themes/index';
import { propertyAssign, propertyMap, pxToNumber, merge } from '../common/common';
import legendFilter from '../common/legendFilter';
import rectXAxis, { XAxisConfig } from '../common/rectXAxis';
import rectYAxis, { YAxisConfig } from '../common/rectYAxis';
import rectTooltip, { TooltipConfig } from '../common/rectTooltip';
import rectLegend, { LegendConfig } from '../common/rectLegend';
import guide, { GuideConfig } from '../common/guide';
import label, { LabelConfig } from "../common/label";
import geomSize, { GeomSizeConfig } from '../common/geomSize';
import geomStyle, { GeomStyleConfig } from '../common/geomStyle';
import rectZoom, { ZoomConfig } from "../common/rectZoom";
import rectScrollbar, { ScrollbarConfig } from '../common/rectScrollbar';
import { activeRegionWithTheme } from '../common/interaction';
import './index.scss';

interface FacetConfig {
  type?: "mirror" | "rect" | "list" | "matrix" | "circle" | "tree";
  transpose?: boolean;
  /**
   * @title facet view padding。
   */
  padding?: number[];
  /**
   * @title 分面 view 之间的间隔， 百分比或像素值
   */
  spacing?: [number | string, number | string];
  /**
   * @title 是否显示标题。
   */
  showTitle?: boolean;
  title?: {
    /** x 方向偏移 */
    offsetX?: number;
    /** y 方向偏移 */
    offsetY?: number;
    /** 格式化 */
    formatter?: (val: any) => any;
  } & Omit<G2Dependents.EnhancedTextCfg, 'content'>;
}

interface WbarConfig extends BaseChartConfig, ZoomConfig, ScrollbarConfig {
  colors?: Colors;
  xAxis?: Types.ScaleOption & XAxisConfig | false;
  yAxis?: Types.ScaleOption & YAxisConfig | false;
  legend?: LegendConfig | boolean;
  tooltip?: TooltipConfig | boolean;
  guide?: GuideConfig;
  label?: LabelConfig | boolean;
  column?: boolean;
  dodge?: boolean;
  dodgeStack?: boolean;
  stack?: boolean;
  stackReverse?: boolean;
  marginRatio?: number;
  grid?: boolean;
  facet?: boolean | FacetConfig;
  size?: GeomSizeConfig;
  polar?: boolean;
  innerRadius?: number;
  geomStyle?: GeomStyleConfig;
  minSize?: number;
  maxSize?: number;
  /** 默认宽度占比，interval类型和schema类型通用 */
  columnWidthRatio?: number;
  /** 组内间距 */
  dodgePadding?: number;
  /** 百分比堆叠柱状图 */
  percentage?: boolean;
}

export class Bar extends Base<WbarConfig> {
  chartName = 'G2Bar';
  private barDataView: DataView;
  getDefaultConfig(): WbarConfig {
    return {
      colors: themes.category_12,
      // padding: ['auto', 'auto', 'auto', 'auto'],
      xAxis: {
        type: 'cat',
        labelFormatter: null, // 可以强制覆盖，手动设置label
        categories: null,
        autoRotate: false,
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
      column: true,
      dodge: true,
      dodgeStack: false,
      stack: false,
      stackReverse: true,
      percentage: false,
      marginRatio: 0,
      grid: false,
      zoom: false,
      facet: false,
      size: null,
      label: false,
      polar: false,
      innerRadius: 0,
    };
  }
  init(chart: Chart, config: WbarConfig, data: any) {
    // 设置数据度量
    const defs: Record<string, Types.ScaleOption> = {
      x: propertyAssign(propertyMap.axis, {
        // type: 'cat',
      }, config.xAxis),
      y: propertyAssign(propertyMap.axis, {
        nice: true,
        type: 'linear',
        tickCount: 5,
      }, config.yAxis),
      type: {
        type: 'cat',
        sync: true,
      },
      facet: {
        sync: true,
      },
      percent: propertyAssign(propertyMap.axis, {
        nice: true,
        type: 'linear',
        tickCount: 5,
      }, config.yAxis),
    };

    chart.scale(defs);

    if (config.percentage) {
      const dataView = computerData(config, data);
      this.barDataView = dataView;
      chart.data(dataView.rows);
    } else {
      chart.data(data);
    }

    // 设置单个Y轴
    if (!config.facet) {
      if (config.percentage) {
        rectYAxis(this, chart, config, 'percent');
      } else {
        rectYAxis(this, chart, config);
      }
    }

    // 设置X轴
    rectXAxis(this, chart, config);

    // 设置图例
    rectLegend(this, chart, config, null, false, 'type');

    legendFilter(this, chart);

    // tooltip
    rectTooltip(this, chart, config, {}, null, {
      showCrosshairs: false,
      showMarkers: false
    });

    // 绘制辅助线，辅助背景区域
    guide(chart, config);

    // 设置坐标系：极坐标/直角坐标
    const chartCoord = config.polar
      ? chart.coordinate('polar', {
          innerRadius: config.innerRadius || 0,
        })
      : chart.coordinate();

    // 横向柱状图
    if (!config.column) {
      chartCoord.transpose();
    }

    // // 玉玦图，需要手动添加 数据标记
    // if (config.polar && !config.column && config.dataType !== 'g2') {
    //   this.rawData[0].data.forEach((d: any, i: number) => {
    //     let x = d.x;
    //     if (Array.isArray(d)) {
    //       x = d[0];
    //     } else if (
    //       config.xAxis &&
    //       config.xAxis.categories &&
    //       config.xAxis.categories[i]
    //     ) {
    //       x = config.xAxis.categories[i];
    //       // const y = isNaN(d) ? d[0] : d;
    //     }
    //
    //     chart.annotation().text({
    //       position: [x, 0],
    //       // content: `${x}`,
    //       style: {
    //         fill: themes['widgets-axis-label'],
    //         textAlign: 'start',
    //       },
    //     });
    //   });
    // }

    if (config.facet) {
      const facetConfig = typeof config.facet === 'object' ? config.facet : {};
      const facetTitleConfig = merge({
        offsetX: pxToNumber(themes['widgets-font-size-1']),
        // 底层使用 view.annotation().text 绘制，可以使用 rotate 进行翻转
        rotate: config.column ? Math.PI / 2 : undefined,
        style: {
          fontSize: pxToNumber(themes['widgets-font-size-1']),
          textAlign: 'center',
          fill: themes['widgets-axis-label'],
        },
      }, facetConfig.title || {});
      const self = this;
      chart.facet(facetConfig.type || 'mirror', {
        fields: ['facet'],
        transpose: facetConfig.transpose || !config.column,
        padding: facetConfig.padding,
        spacing: facetConfig.spacing || (config.column ? [0, 18] : [32, 0]),
        showTitle: typeof facetConfig.showTitle === 'boolean' ? facetConfig.showTitle : true,
        title: facetTitleConfig,
        eachView: function (view: any, facet: any) {
          let yAxisCustomConfig: Types.AxisCfg = null;

          // 为 labelFormatter 的第二个参数添加分面信息
          if (config.yAxis && config.yAxis.visible !== false) {
            const { labelFormatter } = config.yAxis || {};
            if (labelFormatter) {
              yAxisCustomConfig = {
                label: {
                  formatter: (text, item, index) => {
                    return labelFormatter(
                      text,
                      {
                        facet: facet.colValue || facet.rowValue,
                        ...item,
                      },
                      index
                    );
                  },
                },
              };
            }
          }

          rectYAxis(self, view, config, 'y', yAxisCustomConfig);

          // Tooltip 背景区域
          activeRegionWithTheme(view);

          drawBar(view, config, config.colors);
        },
      });
    } else {
      // Tooltip 背景区域
      activeRegionWithTheme(chart);

      drawBar(chart, config, config.colors);
    }

    rectZoom(chart, config, this.language);

    rectScrollbar(chart, config);
  }
  changeData(chart: Chart, config: WbarConfig, data: any) {
    if (config.percentage && this.barDataView) {
      this.barDataView.source(data);
      chart.changeData(this.barDataView.rows);
    } else {
      chart.changeData(data);
    }
  }
}

const Wbar: typeof Bar = errorWrap(Bar);

export default Wbar;

// export default errorWrap(Wbar);

function drawBar(chart: Chart, config: WbarConfig, colors: Colors, field = 'type') {
  const { stack, stackReverse, marginRatio, dodge, dodgeStack, percentage, size, minSize, maxSize, columnWidthRatio, dodgePadding } = config;
  const geomConfig = {
    minColumnWidth: minSize || null,
    maxColumnWidth: maxSize || null,
    columnWidthRatio: columnWidthRatio || null,
    dodgePadding: dodgePadding || null,
  };
  let geom = chart.interval(geomConfig).position(['x', 'y']).color(field, colors);
  if (percentage) {
    geom = geom.position(['x', 'percent']);
  }
  if (dodgeStack) {
    geom = geom.adjust([
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
    // 堆叠
    geom = geom.adjust([
      {
        type: 'stack',
        reverseOrder: !stackReverse, // 层叠顺序倒序
      },
    ]);
  } else if (dodge) {
    // 分组
    geom = geom.adjust([
      {
        type: 'dodge',
        marginRatio: marginRatio || 0, // 数值范围为 0 至 1，用于调整分组中各个柱子的间距
      },
    ]);
  }

  geomSize(geom, size, null, 'y', 'x*y*type*facet*extra');

  geomStyle(geom, config.geomStyle, {}, 'x*y*type*facet*extra');

  label(geom, config);
}

function computerData(config: WbarConfig,data: any) {
  const { dodgeStack } = config;
  const dv = new DataView()
    .source(data);
  if (dodgeStack) {
    dv.transform({
      type: 'percent',
      field: 'y',
      dimension: 'type',
      groupBy: ['x', 'dodge'],
      as: 'percent',
    });
  } else {
    dv.transform({
      type: 'percent',
      field: 'y',
      dimension: 'type',
      groupBy: ['x'],
      as: 'percent',
    });
  }
      
  return dv;
}
