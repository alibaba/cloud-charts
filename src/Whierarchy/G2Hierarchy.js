'use strict';
import { View } from '@antv/data-set';

import g2Factory from '../common/g2Factory';
import errorWrap from '../common/errorWrap';
import themes from '../themes/index';
import { defaultPadding, merge } from '../common/common';
import rectTooltip from '../common/rectTooltip';
import './G2Hierarchy.scss';

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
        // label 文本展示的策略
        labelRender: (depth, name, value, xRange, yRange) => {
          // 根据矩形大小判断是否渲染 label
          if (xRange[1] - xRange[0] > 0.03 && yRange[1] - yRange[0] > 0.05) {
            return name;
          }
          return;
        },
        innerRadius: 0,
        polar: false,
        // 区块的 border 样式，包含 lineWidth lineDash stroke 等属性
        borderStyle: {},
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

      drawHierarchy(chart, config, config.colors);

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
  const dv = new View().source(data, { type: 'hierarchy' });
  dv.transform({
    type: 'hierarchy.partition',
  });

  return dv;
}

// 将 DataSet 处理后的结果转换为 G2 接受的数据
function parseDataView(dv) {
  const nodes = [];

  for (const node of dv.getAllNodes()) {
    const eachNode = {
      name: node.data.name,
      value: node.value,
      depth: node.depth,
      x: node.x,
      y: node.y,
      path: getNodePath(node).join('/'),
    };

    nodes.push(eachNode);
  }

  return nodes;
}

// 简单矩形树图
function drawHierarchy(chart, config, colors, field = 'name') {
  // 设置坐标系：极坐标/直角坐标
  if (config.polar) {
    chart.coord('polar', {
      innerRadius: config.innerRadius || 0,
    });
  } else {
    chart.coord();
  }

  chart.axis(false);
  chart.legend(false);

  chart
    .polygon()
    .position('x*y')
    .color(field, colors)
    .tooltip('name*value*path', (name, value, path) => ({
      name,
      value,
      title: path,
    }))
    .style(config.borderStyle)
    .label(
      'depth*name*value*x*y',
      (depth, name, value, xs, ys) =>
        config.labelRender(
          depth,
          name,
          value,
          [Math.min(...xs), Math.max(...xs)],
          [Math.min(...ys), Math.max(...ys)],
        ),
      config.label,
    );
}

// 获取节点的路径
function getNodePath(n) {
  if (!n.parent) {
    return [n.data.name];
  }
  return [...getNodePath(n.parent), n.data.name];
}
