'use strict';

import { Chart, Types, BaseChartConfig, Colors, G2Dependents } from '../common/types';
import Base from '../common/Base';
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
import label, { LabelConfig } from '../common/label';
import geomSize, { GeomSizeConfig } from '../common/geomSize';
import geomStyle, { GeomStyleConfig } from '../common/geomStyle';
import rectZoom, { ZoomConfig } from '../common/rectZoom';
import rectScrollbar, { ScrollbarConfig } from '../common/rectScrollbar';
import rectSlider, { SliderConfig } from '../common/rectSlider';
import { activeRegionWithTheme } from '../common/interaction';
import { getText } from '../ChartProvider';
import defaultLayout from '@antv/g2/esm/chart/layout';
import './index.scss';

interface FacetConfig {
  type?: 'mirror' | 'rect' | 'list' | 'matrix' | 'circle' | 'tree';
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

interface ColumnConfig {
  reflect?: boolean;
}

// TODO 目前G2默认缩略轴为线图，分类型数据不推荐使用，这里暂时开放为一个趋势关系，后期研究缩略轴怎么显示
interface WbarConfig extends BaseChartConfig, ZoomConfig, ScrollbarConfig, SliderConfig {
  colors?: Colors;
  xAxis?: (Types.ScaleOption & XAxisConfig) | false;
  yAxis?: (Types.ScaleOption & YAxisConfig) | false;
  legend?: LegendConfig | boolean;
  tooltip?: TooltipConfig | boolean;
  guide?: GuideConfig;
  label?: LabelConfig | boolean;
  column?: ColumnConfig | boolean;
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
        autoHide: false, // 分类轴默认不开启抽样显示
        autoEllipsis: true,
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
      x: propertyAssign(
        propertyMap.axis,
        {
          // type: 'cat',
        },
        config.xAxis,
      ),
      y: propertyAssign(
        propertyMap.axis,
        {
          nice: true,
          type: 'linear',
          tickCount: 5,
        },
        config.yAxis,
      ),
      type: {
        type: 'cat',
        sync: true,
      },
      facet: {
        sync: true,
      },
      percent: propertyAssign(
        propertyMap.axis,
        {
          nice: true,
          type: 'linear',
          tickCount: 5,
        },
        config.yAxis,
      ),
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
    rectLegend(
      this,
      chart,
      config,
      {
        items: config?.legend?.items,
      },
      false,
      'type',
    );

    legendFilter(this, chart);

    // tooltip
    rectTooltip(this, chart, config, {}, null, {
      showCrosshairs: false,
      showMarkers: false,
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
    if (!config.column || typeof config.column === 'object') {
      const columnConfig = typeof config.column === 'object' ? config.column : {};
      chartCoord.transpose();
      // 横向镜像
      if (columnConfig.reflect) {
        chartCoord.reflect('x');
      }
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
      const facetTitleConfig = merge(
        {
          offsetX: pxToNumber(themes['widgets-font-size-1']),
          // 底层使用 view.annotation().text 绘制，可以使用 rotate 进行翻转
          rotate: config.column ? Math.PI / 2 : undefined,
          style: {
            fontSize: pxToNumber(themes['widgets-font-size-1']),
            textAlign: 'center',
            fill: themes['widgets-axis-label'],
          },
        },
        facetConfig.title || {},
      );
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
                      index,
                    );
                  },
                },
              };
            }
          }

          rectYAxis(self, view, config, 'y', yAxisCustomConfig);

          // Tooltip 背景区域
          activeRegionWithTheme(view);

          drawBar(view, config, config.colors, facet);
        },
      });
    } else {
      // Tooltip 背景区域
      activeRegionWithTheme(chart);

      drawBar(chart, config, config.colors);
    }

    rectZoom(chart, config, getText('reset', this.language || this.context.language, this.context.locale));

    // 缩略轴
    rectSlider(chart, config);

    // 滚动条
    rectScrollbar(chart, config);

    // 判断是否要加padding
    // 当开启label、label在柱子上方、legend不在上方，且存在某根柱子数值与y轴最大值接近时需要加padding
    // 极坐标柱状图不考虑，分面自己加padding，此处不处理
    chart.on('beforepaint', () => {
      // y轴刻度最大值
      const axisMax = chart?.geometries?.[0]?.scales?.y?.max;
      // y轴高度
      const height = chart?.coordinateBBox?.height;

      // 是否显示label，且label在top
      const showLabel =
        config?.label === true ||
        (typeof config?.label === 'object' &&
          config?.label?.visible !== false &&
          (config?.label?.position === undefined || config?.label?.position === 'top'));
      // 是否隐藏legend，或legend不在top
      const hideLegend =
        config?.legend === false ||
        (typeof config?.legend === 'object' &&
          (config?.legend?.visible === false || (config?.legend?.position && config?.legend?.position !== 'top')));

      if (!chart.appendPadding && showLabel && hideLegend && !config?.polar && !config?.facet) {
        let addPadding = false;

        // 横向柱图默认加padding
        if (config?.column === false || typeof config?.column === 'object') {
          addPadding = true;
        } else if ((config?.dodgeStack || config?.stack) && config?.percentage) {
          // 百分比堆叠默认加padding
          addPadding = true;
        } else {
          const valueMap: any = {};
          (data || []).forEach((d: any) => {
            const xValue = `${d.x}-${config?.stack ? '' : d.dodge || d.type}`;
            if (!(xValue in valueMap)) {
              valueMap[xValue] = 0;
            }
            // 区间柱状图
            if (Array.isArray(d.y)) {
              valueMap[xValue] += d.y?.[1] || 0;
            } else {
              // 堆叠、分组堆叠、普通柱图
              valueMap[xValue] += d.y;
            }
          });

          const maxY = Math.max(...Object.values(valueMap));

          // 判断最高的柱子距离顶部的间距是否过小
          const dis = (1 - maxY / axisMax) * height;
          if (dis < 20) {
            addPadding = true;
          }
        }

        if (addPadding) {
          chart.appendPadding = [20, 0, 0, 0];
        } else {
          chart.appendPadding = undefined;
        }
      }
    });
  }
  changeData(chart: Chart, config: WbarConfig, data: any) {
    // 分面需要对数据进行筛选处理
    if (config.facet) {
      chart.views.forEach((subView, idx) => {
        // 目前想到每个视图获取对应的分面数据的情况通过分面的实例进行获取，后面看有没有更好的情况
        const facetInstance = chart?.facetInstance?.facets;
        const facetValue =
          !config.column || typeof config.column === 'object'
            ? facetInstance?.[idx]?.columnValue
            : facetInstance?.[idx]?.rowValue;
        const facetData = data?.filter((el: any) => el.facet === facetValue);
        subView.changeData(facetData);
      });
    } else if (config.percentage && this.barDataView) {
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

function drawBar(chart: Chart, config: WbarConfig, colors: Colors, facet?: any) {
  const {
    stack,
    stackReverse,
    marginRatio,
    dodge,
    dodgeStack,
    percentage,
    size,
    minSize,
    maxSize = 24,
    columnWidthRatio,
    dodgePadding,
  } = config;
  const geomConfig = {
    minColumnWidth: minSize || null,
    maxColumnWidth: maxSize || null,
    columnWidthRatio: columnWidthRatio || null,
    dodgePadding: dodgePadding || null,
  };
  let geom = chart.interval(geomConfig).position(['x', 'y']).color('type', colors);
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

  if (typeof config.animate === 'object') {
    geom.animate(config.animate);
  }

  geomSize(geom, size, null, 'y', 'x*y*type*facet*extra');

  geomStyle(geom, config.geomStyle, {}, 'x*y*type*facet*extra');

  label({
    geom: geom,
    config: config,
    extraCallbackParams: facet ? [facet] : undefined,
  });
}

function computerData(config: WbarConfig, data: any) {
  const { dodgeStack } = config;
  const dv = new DataView().source(data);
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
