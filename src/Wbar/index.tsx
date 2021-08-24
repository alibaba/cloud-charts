'use strict';

import { Chart, Types, BaseChartConfig, Colors } from '../common/types';
import Base from "../common/Base";
import { View as DataView } from '@antv/data-set/lib/view';
import '@antv/data-set/lib/transform/percent';
import errorWrap from '../common/errorWrap';
import themes from '../themes/index';
import { propertyAssign, propertyMap } from '../common/common';
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
import './index.scss';

interface WbarConfig extends BaseChartConfig, ZoomConfig, ScrollbarConfig {
  colors?: Colors;
  xAxis?: Types.ScaleOption & XAxisConfig | false;
  yAxis?: Types.ScaleOption & YAxisConfig | false;
  legend?: LegendConfig | boolean;
  tooltip?: TooltipConfig | boolean;
  guide?: GuideConfig;
  label?: LabelConfig | boolean;
  column?: boolean;
  dodgeStack?: boolean;
  stack?: boolean;
  stackReverse?: boolean;
  marginRatio?: number;
  grid?: boolean;
  facet?: boolean;
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
  percentage: boolean;
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
      const facetConfig: { type: "mirror" | "rect" | "list" | "matrix" | "circle" | "tree", transpose: boolean, padding: number[] } =
        typeof config.facet === 'object'
          ? config.facet
          : {
              type: 'mirror',
              transpose: false,
              padding: [20, 0, 20, 0],
            };
      const self = this;
      chart.facet(facetConfig.type, {
        fields: ['facet'],
        transpose: facetConfig.transpose,
        padding: facetConfig.padding,
        rowTitle: {
          offsetX: 15,
          style: {
            fontSize: themes['widgets-font-size-1'],
            textAlign: 'center',
            rotate: 90,
            fill: themes['widgets-axis-label'],
          },
        },
        eachView: function (view: any, facet: any) {
          let yAxisCustomConfig = null;

          // 为 labelFormatter 的第二个参数添加分面信息
          if (config.yAxis && config.yAxis.visible !== false) {
            const { labelFormatter } = config.yAxis || {};
            if (labelFormatter) {
              yAxisCustomConfig = {
                label: {
                  formatter: (...args: any[]) => {
                    args[1] = Object.assign(
                        {
                          facet: facet.colValue || facet.rowValue,
                        },
                        args[1]
                    );
                    return labelFormatter();
                  },
                },
              };
            }
          }

          rectYAxis(self, view, config, 'y', yAxisCustomConfig);

          // Tooltip 背景区域
          view.interaction('active-region');

          drawBar(view, config, config.colors);
        },
      });
    } else {
      // Tooltip 背景区域
      chart.interaction('active-region');

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
  const { stack, stackReverse, marginRatio, dodgeStack, percentage, size, minSize, maxSize, columnWidthRatio, dodgePadding } = config;
  const geomConfig = {
    minColumnWidth: minSize || null,
    maxColumnWidth: maxSize || null,
    columnWidthRatio: columnWidthRatio || null,
    dodgePadding: dodgePadding || null,
  };
  let geom = chart.interval(geomConfig).position(['x', 'y']);
  if (percentage) {
    geom = geom.position(['x', 'percent']);
  }
  if (dodgeStack) {
    geom = geom.color(field, colors).adjust([
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
    geom = geom.color(field, colors).adjust([
      {
        type: 'stack',
        reverseOrder: !stackReverse, // 层叠顺序倒序
      },
    ]);
  } else {
    // 分组
    geom = geom.color(field, colors).adjust([
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
      as: 'percent'
    });
  } else {
    dv.transform({
      type: 'percent',
      field: 'y',
      dimension: 'type',
      groupBy: ['x'],
      as: 'percent'
    });
  }

  return dv;
}
