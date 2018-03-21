'use strict';

import Brush from '@antv/g2-brush';
import merge from '../utils/merge';
import { color, size } from '../theme/normal';
import { propertyAssign, getDataIndexColor, propertyMap, noop } from '../chartCommon/common';
import guide from '../chartCommon/guide';
import rectTooltip from '../chartCommon/rectTooltip';
import './G2Line.scss';

const defaultConfig = {
  colors: color.category_12,
  padding: [40, 5, 32, 44],
  xAxis: {
    type: 'time', //默认为线性
    mask: 'YYYY-MM-DD HH:mm:ss', //上述type为time时，此字段生效
    labelFormatter: null, //可以强制覆盖，手动设置label
    categories: null,
    autoRotate: false,
    max: null,
    min: null,
  },
  yAxis: {
    labelFormatter: null, //可以强制覆盖，手动设置label
    max: null,
    min: null,
  },
  legend: {
    align: 'left',
    nameFormatter: null, //可以强制覆盖，手动设置label
  },
  tooltip: {
    titleFormatter: null,
    nameFormatter: null,
    valueFormatter: null,
  },
  area: false,
  stack: false,//仅Area有效
  spline: false,
  grid: false,
  symbol:false,
  // TODO
  // zoom: false,
  // labels: false,
  // mini: false,
  // dataConfig: {
  //   nameKey: 'name',
  //   valueKey: 'value',
  //   // valueKey: ['value1', 'value2'],
  //   typeKey: 'type'
  // }
};

export default {
  beforeInit(props) {
    const {config} = props;
    const newConfig = merge({}, defaultConfig, config);

    // TODO 处理padding
    let defaultPaddingTop = defaultConfig.padding[0];
    let defaultPaddingRight = defaultConfig.padding[1];
    let defaultPaddingBottom = defaultConfig.padding[2];
    let defaultPaddingLeft = defaultConfig.padding[3];
    if (Array.isArray(newConfig.yAxis)) {
      defaultPaddingRight = 44;
    }
    if (!newConfig.legend) {
      defaultPaddingTop = 16;
    }
    return Object.assign({}, props, {
      padding: props.padding || config.padding || [defaultPaddingTop, defaultPaddingRight, defaultPaddingBottom, defaultPaddingLeft],
      config: newConfig
    });
  },
  init(chart, userConfig, data, rawData) {
    const config = userConfig;

    if (config.xAxis && config.xAxis.type === 'datetime') {
      config.xAxis.type = 'time';
    }

    const defs = {
      x: propertyAssign(propertyMap.xAxis, {
        type: 'time',
        // 折线图X轴的范围默认覆盖全部区域，保证没有空余
        range: [0, 1]
      }, config.xAxis),
      type: {
        type: 'cat'
      }
    };

    if (Array.isArray(config.yAxis)) {
      config.yAxis.forEach((axis, yIndex) => {
        defs['y' + yIndex] = propertyAssign(propertyMap.yAxis, {
          type: 'linear',
          tickCount: 5
        }, axis);
      });
    } else {
      defs.y = propertyAssign(propertyMap.yAxis, {
        type: 'linear',
        tickCount: 5
      }, config.yAxis);
    }

    chart.source(data, defs);

    const xAxis = {
      title: null, // 不展示坐标轴的标题
      label:{
        autoRotate: config.xAxis.autoRotate,
        formatter: config.xAxis.labelFormatter,
      }
    };

    // 网格线
    if (config.grid) {
      xAxis.grid = {
        lineStyle: {
          stroke: color.colorN13,
          lineWidth: 1,
          // lineDash: null
        },
        // hideFirstLine: true
      };
    }
    chart.axis('x', xAxis);

    if (Array.isArray(config.yAxis)) {
      config.yAxis.forEach((axis, yIndex) => {
        const yAxis = {
          title: null, // 不展示坐标轴的标题
          line: {
            stroke: getDataIndexColor(config.colors, this.rawData, yIndex) || color.colorN16
          },
          label:{
            formatter: axis.labelFormatter,
          }
        };
        if (yIndex !== 0) {
          yAxis.grid = null;
        }

        chart.axis('y' + yIndex, yAxis);
      });
    } else {
      const yAxis = {
        title: null, // 不展示坐标轴的标题
        label:{
          formatter:config.yAxis.labelFormatter,
        }
      };

      chart.axis('y', yAxis);
    }

    // 设置图例
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
          const result = config.legend.nameFormatter ? config.legend.nameFormatter(value, {
            ...item,
            color,
            checked
          }, index) : value;
          return '<li class="g2-legend-list-item item-{index} {checked}" data-color="{originColor}" data-value="{originValue}">' +
            '<i class="g2-legend-marker" style="background-color:{color};"></i>' +
            '<span class="g2-legend-text">' + result + '</span></li>';
        },
        'g2-legend': Object.assign({
          top: size.s3,
        }, config.legend.align === 'right' ? { right: 0 } : { left: 0 }),
      });
    } else {
      chart.legend(false);
    }

    // tooltip
    rectTooltip.call(this, chart, config);

    // 绘制辅助线，辅助背景区域
    guide(chart, config);

    // 区域、堆叠、平滑曲线
    const lineShape = config.spline ? 'smooth' : 'line';
    const areaShape = config.spline ? 'smooth' : 'area';

    if (Array.isArray(config.yAxis)) {
      config.yAxis.forEach((asix, yIndex) => {
        drawLine(chart, config, lineShape, areaShape, 'y' + yIndex);
      });
    } else {
      drawLine(chart, config, lineShape, areaShape);
    }

    chart.render();

    // G2 3.0 暂不支持框选模式
    if (config.zoom) {
    //   chart.setMode('select'); // 开启框选模式
    //   chart.select('rangeX'); // 选择框选交互形式

      const button = this.resetButton = new ResetButton(chart);

      this.brush = new Brush({
        canvas: chart.get('canvas'),
        chart,
        type: 'X',
        onBrushstart() {
          chart.hideTooltip();
        },
        onBrushmove() {
          chart.hideTooltip();
          button.show();
        }
      });
    }
  },
  destroy() {
    if (this.brush) {
      this.brush.destroy();
    }
    if (this.resetButton) {
      this.resetButton.destroy();
    }
  }
};

function drawLine(chart, config, lineShape, areaShape, yAxisKey = 'y') {
  if (config.area && config.stack) {
    chart.areaStack().position(['x', yAxisKey]).color('type', config.colors).shape(areaShape).active(false);
    chart.lineStack().position(['x', yAxisKey]).color('type', config.colors).shape(lineShape).style({
      lineJoin: 'round'
    });
  } else if (config.area && !config.stack) {
    chart.area().position(['x', yAxisKey]).color('type', config.colors).shape(areaShape).active(false);
    chart.line().position(['x', yAxisKey]).color('type', config.colors).shape(lineShape).style({
      lineJoin: 'round'
    });
  } else {
    chart.line().position(['x', yAxisKey]).color('type', config.colors).shape(lineShape).style({
      lineJoin: 'round'
    });
  }
  // 曲线默认点
  if (config.symbol && config.area && config.stack) {
    chart.point().adjust('stack').position(['x', yAxisKey]).color('type', config.colors).shape('circle').size(3).active(false);
  } else if (config.symbol) {
    chart.point().position(['x', yAxisKey]).color('type', config.colors).shape('circle').size(3).active(false);
  }
}

class ResetButton {
  constructor(chart) {
    this.chart = chart;
    this.isShow = false;
    this.dom = null;

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    e.preventDefault();
    this.hide();
  }

  show() {
    if (this.isShow) {
      return;
    }

    if (this.dom) {
      this.dom.style.display = 'block';
      this.isShow = true;
    } else {
      const chart = this.chart;
      const wrapper = chart.get('wrapperEl');
      const range = chart.get('plotRange');
      if (wrapper && range && range.tr) {
        this.dom = document.createElement('span');
        this.dom.innerText = '重置';
        this.dom.className = 'widgets-reset-button';
        this.dom.style.top = range.tr.y + 'px';
        this.dom.style.right = (chart.get('width') - range.tr.x) + 'px';
        wrapper.appendChild(this.dom);

        this.isShow = true;

        this.dom.addEventListener('click', this.handleClick);
      }
    }
  }

  hide() {
    if (this.isShow && this.dom) {
      this.chart.get('options').filters = {};
      this.chart.repaint();
      this.dom.style.display = 'none';
      this.isShow = false;
    }
  }

  destroy() {
    if (this.dom) {
      this.dom.removeEventListener('click', this.handleClick);
      this.dom.parentNode.removeChild(this.dom);
      this.dom = null;
    }
    this.chart = null;
  }
}
