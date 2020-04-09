'use strict';
import { View } from '@antv/data-set';

import g2Factory from '../common/g2Factory';
import errorWrap from '../common/errorWrap';
import merge from '../common/merge';
import themes from '../themes/index';
import { defaultPadding, propertyAssign, propertyMap } from '../common/common';
import rectTooltip from '../common/rectTooltip';
import label from '../common/label';
import './G2Treemap.scss';

export default /*#__PURE__*/ errorWrap(g2Factory('G2Treemap', {
  convertData: false,
  getDefaultConfig() {
    return {
      colors: themes.category_12,
      padding: ['auto', 'auto', 'auto', 'auto'],
      tooltip: {
        titleFormatter: null,
        nameFormatter: null,
        valueFormatter: null,
      },
      label: {
        offset: 0,
        textStyle: {
          fill: '#fff',
        },
      },
      innerRadius: 0,
      polar: false,
      // 区块的 border 样式，包含 lineWidth lineDash stroke 等属性
      borderStyle: {
        lineWidth: 1,
        stroke: '#fff',
      },
    };
  },
  beforeInit(props) {
    const { config } = props;
    const newConfig = merge({}, this.defaultConfig, config);

    // TODO 处理padding
    return Object.assign({}, props, {
      padding: defaultPadding(
        props.padding || config.padding,
        newConfig,
        ...this.defaultConfig.padding,
      ),
      config: newConfig,
    });
  },
  init(chart, userConfig, data) {
    const config = userConfig;

    this.dataView = processDataView(config, data);

    chart.source(parseDataView(this.dataView));

    // tooltip
    rectTooltip.call(this, chart, config);

    // 设置坐标系：极坐标/直角坐标
    const chartCoord = config.polar
      ? chart.coord('polar', {
          innerRadius: config.innerRadius || 0,
        })
      : chart.coord();

    drawTreemap(chart, config, config.colors);

    chart.render();
  },
  changeData(chart, config, data) {
    if (this.dataView) {
      this.dataView.source(data);
    }
  },
}));

// 数据分箱
function processDataView(config, data) {
  const dv = new View().source(data, { type: 'hierarchy' });
  dv.transform({
    field: 'value',
    type: 'hierarchy.treemap',
    tile: 'treemapResquarify',
    as: ['x', 'y'],
  });

  return dv;
}

// 将 DataSet 处理后的结果转换为 G2 接受的数据
function parseDataView(dv) {
  const nodes = [];

  for (const node of dv.getAllNodes()) {
    if (node.data.name === 'root') {
      continue;
    }

    // if (!!node.children) {
    //   continue;
    // }

    const eachNode = {
      name: node.data.name,
      x: node.x,
      y: node.y,
      value: node.data.value,
      // depth: node.depth,
    };

    // if (!node.data.brand && node.parent) {
    //   eachNode.brand = node.parent.data.brand;
    // } else {
    //   eachNode.brand = node.data.brand;
    // }

    nodes.push(eachNode);
  }

  return nodes;
}

// 绘图方法
function drawTreemap(chart, config, colors, field = 'name') {
  chart.scale({
    x: { nice: true },
    y: { nice: true },
  });
  chart.axis(false);
  chart.legend(false);

  const geom = chart
    .polygon()
    .position('x*y')
    .color(field, colors)
    .tooltip('name*value', (name, count) => ({ name, value: count, title: name }))
    .style(config.borderStyle);

  label(geom, config, 'name', null, null, true);
}
