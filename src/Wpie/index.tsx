'use strict';

import { Chart, Geometry, Types, BaseChartConfig, ChartData } from '../common/types';
// import { Controller } from '@antv/g2/esm/chart/controller/base';
import defaultLayout from '@antv/g2/esm/chart/layout';
import Base from "../common/Base";
import themes from '../themes/index';
import { /*pxToNumber,*/ numberDecimal, /*isInvalidNumber*/ } from '../common/common';
import './index.scss';
import rectTooltip, { TooltipConfig } from '../common/rectTooltip';
import rectLegend, { LegendConfig } from '../common/rectLegend';
import label, { LabelConfig } from '../common/label';
import { FullCrossName } from '../constants';
// import errorWrap from '../common/errorWrap';

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
  colors?: string[];
  legend?: LegendConfig | boolean;
  tooltip?: TooltipConfig | boolean;
  autoSort?: boolean;
  cycle?: boolean;
  select?: boolean;
  innerRadius?: number;
  outerRadius?: number;
  label?: LabelConfig | boolean,
  selectData?: string;
}

class Wpie extends Base<WpieConfig> {
  chartName = 'G2Pie';

  getDefaultConfig(): WpieConfig {
    return {
      colors: themes.category_12,
      // padding: [20, 20, 20, 20],
      legend: {
        position: 'right',
        align: '',
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
      // selectData: null,
      innerRadius: 0.8, // 内环半径大小，仅cycle为true时可用
      outerRadius: 0.8, // 饼图半径大小，初始化时可用
      // drawPadding: [10, 10, 10, 10],
      label: false,
    };
  }
  // beforeInit(props) {
  //   const { config } = props;
  //   const element = this.chartDom;
  //   const padding = props.padding || config.padding || this.defaultConfig.padding;
  //   const outerRadius = Math.max(Math.min(config.outerRadius || this.defaultConfig.outerRadius, 1), 0.01);
  //   const drawPadding = getDrawPadding(config.drawPadding, config.label, this.defaultConfig.drawPadding);
  //
  //   // fix: padding 为 auto 时会计算错误
  //   const boxHeight = element.offsetHeight - paddingNumber(padding[0]) - paddingNumber(padding[2]);
  //   const boxWidth = element.offsetWidth - paddingNumber(padding[1]) - paddingNumber(padding[3]);
  //   // 饼本体大小，向下取整
  //   const diameter = Math.floor(boxHeight < boxWidth ? boxHeight * outerRadius : boxWidth * outerRadius);
  //
  //   element.style.paddingTop = `${padding[0]}px`;
  //   element.style.paddingRight = `${padding[1]}px`;
  //   element.style.paddingBottom = `${padding[2]}px`;
  //   element.style.paddingLeft = `${padding[3]}px`;
  //
  //   this.childrenDom = element.querySelector('.cloud-charts-children');
  //   if (this.childrenDom) {
  //     this.childrenDom.style.width = `${diameter + drawPadding[1] + drawPadding[3]}px`;
  //     this.childrenDom.style.height = `${boxHeight}px`;
  //   }
  //
  //   // TODO 处理padding
  //   return Object.assign({}, props, {
  //     width: diameter + drawPadding[1] + drawPadding[3],
  //     height: diameter + drawPadding[0] + drawPadding[2],
  //     // forceFit: true,
  //     padding: drawPadding,
  //   });
  // },
  // changeSize(chart, config, w, h) {
  //   const padding = config.padding || this.defaultConfig.padding;
  //   const outerRadius = Math.max(Math.min(config.outerRadius || this.defaultConfig.outerRadius, 1), 0.01);
  //   const drawPadding = getDrawPadding(config.drawPadding, config.label, this.defaultConfig.drawPadding);
  //
  //   const boxHeight = h - paddingNumber(padding[0]) - paddingNumber(padding[2]);
  //   const boxWidth = w - paddingNumber(padding[1]) - paddingNumber(padding[3]);
  //   // 饼本体大小，向下取整
  //   const diameter = Math.floor(boxHeight < boxWidth ? boxHeight * outerRadius : boxWidth * outerRadius);
  //
  //   if (this.childrenDom) {
  //     this.childrenDom.style.width = `${diameter + drawPadding[1] + drawPadding[3]}px`;
  //     this.childrenDom.style.height = `${boxHeight}px`;
  //   }
  //
  //   chart.changeSize(diameter + drawPadding[1] + drawPadding[3], diameter + drawPadding[0] + drawPadding[2]);
  // },

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
      selectGeom.call(this, this.geom, objValue);
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
    rectLegend.call(this, chart, config, {
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
    }, true, null, true);

    // tooltip
    rectTooltip.call(
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
            }, index, ev.items);
          }
          if (config.tooltip.nameFormatter) {
            item.name = config.tooltip.nameFormatter(item.name, {
              ...raw,
              percent,
            }, index, ev.items);
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
      chart.interaction('element-single-selected');
    }

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

    chart.setLayout(() => {
      // 先运行默认 layout
      defaultLayout(chart);
      /*
      const axis = chart.getController('axis');
      const legend = chart.getController('legend');
      const annotation = chart.getController('annotation');
      const slider = chart.getController('slider');
      const scrollbar = chart.getController('scrollbar');

      // 根据最新的 coordinate 重新布局组件
      [axis, slider, scrollbar, legend, annotation].forEach((controller: Controller) => {
        if (controller) {
          controller.layout();
        }
      });
      */

      const legendComponents = chart.getController('legend').getComponents();
      if (legendComponents.length === 0) {
        return;
      }
      const radius = chart.getCoordinate().radius
      const legend = legendComponents[0].component;
      const legendPadding = legend.cfg.padding;
      const [legendPosition] = legend.cfg.position.split('-');
      if (legendPosition === 'top' || legendPosition === 'bottom') {
        return;
      }
      // 计算一个合适的 legend 位置
      // 1. legend 的宽高
      const legendBBox = legend.getLayoutBBox();
      // 2. 饼的宽高
      const pieSize = Math.min(chart.width, chart.height) * radius; // coordinate radius
      // 图表左右剩余空间的一半宽度
      const emptyAreaHalfWidth = (chart.width - pieSize - (legendBBox.width + legendPadding[1] + legendPadding[3])) / 2;
      // 下面的 x y 就是数学题了，可视化中所有定位的参考点是自己的左上角。
      legend.update({
        x: legendPosition === 'left' ? emptyAreaHalfWidth : emptyAreaHalfWidth + pieSize + legendPadding[3],
        // x: chart.width - (chart.width / 2 - pieSize / 2 ) / 2 - legendBBox.width / 2,
        // y: chart.height / 2 - legendBBox.height / 2,
      });
    });

    chart.on('afterrender', () => {
      // 默认选中效果
      selectGeom.call(this, this.geom, config.selectData);

      // 更新子元素位置
      const childDom = this.chartDom && (this.chartDom.querySelector(`.${FullCrossName}-children`) as HTMLElement);
      if (childDom) {
        const centerPoint = chart.getCoordinate().getCenter();
        childDom.style.left = `${centerPoint.x}px`;
        childDom.style.top = `${centerPoint.y}px`;
      }
    });

    // const geomStyle = config.geomStyle || {};
    // this.geom.style('x*y*type*extra', {
    //   ...geomStyle,
    // });
  }
}

export default Wpie;
