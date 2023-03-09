'use strict';

import { Chart, Types, BaseChartConfig } from '../common/types';
import Base from '../common/Base';
import errorWrap from '../common/errorWrap';
import themes from '../themes';
import { getDataIndexColor, propertyAssign, propertyMap } from '../common/common';
import guide, { GuideConfig } from '../common/guide';
import rectXAxis, { XAxisConfig } from '../common/rectXAxis';
import rectYAxis, { YAxisConfig } from '../common/rectYAxis';
import autoTimeMask from '../common/autoTimeMask';
import rectTooltip, { TooltipConfig } from '../common/rectTooltip';
import rectLegend, { LegendConfig } from '../common/rectLegend';
import legendFilter from '../common/legendFilter';
import rectZoom, { ZoomConfig } from '../common/rectZoom';
import rectSlider, { SliderConfig } from '../common/rectSlider';
import drawLine, { DrawLineConfig } from '../common/drawLine';
import { warn } from '../common/log';
import './index.scss';

export interface WlineConfig extends BaseChartConfig, DrawLineConfig, ZoomConfig, SliderConfig {
  /** X轴配置项 */
  xAxis?: (Types.ScaleOption & XAxisConfig) | false;
  /** Y轴配置项 */
  yAxis?: (Types.ScaleOption & YAxisConfig) | false;
  /** 图例配置项 */
  legend?: LegendConfig | boolean;
  /** 提示信息配置项 */
  tooltip?: TooltipConfig | boolean;
  /** 辅助标记配置项 */
  guide?: GuideConfig;
  /** 显示网格线 */
  grid?: boolean;
}

export class Line extends Base<WlineConfig> {
  chartName = 'G2Line';

  getDefaultConfig(): WlineConfig {
    return {
      colors: themes.category_12,
      areaColors: [],
      xAxis: {
        type: 'time', // 默认为线性
        mask: 'auto', // 上述type为time时，此字段生效
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
      zoom: false,
      label: false,
      step: null,
      // TODO
      // mini: false,
      // dataConfig: {
      //   nameKey: 'name',
      //   valueKey: 'value',
      //   // valueKey: ['value1', 'value2'],
      //   typeKey: 'type'
      // }
    };
  }
  init(chart: Chart, config: WlineConfig, data: any) {
    const defs: Record<string, Types.ScaleOption> = {
      x: propertyAssign(
        propertyMap.axis,
        {
          type: 'time',
          // 折线图X轴的范围默认覆盖全部区域，保证没有空余
          range: [0, 1],
        },
        config.xAxis,
      ),
      type: {
        type: 'cat',
      },
    };

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
          nice: true,
        },
        config.yAxis,
      );
    }

    autoTimeMask(defs, this.rawData);

    // rectAutoTickCount(chart, config, defs, false);

    chart.scale(defs);

    // 只有属于极端数据切不强制默认才会合并配置项
    const { extremeConfig, isExtreme } = simpleCheckExtreme(data, this.dataSize);
    let newConfig = config;
    if (isExtreme && this.props.force !== true) {
      newConfig = Object.assign(config, extremeConfig);
    }

    chart.data(data);

    // 设置X轴
    rectXAxis(this, chart, config);

    if (Array.isArray(config.yAxis)) {
      config.yAxis.forEach((axis, yIndex) => {
        const yAxisConfig: Types.AxisCfg = {
          line: {
            style: {
              stroke: getDataIndexColor(config.colors, this.rawData, yIndex) || themes['widgets-axis-line'],
            },
          },
        };
        if (yIndex !== 0) {
          yAxisConfig.grid = null;
        }

        rectYAxis(this, chart, { ...config, yAxis: axis }, `y${yIndex}`, yAxisConfig);
      });
    } else {
      // 设置单个Y轴
      rectYAxis(this, chart, config);
    }

    // 设置图例
    rectLegend(this, chart, config, null, false, 'type');

    legendFilter(this, chart);

    // tooltip的标记点配置
    let markerOptions = {
      marker: {
        symbol: 'circle',
      },
    };

    if (config.symbol && typeof config.symbol === 'object') {
      // 样式合并
      markerOptions.marker = Object.assign(markerOptions.marker, config.symbol.geomStyle);
      // 图形
      if (config.symbol.shape) {
        markerOptions.marker.symbol = config.symbol.shape;
      }
      // 大小
      if (typeof config.symbol.size === 'number') {
        markerOptions.marker = Object.assign(markerOptions.marker, {
          r: config.symbol.size + 4,
          width: config.symbol.size + 4,
          height: config.symbol.size + 4,
        });
      }
    }

    // tooltip
    rectTooltip(this, chart, config, markerOptions);

    // 绘制辅助线，辅助背景区域
    guide(chart, config);

    if (Array.isArray(config.yAxis)) {
      config.yAxis.forEach((asix, yIndex) => {
        drawLine(chart, newConfig, `y${yIndex}`);
      });
    } else {
      drawLine(chart, newConfig);
    }

    // 拖拽缩放
    rectZoom(chart, config, this.language);

    // 缩略轴
    rectSlider(chart, config);
  }
  public changeData(chart: Chart, config: WlineConfig, data: any): void {
    const { extremeConfig, isExtreme } = simpleCheckExtreme(data, this.dataSize);
    let newConfig = config;
    const { area, label, symbol } = newConfig;

    if (isExtreme && this.props.force !== true) {
      newConfig = Object.assign(config, extremeConfig);
    }
    // 需要比较的配置项对象
    const compareConfig = {
      area,
      label,
      symbol,
    };

    // 如果极端场景配置项改变则重新渲染，否则只更新数据
    if (this.checkConfigChange(compareConfig, extremeConfig)) {
      this.rerender();
    } else {
      chart.changeData(data);
    }
  }
}

/** Wline 折线图 */
const Wline: typeof Line = errorWrap(Line);

export default Wline;

function simpleCheckExtreme<T>(data: any, dataSize: number) {
  // 计算最大最小值，优化只有一个点的时候的Y轴刻度
  let min = data?.[0]?.y;
  let max = data?.[0]?.y;
  const typeSet: any = [];
  data?.forEach((el: any) => {
    if (el?.visible || el?.type?.includes('undefined') || el?.visible === undefined) {
      typeSet.push(el?.type);
      min = el.y < min ? el.y : min;
      max = el.y > max ? el.y : max;
    }
  });

  const extremeConfig: any = {
    area: true,
    symbol: true,
    label: true,
  };

  if (new Set(typeSet)?.size < 2 && dataSize < 6 && dataSize > 0) {
    warn('Line', '当前线图数据较少，为优化展示，已自动开启面积、标记、文本。');
    return {
      extremeConfig,
      isExtreme: true,
    };
  }

  // 不是极端场景则用默认配置项
  return {
    extremeConfig: {},
    isExtreme: false,
  };
}
