'use strict';

import { DataSet } from '@antv/data-set';
import merge from '../common/merge';
import { color } from '../theme/normal';
import { propertyAssign, propertyMap } from '../common/common';
import guide from '../common/guide';
import rectXAxis from '../common/rectXAxis';
import rectYAxis from '../common/rectYAxis';
import rectTooltip from '../common/rectTooltip';
import './G2Rectangle.scss';

const defaultConfig = {
  // 这里需要倒序排列
  colors: color.order_10.slice().reverse(),
  padding: [40, 10, 32, 44],
  xAxis: {
    labelFormatter: null, // 可以强制覆盖，手动设置label
    autoRotate: false,
    max: null,
    min: null,
  },
  yAxis: {
    labelFormatter: null, // 可以强制覆盖，手动设置label
    max: null,
    min: null,
  },
  tooltip: {
    nameFormatter: null,
    valueFormatter: null,
  },
  bin: {
    fields: ['x', 'y'],
    bins: [20, 10],          // 两个方向上的分箱个数
    // binWidth: [ 10, 1000 ],    // 两个方向上的分箱步长（会覆盖bins的配置）
    // offset: [ 0, 0 ],

  },
  grid: false,
};

export default {
  beforeInit(props) {
    const { config } = props;
    const newConfig = merge({}, defaultConfig, config);

    // TODO 处理padding
    // let defaultPaddingTop = defaultConfig.padding[0];
    // let defaultPaddingRight = defaultConfig.padding[1];
    // const defaultPaddingBottom = defaultConfig.padding[2];
    // const defaultPaddingLeft = defaultConfig.padding[3];
    // if (defaultPaddingRight !== 'auto' && Array.isArray(newConfig.yAxis)) {
    //   defaultPaddingRight = 44;
    // }
    // if (defaultPaddingTop !== 'auto' && !newConfig.legend) {
    //   defaultPaddingTop = 16;
    // }
    return Object.assign({}, props, {
      padding: props.padding || config.padding || defaultConfig.padding,
      config: newConfig
    });
  },
  init(chart, userConfig, data) {
    const config = userConfig;

    const ds = new DataSet();
    const rectangleDataView = ds.createView('diamond')
      .source(data)
      .transform(propertyAssign(['fields', 'bins', 'binWidth', 'offset', 'sizeByCount'], {
        type: 'bin.rectangle',
      }, config.bin));

    this.rectangleDataView = rectangleDataView;

    const defs = {
      x: propertyAssign(propertyMap.xAxis, {
        // 折线图X轴的范围默认覆盖全部区域，保证没有空余
        range: [0, 1]
      }, config.xAxis),
      y: propertyAssign(propertyMap.yAxis, {
        type: 'linear',
        tickCount: 5
      }, config.yAxis),
      type: {
        type: 'cat'
      }
    };

    chart.source(rectangleDataView, defs);

    // 设置X轴
    rectXAxis.call(this, chart, config);

    // 设置单个Y轴
    rectYAxis.call(this, chart, config);

    // 设置图例
    chart.legend(false);
    // rectLegend.call(this, chart, config);

    // tooltip
    rectTooltip.call(this, chart, config, {
      showTitle: false,
      crosshairs: null,
    });

    // 绘制辅助线，辅助背景区域
    guide(chart, config);

    chart.polygon().position('x*y').color('count', config.colors).tooltip('x*y*count', (x, y, count) => ({
      // title: x,
      name: '数量',
      value: count
    }));

    chart.render();
  },
  changeData(chart, newConfig, data) {
    if (this.rectangleDataView) {
      this.rectangleDataView.source(data);
    }
  }
};
