'use strict';

// import errorWrap from '../common/errorWrap';
import { Chart, Types, BaseChartConfig } from '../common/types';
import Base from "../common/Base";
// import merge from '../common/merge';
import themes from '../themes/index';
import { propertyAssign, propertyMap } from '../common/common';
import legendFilter from '../common/legendFilter';
// import getGeomSizeConfig from "../common/geomSize";

import rectXAxis, { XAxisConfig } from '../common/rectXAxis';
import rectYAxis, { YAxisConfig } from '../common/rectYAxis';
import rectTooltip, { TooltipConfig } from '../common/rectTooltip';
import rectLegend, { LegendConfig } from '../common/rectLegend';
import guide, { GuideConfig } from '../common/guide';
import { LabelConfig } from "../common/label";

// import label from '../common/label';
import './index.scss';

interface WboxConfig extends BaseChartConfig {
  colors?: string[];
  xAxis?: Types.ScaleOption & XAxisConfig | false,
  yAxis?: Types.ScaleOption & YAxisConfig | false,
  legend?: LegendConfig | boolean,
  tooltip?: TooltipConfig | boolean,
  guide?: GuideConfig,
  label?: LabelConfig | boolean,
  dodge?: boolean,
  marginRatio: number,
  grid?: boolean,
  size: string | number,
  facet? : boolean,
  // 剩余部分自行定义
}

export default
class Wline extends Base<WboxConfig> {

  chartName = 'G2Box';

  getDefaultConfig():WboxConfig {
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
      dodge: true,
      marginRatio: 0,
      grid: false,
      // zoom: false,
      size: null,
      // label: false,
    };
  }

  // beforeInit(props) {
  //   const { config } = props;
  //   const newConfig = merge({}, this.defaultConfig, config);
  //
  //   // TODO 处理padding
  //   return Object.assign({}, props, {
  //     padding: defaultPadding(props.padding || config.padding, newConfig, ...this.defaultConfig.padding),
  //     config: newConfig,
  //   });
  // }
  init(chart: Chart, config: WboxConfig, data: any) {

    // 设置数据度量
    const defs: Record<string, Types.ScaleOption> = {
      x: propertyAssign(propertyMap.xAxis, {
        type: 'cat',
      }, config.xAxis),
      y: propertyAssign(propertyMap.yAxis, {
        type: 'linear',
        tickCount: 5,
      }, config.yAxis),
      type: {
        type: 'cat',
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
    rectTooltip.call(this, chart, config, {
      crosshairs: {
        type: 'rect',
      },
    });

    // 绘制辅助线，辅助背景区域
    guide(chart, config);

    // // 横向柱状图
    // if (!config.column) {
    //   chart.coord().transpose();
    // }

    drawBox(chart, config, config.colors);

  }
};

function drawBox(chart: Chart, config: WboxConfig, colors: string[], field = 'type') {
  const { dodge, marginRatio } = config;
  let geom = null;

  // 分组
  geom = chart.schema().position(['x', 'y']).shape('box').color(field, colors)
      .style(field, (type) => {
        return {
          lineWidth: 2
        }
        // fill: (type) => {
        //
        // }
      });

  if (dodge !== false) {
    geom.adjust([{
      type: 'dodge',
      marginRatio: marginRatio || 0.5, // 数值范围为 0 至 1，用于调整分组中各个柱子的间距
    }]);
  }

  // if (size) {
  //   const sizeConfig = getGeomSizeConfig(size, 20, 'y', 'x*y*type*extra');
  //   geom.size(...sizeConfig);
  // }

  // label(geom, config);
}
