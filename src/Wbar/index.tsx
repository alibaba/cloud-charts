'use strict';

// import Brush from '@antv/g2-brush';
import { Chart, Types, BaseChartConfig } from '../common/types';
import Base from "../common/Base";
import errorWrap from '../common/errorWrap';
import themes from '../themes/index';
import { propertyAssign, propertyMap } from '../common/common';
import legendFilter from '../common/legendFilter';
// import ResetButton from '../common/ResetButton';
// import getGeomSizeConfig from '../common/geomSize';
import rectXAxis, { XAxisConfig } from '../common/rectXAxis';
import rectYAxis, { YAxisConfig } from '../common/rectYAxis';
import rectTooltip, { TooltipConfig } from '../common/rectTooltip';
import rectLegend, { LegendConfig } from '../common/rectLegend';
import guide, { GuideConfig } from '../common/guide';
import label, { LabelConfig } from "../common/label";
import rectZoom from "../common/rectZoom";
import './index.scss';

interface WbarConfig extends BaseChartConfig {
  colors?: string[];
  xAxis?: Types.ScaleOption & XAxisConfig | false,
  yAxis?: Types.ScaleOption & YAxisConfig | false,
  legend?: LegendConfig | boolean,
  tooltip?: TooltipConfig | boolean,
  guide?: GuideConfig,
  label?: LabelConfig | boolean,
  column?: boolean,
  dodgeStack?: boolean,
  stack?: boolean,
  stackReverse?: boolean,
  marginRatio?: number,
  grid?: boolean,
  zoom?: boolean,
  facet?: boolean,
  size?: string | number,
  polar?: boolean,
  innerRadius?: number,
  // geomStyle?: Types.LooseObject;
}

class Wbar extends Base<WbarConfig> {
  chartName = 'G2Bar';
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
  // beforeInit(props) {
  //   const { config } = props;
  //   const newConfig = config;
  //
  //   // TODO 处理padding
  //   return Object.assign({}, props, {
  //     padding: defaultPadding(
  //       props.padding || config.padding,
  //       newConfig,
  //       ...this.defaultConfig.padding
  //     ),
  //     config: newConfig,
  //   });
  // }
  init(chart: Chart, config: WbarConfig, data: any) {
    // 设置数据度量
    const defs: Record<string, Types.ScaleOption> = {
      x: propertyAssign(propertyMap.xAxis, {
        // type: 'cat',
      }, config.xAxis),
      y: propertyAssign(propertyMap.yAxis, {
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
    };

    chart.scale(defs);
    chart.data(data);

    // 设置单个Y轴
    if (!config.facet) {
      rectYAxis.call(this, chart, config);
    }

    // 设置X轴
    rectXAxis.call(this, chart, config);

    // 设置图例
    rectLegend.call(this, chart, config, null, false, 'type');

    legendFilter.call(this, chart);

    // tooltip
    rectTooltip.call(this, chart, config, {}, null, {
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

          rectYAxis.call(self, view, config, 'y', yAxisCustomConfig);

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

    // if (config.stack) {
    //   chart.interval().position('x*y').color('type', config.colors).adjust([{
    //     type: 'stack',
    //     reverseOrder: !config.stackReverse, // 层叠顺序倒序
    //   }]);
    // } else {
    //   chart.interval().position('x*y').color('type', config.colors).adjust([{
    //     type: 'dodge',
    //     marginRatio: 0, // 数值范围为 0 至 1，用于调整分组中各个柱子的间距
    //   }]);
    // }


    // // 拖拽缩放
    // if (config.zoom) {
    //   const button = new ResetButton(chart, this.language);
    //   this.resetButton = button;
    //
    //   this.brush = new Brush({
    //     canvas: chart.get('canvas'),
    //     chart,
    //     type: 'X',
    //     onBrushstart(startPoint) {
    //       chart.hideTooltip();
    //       chart.emit('zoom:start', startPoint);
    //     },
    //     onBrushmove: () => {
    //       chart.hideTooltip();
    //       button.show(this.language);
    //     },
    //     onBrushend: ev => {
    //       this.brush.container.clear(); // clear the brush
    //       const { type } = this.brush;
    //       const { xScale } = this.brush;
    //       const { yScale } = this.brush;
    //       // filter data
    //       if (type === 'X') {
    //         xScale &&
    //           chart.filter(xScale.field, val => {
    //             return ev[xScale.field].indexOf(val) > -1;
    //           });
    //       } else if (type === 'Y') {
    //         yScale &&
    //           chart.filter(yScale.field, val => {
    //             return ev[yScale.field].indexOf(val) > -1;
    //           });
    //       } else {
    //         xScale &&
    //           chart.filter(xScale.field, val => {
    //             return ev[xScale.field].indexOf(val) > -1;
    //           });
    //         yScale &&
    //           chart.filter(yScale.field, val => {
    //             return ev[yScale.field].indexOf(val) > -1;
    //           });
    //       }
    //       chart.repaint();
    //
    //       chart.emit('zoom:end', ev);
    //     },
    //   });
    // }
    rectZoom(chart, config, this.language);
  }
  // changeData(chart: Chart, config: WbarConfig, data: any) {
  //   chart.changeData(data);
  //
  //   // // 更新 brush 的 scale 实例，fix 数据更新后拖动缩放失效的问题。
  //   // if (config.zoom && this.brush) {
  //   //   this.brush.xScale = chart.getXScale();
  //   //   this.brush.yScale = chart.getYScales()[0];
  //   // }
  // }
  // destroy() {
  //   // 销毁时需要额外销毁缩放重置按钮
  //   if (this.brush) {
  //     this.brush.destroy();
  //   }
  //   if (this.resetButton) {
  //     this.resetButton.destroy();
  //   }
  // }
}

export default errorWrap(Wbar);

function drawBar(chart: Chart, config: WbarConfig, colors: string[], field = 'type') {
  const { stack, stackReverse, marginRatio, dodgeStack } = config;
  // const geomStyle = config.geomStyle || {};
  let geom = chart.interval().position(['x', 'y']);
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

  // geom.style('x*y*type*extra', {
  //   ...geomStyle,
  // });
  //
  // if (size) {
  //   const sizeConfig = getGeomSizeConfig(size, 20, 'y', 'x*y*type*facet*extra');
  //   geom.size(...sizeConfig);
  // }

  label(geom, config);
}
