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
import circleAnnotation, { DecorationConfig } from '../common/circleAnnoation';
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

interface WpieConfig extends BaseChartConfig, DecorationConfig {
  colors?: Colors;
  legend?: LegendConfig | boolean;
  tooltip?: TooltipConfig | boolean;
  autoSort?: boolean;
  autoFormat?: boolean;
  cycle?: boolean;
  select?: boolean;
  innerRadius?: number;
  outerRadius?: number;
  /**
   * 用于极坐标，配置起始弧度。
   */
  startAngle?: number;
  /**
   * 用于极坐标，配置结束弧度。
   */
  endAngle?: number;
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
  sourceData: ChartData = [];

  changeData(chart: Chart, config: WpieConfig, data: ChartData) {
    // 更新数据总和值，保证百分比的正常
    let totalData = 0;
    data.forEach((d: { y: number; }) => {
      totalData += d.y;
    });
    this.totalData = totalData;
    this.sourceData = data;

    // 不要忘记排序的状态
    if (config.autoSort) {
      data.sort((a: Types.LooseObject, b: Types.LooseObject) => b.y - a.y);
    }
    // 更新挂载的转换数据
    // this.data = data;

    const { isExeed, result: newData, newRawData} = formatBigData(data, this.rawData, totalData, config);

    if (isExeed && config.autoFormat) {
      this.rawData = newRawData;
      chart.changeData(newData);
    } else {
      chart.changeData(data);
    }
  }

  protected geom: Geometry = null;

  protected noDataShape: G2Dependents.IShape = null;

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

    // 计算得总数据
    let totalData = 0;
    data.forEach((d) => {
      totalData += d.y;
    });
    this.totalData = totalData;

    // 处理后的原始数据
    this.sourceData = data;

    // 大数据重构，需要用到原始数据，必须开启排序
    const { isExeed, result: newData, newRawData} = formatBigData(data, this.rawData, totalData, config);

    // console.log(this.sourceData, newData);
    chart.scale(defs);

    if (isExeed && config.autoFormat) {
      this.rawData = newRawData;
      chart.data(newData);
    } else {
      chart.data(this.sourceData);
    }

    // 重要：绘制饼图时，必须声明 theta 坐标系
    const thetaConfig: Types.CoordinateCfg = {
      // radius: 1, // 设置饼图的为100% 大小，具体大小改变在 beforeInit 中diameter的值，目前为0.8
      radius: Math.max(Math.min(config.outerRadius, 1), 0.01),
    };
    if (config.cycle) {
      thetaConfig.innerRadius = Math.max(Math.min(config.innerRadius, 1), 0);
    }
    if (config.startAngle !== undefined) {
      thetaConfig.startAngle = config.startAngle
    }
    if (config.endAngle !== undefined) {
      thetaConfig.endAngle = config.endAngle
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
      raw.data && raw.data.forEach((r: any) => {
        if (Array.isArray(r) && r[0] === name) {
          value = r[1];
        } else if (typeof r === 'object' && r.x === name) {
          value = r.y
        }
      });

      const percent = this.totalData === 0 ? 0 : numberDecimal(value / this.totalData, 4);

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
      .adjust('stack');

    if (isExeed && config.autoFormat) {
      this.geom = this.geom.color('x', themes.category_12.slice(0, 5).concat(themes['widgets-axis-line']));
    } else {
      this.geom = this.geom.color('x', config.colors);
    }

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
    label({
      geom: this.geom,
      config: config,
      field: labelField,
      componentConfig: {
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
      }
    });

    polarLegendLayout(chart);

    // 空数据渲染效果
    chart.on('beforepaint', () => {
      if (this.totalData !== 0 && this.noDataShape) {
        this.noDataShape.remove(true);
        this.noDataShape = null;
      }
    });

    circleAnnotation(chart, config, this.size, 'G2Pie');

    chart.on('afterpaint', () => {
      // 默认选中效果
      selectGeom(this.geom, config.selectData);

      updateChildrenPosition(chart, this.chartDom);

      if (this.totalData === 0 && !this.noDataShape) {
        const bgGroup = chart.getLayer('bg' as any);
        const coordinate = chart.getCoordinate();
        const { radius, innerRadius } = coordinate;
        const { x: centerX, y: centerY } = coordinate.getCenter();
        const pieSize = Math.min(chart.coordinateBBox.width, chart.coordinateBBox.height) * radius;
        const outerR = pieSize / 2;

        const path = [
          ['M', centerX, centerY - outerR],
          ['A', outerR, outerR, 0, 1, 1, centerX, centerY + outerR],
          ['A', outerR, outerR, 0, 1, 1, centerX, centerY - outerR],
          // ['Z'],
        ];
        if (innerRadius > 0) {
          const innerR = pieSize * innerRadius / 2;
          path.push(
            ['M', centerX, centerY - innerR],
            ['A', innerR, innerR, 0, 0, 0, centerX, centerY + innerR],
            ['A', innerR, innerR, 0, 0, 0, centerX, centerY - innerR],
            // ['Z'],
          );
        }
        this.noDataShape = bgGroup.addShape({
          id: 'no-data-path',
          name: 'no-data-path',
          type: 'path',
          attrs: {
            path,
            fill: themes['widgets-circle-stroke-background'],
          },
        });

        // shape.set('tip', 'sdfhsjkdhk');
        //
        // registerInteraction('no-data-text', {
        //   start: [
        //     {
        //       trigger: 'no-data-path:mousemove',
        //       action: 'ellipsis-text:show',
        //       throttle: { wait: 50, leading: true, trailing: false },
        //     },
        //     {
        //       trigger: 'no-data-path:touchstart',
        //       action: 'ellipsis-text:show',
        //       throttle: { wait: 50, leading: true, trailing: false },
        //     },
        //   ],
        //   end: [
        //     { trigger: 'no-data-path:mouseleave', action: 'ellipsis-text:hide' },
        //     { trigger: 'no-data-path:touchend', action: 'ellipsis-text:hide' },
        //   ],
        // });
      }
    });

  }
}

const Wpie: typeof Pie = errorWrap(Pie);

export default Wpie;

function formatBigData(data: ChartData, rawData: ChartData, totalData: number, config: WpieConfig) {
  // if (!config.autoSort) return { isExeed: false, result: data };
  let isExeed = false;
  // 处理后的结果
  let result: ChartData = [];
  // 处理后的原始数据
  let newRawData: any = [];
  // 超过5个数据后，剩余数据的占比
  let remainData = 0;
  data?.forEach((item: any, index: number) => {
    if (index > 4) {
      remainData += item?.y;
    }
  });

  const raw = (rawData && rawData[0]) || {};
  remainData = Number(remainData.toFixed(1));
  // 展示类别大于5，且剩余内容小于长度/周长的后10%，剩余内容改为其他
  if (Array.isArray(data) && data?.length > 5 && (numberDecimal(remainData / totalData, 2) <= 0.1)) {
    isExeed = true;
    result = data.slice(0, 5);

    // 饼图的其他配置暂时不加上
    result.push({
      x: '其他',
      y: remainData
    })
    result.map((item: any) => {
      const newData = raw?.data?.slice(0, 5).concat([['其他', remainData]]);
      if (item?.groupExtra) {
        item.groupExtra.data = newData;
      } else {
        item.groupExtra = {
          data: newData
        };
        item.type = raw?.name;
      }
      newRawData = [
        {
          name: raw?.name,
          data: newData
        }
      ];
    });
  } else {
    isExeed = false;
    result = data;
  }

  return {
    isExeed,
    result,
    newRawData,
  };
}
