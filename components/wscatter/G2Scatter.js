'use strict';

// 引入所需要的库和样式
import merge from '../utils/merge';
import { color, size } from '../theme/normal';
import { propertyAssign, propertyMap, noop } from '../chartCommon/common';
import guide from '../chartCommon/guide';

// 建议将默认配置放在外层，方便后续维护
const defaultConfig = {
  padding: [40, 5, 32, 44],
  colors: color.category_12,
  xAxis: {
    type: 'linear',
    mask: 'YYYY-MM-DD HH:mm:ss'
  },
  yAxis: {
    min: 0
  },
  jitter: false,
  tooltip: true,
  legend: true
};
const colorMap = color.category_12;
const setAxis = (chart, config) => {

  const xAxis = {
    title: null, // 不展示坐标轴的标题
    label: {
      formatter: config.xAxis.labelFormatter
    }
  };

  if (config.jitter) {
    xAxis.grid = {
      align: 'center', // 网格顶点从两个刻度中间开始
      lineStyle: {
        stroke: color.colorN13,
        lineWidth: 1,
        // lineDash: [3, 3]
      }
    };
  }

  // 扰动点图不能打开垂直网格线
  if (config.grid && !config.jitter) {
    xAxis.grid = {
      lineStyle: {
        stroke: color.colorN13,
        lineWidth: 1
      }
    };
  }

  chart.axis('x', xAxis);


  chart.axis('y', {
    title: null,
    label: {
      formatter: config.yAxis.labelFormatter
    }
  });
};

const setSource = (chart, config, data) => {
  const defs = {
    x: propertyAssign(
      propertyMap.xAxis,
      {
        type: config.jitter ? 'cat' : 'linear'
      },
      config.xAxis
    ),
    type: {
      type: 'cat'
    }
  };

  defs.y = propertyAssign(
    propertyMap.yAxis,
    {
      type: 'linear',
      tickCount: 5
    },
    config.yAxis
  );

  chart.source(data, defs);
};

const chartRender = (chart, config) => {
  const typeArr = [];

  const geom = chart
    .point()
    .color('type', (val) => {
      let curIndex;
      if (!typeArr.includes(val)) {
        curIndex = typeArr.length;
        typeArr.push(val);
      } else {
        curIndex = typeArr.indexOf(val);
      }

      return colorMap[curIndex];
    })
    .position('x*y')
    .size(4)
    .shape('circle')
    .active(false);

  if (config.jitter) {
    geom.adjust('jitter');
  }

  chart.render();
};

export default {
  beforeInit(props) {
    const { config } = props;
    const preConfig = {};
    if (config.jitter) {
      preConfig.xAxis = {
        type: 'cat'
      }
    }
    const newConfig = merge({}, defaultConfig, preConfig, config);

    return Object.assign({}, props, {
      padding: props.padding || config.padding || (newConfig.legend ? defaultConfig.padding : [16, 5, 32, 44]),
      config: newConfig
    });
  },
  init(chart, userConfig, data, rawData) {
    const config = userConfig;
    setSource(chart, config, data);

    setAxis(chart, config);

    setToolTip.call(this, chart, config);

    setLegend.call(this, chart, config, this.chartDom);

    // 绘制辅助线，辅助背景区域
    guide(chart, config);

    chartRender(chart, config);
  }
};

const setLegend = function(chart, config, chartNode) {
  if (config.legend) {
    chart.legend({
      useHtml: true,
      title: null,
      position: 'top',
      // 这个属性文档里没有，设置为false可以让图例不居中，再手动设置定位样式
      autoPosition: false,
      onHover: noop,
      itemTpl: (value, color, checked, index) => {
        const item = (this.rawData && this.rawData[index]) || {};
        const result = config.legend.nameFormatter
          ? config.legend.nameFormatter(
            value,
            {
              ...item,
              color,
              checked
            },
            index
          )
          : value;
        return `${'<li class="g2-legend-list-item item-{index} {checked}" data-color="{originColor}" data-value="{originValue}">' +
          '<i class="g2-legend-marker" style="background-color:{color};"></i>' +
          '<span class="g2-legend-text">'}${result}</span></li>`;
      },
      'g2-legend': Object.assign(
        {
          top: size.s3
        },
        config.legend.align === 'right' ? { right: 0 } : { left: 0 }
      )
    });
  } else {
    chart.legend(false);
  }
};

const setToolTip = function (chart, config) {
  if (config.tooltip) {
    const tooltipCfg = {
      // crosshairs 空对象不可省略，否则在混合图表中会没有crosshairs line
      crosshairs: null,
      custom: true,
      containerTpl: '<div class="g2-tooltip">' + '<p class="g2-tooltip-title">{name}</p>' + '<div class="g2-tooltip-list"></div>' + '</div>', // tooltip的外层模板
      itemTpl: '<div class="g2-tooltip-list-item"><span style="color:{color}"></span><span>{value}</span></div>', // 支持的字段 index,color,name,value
      'g2-tooltip': {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        color: color.colorN24
      }, // 设置 tooltip 的 css 样式
      'g2-tooltip-title': {
        color: color.colorN24,
        marginRight: size.s3,
        marginTop: 0,
        fontSize: size.s3
      },
      'g2-tooltip-list-item': {
        marginTop: 0
      }
    };
    chart.tooltip(tooltipCfg);
    if (config.tooltip.titleFormatter || config.tooltip.nameFormatter || config.tooltip.valueFormatter) {
      chart.on('tooltip:change', (ev) => {
        if (config.tooltip.titleFormatter) {
          ev.items[0].title = config.tooltip.titleFormatter(ev.items[0].title, ev.items);
        }

        ev.items.forEach((item, index) => {
          const raw = (this.rawData && this.rawData[index]) || {};

          if (config.tooltip.valueFormatter) {
            item.value = config.tooltip.valueFormatter(item.value, raw, index, ev.items);
          }
          // if (config.tooltip.nameFormatter) {
          //   item.name = config.tooltip.nameFormatter(item.name, ev.items, index, item.point._origin);
          // }
        });
      });
    }
  } else {
    chart.tooltip(false);
  }
};
