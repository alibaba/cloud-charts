'use strict';

import { DataView } from '@antv/data-set';
import merge from '../common/merge';
import themes from '../theme/index';
import { legendHtmlContainer, legendHtmlListItem } from '../common/g2Theme';
import { pxToNumber, numberDecimal } from '../common/common';
import rectLegend from '../common/rectLegend';
import G2Pie from '../wpie/G2Pie';
import './G2MultiPie.scss';

function getParentList(node, target = []) {
  const parentNode = node.parent;
  // 需要存储根节点，所以一直到 parentNode===null（此时在根节点上）
  if (!parentNode) {
    return target;
  }

  target.unshift({
    name: parentNode.data.name,
    value: parentNode.value,
    rawValue: parentNode.data.value,
    depth: parentNode.depth,
  });

  return getParentList(parentNode, target);
}

function computeData(data) {
  let dv = null;
  if (this.dataView) {
    dv = this.dataView;
    dv.source(data, {
      type: 'hierarchy',
    });
  } else {
    dv = new DataView();
    this.dataView = dv;

    dv.source(data, {
      type: 'hierarchy',
    }).transform({
      type: 'hierarchy.partition', // 根据树形数据生成相邻层次图 Adjacency Diagram 布局
    });
  }

  const source = [];

  // 记录最大深度
  let maxDepth = 0;
  dv.getAllNodes().forEach((node) => {
    if (node.depth > maxDepth) {
      maxDepth = node.depth;
    }
    if (node.depth === 0) {
      // 父节点不展示
      return;
    }
    // var obj = {};
    // obj.name = node.data.name;
    // obj.rawValue = node.data.value;
    // obj.value = node.value;
    // obj.x = node.x;
    // obj.y = node.y;
    source.push({
      name: node.data.name,
      value: node.value,
      rawValue: node.data.value,
      depth: node.depth,
      parent: getParentList(node),
      x: node.x,
      y: node.y,
    });
    return node;
  });

  // 挂载转换后的数据
  this.data = source;

  return {
    source,
    maxDepth,
  };
}

const radiusMap = {
  2: -0.05,
  3: -0.07,
};

function getInnerRadius(maxDepth, innerRadius) {
  if (innerRadius) {
    return innerRadius;
  }
  return radiusMap[maxDepth] || 0;
}

export default Object.assign({}, G2Pie, {
  init(chart, userConfig, data) {
    const config = merge({}, this.defaultConfig, userConfig);

    const { source, maxDepth } = computeData.call(this, data);

    chart.source(source);

    // if (config.cycle) {
    //   thetaConfig.innerRadius = Math.max(Math.min(config.innerRadius, 1), 0);
    // }

    chart.coord('polar', {
      innerRadius: getInnerRadius(maxDepth, config.innerRadius), // 用于空心部分的半径设置
    });

    chart.axis(false);

    rectLegend.call(this, chart, config, {
      autoCollapse: false,
      position: 'right',
      itemTpl: (value, itemColor, checked, index) => {
        const { nameFormatter, valueFormatter, showData = true } = config.legend || {};

        const item = (this.data && this.data[index]) || {};
        const rootNode = item.parent[0];
        // 根节点的value就是全量值
        const percent = numberDecimal(item.value / rootNode.value, 4);

        const result = nameFormatter ? nameFormatter(value, {
          percent,
          itemColor,
          checked,
          ...item,
        }, index) : value;

        if (showData) {
          const number = valueFormatter ? valueFormatter(item.value, {
            percent,
            itemColor,
            checked,
            ...item,
          }, index) : item.value;
          return `${'<li class="g2-legend-list-item item-{index} {checked}" data-color="{originColor}" data-value="{originValue}">' +
          '<i class="g2-legend-marker" style="background-color:{color};"></i>' +
          '<span class="g2-legend-text">'}${result}</span>` + `<span class="g2-legend-value">${number}</span></li>`;
        }

        return `${'<li class="g2-legend-list-item item-{index} {checked}" data-color="{originColor}" data-value="{originValue}">' +
        '<i class="g2-legend-marker" style="background-color:{color};"></i>' +
        '<span class="g2-legend-text">'}${result}</span></li>`;
      },
      'g2-legend': {
        ...legendHtmlContainer,
        position: 'static',
        // inline flex items 不能使用百分比的margin/padding，设置为固定大小
        marginLeft: `${Math.max(pxToNumber(themes.s5) - (config.drawPadding || 0), 0)}px`,
      },
      'g2-legend-list-item': {
        ...legendHtmlListItem,
        marginRight: 0,
      },
    }, true);

    // tooltip
    if (config.tooltip) {
      const tooltipCfg = {
        showTitle: false,
        // crosshairs: {},
        itemTpl: '<li data-index={index}>'
          + '<span style="background-color:{color};" class="g2-tooltip-marker"></span>'
          + `<span class="g2-tooltip-item-name">{name}</span>${config.tooltip.showColon !== false ? ':' : ''}<span class="g2-tooltip-item-value">{value}</span></li>`,
      };
      chart.tooltip(tooltipCfg);
      if (config.tooltip.nameFormatter || config.tooltip.valueFormatter) {
        chart.on('tooltip:change', (ev) => {
          ev.items.forEach((item, index) => {
            const pointData = item.point._origin;
            const rootNode = pointData.parent[0];
            const percent = numberDecimal(item.value / rootNode.value, 4);

            if (config.tooltip.valueFormatter) {
              item.value = config.tooltip.valueFormatter(item.value, {
                percent,
                ...pointData,
              }, index, ev.items);
            }
            if (config.tooltip.nameFormatter) {
              item.name = config.tooltip.nameFormatter(item.name, {
                percent,
                ...pointData,
              }, index, ev.items);
            }
          });
        });
      }
    } else {
      chart.tooltip(false);
    }

    chart.polygon()
      .position('x*y')
      .color('name', config.colors)
      .tooltip('name*value*rawValue*depth', (name, value) => {
        return {
          name,
          value,
        };
      });

    chart.render();
  },
  changeData(chart, config, data) {
    const { source } = computeData.call(this, data);

    chart.changeData(source);
  },
});
