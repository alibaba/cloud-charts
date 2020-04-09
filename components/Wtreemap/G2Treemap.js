'use strict';
import { View } from '@antv/data-set';

import g2Factory from '../common/g2Factory';
import errorWrap from '../common/errorWrap';
import merge from '../common/merge';
import themes from '../themes/index';
import { defaultPadding } from '../common/common';
import rectTooltip from '../common/rectTooltip';
import label from '../common/label';
import './G2Treemap.scss';

export default /*#__PURE__*/ errorWrap(
  g2Factory('G2Treemap', {
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
            shadowBlur: 2,
            shadowColor: 'rgba(0,0,0,0.6)',
          },
        },
        // 控制 label 展现形态的方法
        labelRender: (depth, brand, name, value) => {
          // 只有第一级显示文本，数值太小时不显示文本
          if (depth === 1 && value > 0.2) {
            return brand;
          }
          return;
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
      const nodes = parseDataView(this.dataView);
      chart.source(nodes);

      // tooltip
      rectTooltip.call(this, chart, config, { crosshairs: false });

      if (nodes.some((x) => x.brand)) {
        drawNestedTreemap(chart, config, config.colors);
      } else {
        drawTreemap(chart, config, config.colors);
      }

      chart.render();
    },
    changeData(chart, config, data) {
      if (this.dataView) {
        this.dataView.source(data);
      }
    },
  }),
);

// 数据分箱
function processDataView(config, data) {
  const dv = new View().source(resetParentValue(data), { type: 'hierarchy' });
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

    const eachNode = {
      name: node.data.name,
      x: node.x,
      y: node.y,
      value: getNodeValue(node),
      depth: node.depth,
    };

    if (!node.data.brand && node.parent) {
      eachNode.brand = node.parent.data.brand;
    } else {
      eachNode.brand = node.data.brand;
    }

    nodes.push(eachNode);
  }

  return nodes;
}

// 简单矩形树图
function drawTreemap(chart, config, colors, field = 'name') {
  // 设置坐标系：极坐标/直角坐标
  if (config.polar) {
    chart.coord('polar', {
      innerRadius: config.innerRadius || 0,
    });
  } else {
    chart.coord();
  }

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

// 嵌套矩形树图
function drawNestedTreemap(chart, config, colors, field = 'brand') {
  // 设置坐标系：极坐标/直角坐标
  if (config.polar) {
    chart
      .coord('polar', {
        innerRadius: config.innerRadius || 0,
      })
      .reflect();
  } else {
    // 习惯性最小的在最下面
    chart.coord().scale(1, -1);
  }

  chart.scale({
    x: { nice: false },
    y: { nice: false },
  });
  chart.axis(false);
  chart.legend(false);

  chart
    .polygon()
    .position('x*y')
    .color(field, colors)
    .tooltip('name*value*brand', (name, value, brand) => ({
      name,
      value,
      title: brand,
    }))
    .style(config.borderStyle)
    .label('depth*brand*name*value', config.labelRender, config.label);
}

// 此方法对原始数据进行处理，返回新的副本
function resetParentValue({ brand, name, value, children }) {
  const result = { name, value };
  if (brand) {
    result.brand = brand;
  }
  if (children) {
    // DataView 会通过子节点累加 value 值，所以先置为 null
    result.value = null;
    result.children = children.map(resetParentValue);
  }
  return result;
}

// 计算当前节点 value
function getNodeValue(n) {
  if (n.data.value === null && n.children) {
    return n.children.map(getNodeValue).reduce((pre, cur) => pre + cur, 0);
  }
  return n.data.value;
}
