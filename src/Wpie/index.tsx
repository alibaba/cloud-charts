'use strict';

import { Chart, Geometry, Types, BaseChartConfig, ChartData, G2Dependents, Colors } from '../common/types';
import Base from "../common/Base";
import themes from '../themes/index';
import { /*pxToNumber,*/ numberDecimal, /*isInvalidNumber*/ } from '../common/common';
import './index.scss';
import rectTooltip, { TooltipConfig } from '../common/rectTooltip';
import rectLegend, { LegendConfig } from '../common/rectLegend';
import label, { LabelConfig } from '../common/label';
import geomStyle, { GeomStyleConfig } from '../common/geomStyle';
import polarLegendLayout from '../common/polarLegendLayout';
import errorWrap from '../common/errorWrap';
import updateChildrenPosition from '../common/updateChildrenPosition';

// function transformCoord(coord, transform = {}) {
//   const { type, param } = transform;
//   if (coord[type] && Array.isArray(param)) {
//     coord[type](...param);
//   }
// }
//
function selectGeom(geom: Geometry, selectKey?: string) {
  // if (!geom || !selectKey || !Array.isArray(this.data)) {
  if (!geom) {
    return;
  }

  geom.elements.forEach((element) => {
    // 清除选中效果
    if (element.hasState('selected')) {
      element.setState('selected', false);
    }

    // 如果selectKey为假值，则只清空选中效果。
    if (!selectKey) {
      return;
    }

    const d = element.getData();

    if (d.x === selectKey) {
      element.setState('selected', true);
    }
  });
}
//
// function paddingNumber(value) {
//   return isInvalidNumber(value) ? 0 : Number(value);
// }
//
// export function getDrawPadding(drawPadding, labelConfig, defaultDrawPadding) {
//   if (Array.isArray(drawPadding)) {
//     return drawPadding;
//   } else if (!isInvalidNumber(drawPadding)) {
//     return [drawPadding, drawPadding, drawPadding, drawPadding];
//   } else if (labelConfig && labelConfig.visible !== false) {
//     // 饼图使用 label 时，调整 drawPadding
//     return defaultDrawPadding.map(p => Math.max(p, 48));
//   } else {
//     return defaultDrawPadding;
//   }
// }

interface WpieConfig extends BaseChartConfig {
  colors?: Colors;
  legend?: LegendConfig | boolean;
  tooltip?: TooltipConfig | boolean;
  autoSort?: boolean;
  cycle?: boolean;
  select?: boolean;
  innerRadius?: number;
  outerRadius?: number;
  label?: LabelConfig | boolean,
  selectData?: string;
  geomStyle?: GeomStyleConfig;
}

export class Pie extends Base<WpieConfig> {
  chartName = 'G2Pie';

  getDefaultConfig(): WpieConfig {
    return {
      colors: themes.category_12,
      // padding: [20, 20, 20, 20],
      legend: {
        position: 'right',
        align: '',
        showData: true,
        nameFormatter: null, // 可以强制覆盖，手动设置label
        valueFormatter: null,
      },
      tooltip: {
        nameFormatter: null,
        valueFormatter: null,
      },
      // coord: null,
      autoSort: true,
      cycle: false,
      select: false,
      innerRadius: 0.8, // 内环半径大小，仅cycle为true时可用
      outerRadius: 0.8, // 饼图半径大小，初始化时可用
      // drawPadding: [10, 10, 10, 10],
      label: false,
    };
  }

  totalData = 0;

  changeData(chart: Chart, config: WpieConfig, data: ChartData) {
    // 更新数据总和值，保证百分比的正常
    let totalData = 0;
    data.forEach((d: { y: number; }) => {
      totalData += d.y;
    });
    this.totalData = totalData;

    // 不要忘记排序的状态
    if (config.autoSort) {
      data.sort((a: Types.LooseObject, b: Types.LooseObject) => b.y - a.y);
    }
    // 更新挂载的转换数据
    // this.data = data;

    chart.changeData(data);
  }

  protected geom: Geometry = null;

  isChangeEqual(objValue: any, othValue: any, key: string) {
    if (key === 'selectData' && objValue !== othValue) {
      selectGeom(this.geom, objValue);
      return true;
    }
    return undefined;
  }

  init(chart: Chart, config: WpieConfig, data: any[]) {
    const defs: Record<string, Types.ScaleOption> = {
      type: {
        type: 'cat',
      },
    };

    if (config.autoSort) {
      data.sort((a, b) => b.y - a.y);
    }
    // 挂载转换后的数据
    // this.data = data;

    chart.scale(defs);
    chart.data(data);

    // 重要：绘制饼图时，必须声明 theta 坐标系
    const thetaConfig: Types.CoordinateCfg = {
      // radius: 1, // 设置饼图的为100% 大小，具体大小改变在 beforeInit 中diameter的值，目前为0.8
      radius: Math.max(Math.min(config.outerRadius, 1), 0.01),
    };
    if (config.cycle) {
      thetaConfig.innerRadius = Math.max(Math.min(config.innerRadius, 1), 0);
    }
    // coordinate translate 操作会导致饼图变形，暂时换一种方式实现
    /*const coord = */chart.coordinate('theta', thetaConfig);

    // if (config.coord) {
    //   const { transform } = config.coord || {};
    //
    //   if (Array.isArray(transform)) {
    //     transform.forEach((t) => {
    //       transformCoord(coord, t);
    //     });
    //   } else if (transform && typeof transform === 'object') {
    //     transformCoord(coord, transform);
    //   }
    // }

    // 计算得总数据
    let totalData = 0;
    data.forEach((d) => {
      totalData += d.y;
    });
    this.totalData = totalData;

    // const drawPadding = getDrawPadding(config.drawPadding, config.label, this.defaultConfig.drawPadding);

    // 设置图例
    rectLegend(this, chart, config, {
      // autoCollapse: false,
      // position: 'right',
      // itemTpl: (value, itemColor, checked, index) => {
      //   const { nameFormatter, valueFormatter, showData = true } = config.legend || {};
      //
      //   const item = (this.data && this.data[index]) || {};
      //   const raw = (this.rawData && this.rawData[0]) || {};
      //   const percent = numberDecimal(item.y / this.totalData, 4);
      //
      //   const result = nameFormatter ? nameFormatter(value, {
      //     ...raw,
      //     percent,
      //     itemColor,
      //     checked,
      //   }, index) : value;
      //
      //   if (showData) {
      //     const number = valueFormatter ? valueFormatter(item.y, {
      //       ...raw,
      //       percent,
      //       itemColor,
      //       checked,
      //     }, index) : item.y;
      //     return `${'<li class="g2-legend-list-item item-{index} {checked}" data-color="{originColor}" data-value="{originValue}">' +
      //     '<i class="g2-legend-marker" style="background-color:{color};"></i>' +
      //     '<span class="g2-legend-text">'}${result}</span>` + `<span class="g2-legend-value">${number}</span></li>`;
      //   }
      //
      //   return `${'<li class="g2-legend-list-item item-{index} {checked}" data-color="{originColor}" data-value="{originValue}">' +
      //   '<i class="g2-legend-marker" style="background-color:{color};"></i>' +
      //   '<span class="g2-legend-text">'}${result}</span></li>`;
      // },
      // 'g2-legend': {
      //   ...legendHtmlContainer,
      //   position: 'static',
      //   overflow: 'auto',
      //   // inline flex items 不能使用百分比的margin/padding，设置为固定大小
      //   marginLeft: `${Math.max(pxToNumber(themes['widgets-font-size-4']) - drawPadding[1], 0)}px`,
      // },
      // 'g2-legend-list-item': {
      //   ...legendHtmlListItem,
      //   marginRight: 0,
      // },
    }, true, null, true, (item: G2Dependents.ListItem, index: number) => {
      const { name } = item;
      const raw = (this.rawData && this.rawData[0]) || {};
      let value = 0;
      raw.data.forEach((r: any) => {
        if (Array.isArray(r) && r[0] === name) {
          value = r[1];
        } else if (typeof r === 'object' && r.x === name) {
          value = r.y
        }
      });
      const percent = numberDecimal(value / this.totalData, 4);

      return {
        ...raw,
        percent,
        ...item,
      }
    });

    // tooltip
    rectTooltip(
      this,
      chart,
      config,
      {
        showTitle: false,
        showMarkers: false,
        showCrosshairs: false,
        shared: false,
      },
      (ev: any) => {
        const raw = (this.rawData && this.rawData[0]) || {};
        const { items } = ev.data;

        items.forEach((item: any, index: number) => {
          const percent = numberDecimal(item.value / this.totalData, 4);

          if (typeof config.tooltip === 'boolean') {
            return;
          }

          if (config.tooltip.valueFormatter) {
            item.value = config.tooltip.valueFormatter(item.value, {
              ...raw,
              percent,
            }, index, items);
          }
          if (config.tooltip.nameFormatter) {
            item.name = config.tooltip.nameFormatter(item.name, {
              ...raw,
              percent,
            }, index, items);
          }
        });
      },
      {
        showTitle: false,
        showMarkers: false,
        showCrosshairs: false,
        shared: false,
      }
    );

    this.geom = chart.interval()
      .position('y')
      .color('x', config.colors)
      .adjust('stack');

    if (config.select) {
      chart.interaction('element-single-selected', {
        start: [
          {
            isEnable(context: any) {
              if (context.view.options.data.length > 1) {
                return true;
              }
              return false;
            },
            trigger: 'element:click',
            action: 'element-single-selected:toggle',
          }
        ]
      });
    }

    geomStyle(this.geom, config.geomStyle);

    const labelField = 'y';
    label(this.geom, config, labelField, null, undefined, false, {
      offset: 20,
      content: ((v, item, index) => {
        if (typeof config.label === 'boolean') {
          return v[labelField];
        }
        if (config.label.labelFormatter) {
          const percent = numberDecimal(v[labelField] / this.totalData, 4);

          return config.label.labelFormatter(v[labelField], {
            ...item,
            percent,
          } as Types.MappingDatum, index);
        }
        return v[labelField];
      }) as Types.GeometryLabelContentCallback,
    });

    polarLegendLayout(chart);

    chart.on('afterrender', () => {
      // 默认选中效果
      selectGeom(this.geom, config.selectData);

      updateChildrenPosition(chart, this.chartDom);
    });

  }
}

const Wpie: typeof Pie = errorWrap(Pie);

export default Wpie;
