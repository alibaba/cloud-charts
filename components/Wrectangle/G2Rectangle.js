'use strict';

import { DataSet } from '@antv/data-set';
import g2Factory from '../common/g2Factory';
import errorWrap from '../common/errorWrap';
import merge from '../common/merge';
import themes from '../themes/index';
import { propertyAssign, propertyMap, defaultPadding } from '../common/common';
import guide from '../common/guide';
import rectXAxis from '../common/rectXAxis';
import rectYAxis from '../common/rectYAxis';
import rectAutoTickCount from '../common/rectAutoTickCount';
import rectTooltip from '../common/rectTooltip';
import label from '../common/label';
import './G2Rectangle.scss';

export default /*#__PURE__*/ errorWrap(g2Factory('G2Rectangle', {
  convertData: false,
  getDefaultConfig() {
    return {
      // 这里需要倒序排列
      colors: themes.order_10.slice().reverse(),
      padding: ['auto', 'auto', 'auto', 'auto'],
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
        bins: [20, 10], // 两个方向上的分箱个数
        // binWidth: [ 10, 1000 ],    // 两个方向上的分箱步长（会覆盖bins的配置）
        // offset: [ 0, 0 ],
      },
      grid: false,
      label: false,
    };
  },
  beforeInit(props) {
    const { config } = props;
    const newConfig = merge({}, this.defaultConfig, config);

    // TODO 处理padding
    // let defaultPaddingTop = this.defaultConfig.padding[0];
    // let defaultPaddingRight = this.defaultConfig.padding[1];
    // const defaultPaddingBottom = this.defaultConfig.padding[2];
    // const defaultPaddingLeft = this.defaultConfig.padding[3];
    // if (defaultPaddingRight !== 'auto' && Array.isArray(newConfig.yAxis)) {
    //   defaultPaddingRight = 44;
    // }
    // if (defaultPaddingTop !== 'auto' && !newConfig.legend) {
    //   defaultPaddingTop = 16;
    // }
    return Object.assign({}, props, {
      padding: defaultPadding(props.padding || config.padding, newConfig, ...this.defaultConfig.padding),
      config: newConfig,
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
        range: [0, 1],
      }, config.xAxis),
      y: propertyAssign(propertyMap.yAxis, {
        type: 'linear',
        tickCount: 5,
      }, config.yAxis),
      type: {
        type: 'cat',
      },
    };

    rectAutoTickCount(chart, config, defs, false);

    chart.source(rectangleDataView, defs);

    // 设置X轴
    rectXAxis.call(this, chart, config);

    // 设置单个Y轴
    rectYAxis.call(this, chart, config);

    // 设置图例
    chart.legend(false);

    // tooltip
    rectTooltip.call(this, chart, config, {
      showTitle: false,
      crosshairs: null,
    });

    // 绘制辅助线，辅助背景区域
    guide(chart, config);

    const geom = chart.polygon().position('x*y').color('count', config.colors).tooltip('x*y*count', (x, y, count) => ({
      // title: x,
      name: '数量',
      value: count,
    }));

    const geomStyle = config.geomStyle || {};
    geom.style('x*y*count*extra', {
      ...geomStyle,
    });

    label(geom, config, 'count', {
      offset: 0,
    });

    chart.render();
  },
  changeData(chart, newConfig, data) {
    if (this.rectangleDataView) {
      this.rectangleDataView.source(data);
    }
  },
}));
