'use strict';

import G2 from '@antv/g2';
import merge from '../utils/merge';
import {color, fonts, size} from "../variables";
import { propertyAssign } from '../chartCommon/common';
import highchartsDataToG2Data from '../chartCommon/dataAdapter';
import './G2LineBar.scss';
const Util = G2.Util;

const propertyMap = {
  xAxis: ['type', 'alias', 'tickCount', 'tickInterval', 'formatter', 'min', 'max', 'mask'],
  yAxis: ['type', 'alias', 'tickCount', 'tickInterval', 'formatter', 'min', 'max', 'mask'],
};

const barKey = 'bar';
const lineKey = 'line';

const defaultConfig = {
  lineColors: color.colors_12.slice(1),
  barColors: color.colors_12,
  padding: [32, 45, 32, 45],
  xAxis: {
    type: 'linear', //默认为线性
    mask: 'YYYY-MM-DD HH:mm:ss', //上述type为time时，此字段生效
    labelFormatter: null, //可以强制覆盖，手动设置label
    categories: null,
    max: null,
    min: null,
  },
  yAxis: {
    labelFormatter: null, //可以强制覆盖，手动设置label
    max: null,
    min: null,
    // bgArea: [], // TODO 辅助区域后期需要加上
    // guideLine: null
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
  // TODO 修改事件绑定规则
  // clickable: false,
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
    // TODO 处理padding
    return Object.assign({}, props, {
      padding: props.padding || config.padding || defaultConfig.padding,
      config: merge({}, defaultConfig, config)
    });
  },
  init(chart, userConfig, data, rawData) {
    const config = userConfig;

    //在这里 data === rawData
    const rawLineData = [];
    const rawBarData = [];
    data.forEach((d) => {
      if (d.type === 'line') {
        rawLineData.push(d);
      } else if (d.type === 'bar') {
        rawBarData.push(d);
      }
    });

    const lineData = highchartsDataToG2Data(rawLineData, config);
    const barData = highchartsDataToG2Data(rawBarData, config);

    const defs = {
      x: propertyAssign(propertyMap.xAxis, {
        type: 'cat',
      }, config.xAxis),
      type: {
        type: 'cat'
      }
    };

    if (Array.isArray(config.yAxis)) {
      config.yAxis.forEach((axis, yIndex) => {
        defs['y' + yIndex] = propertyAssign(propertyMap.yAxis, {
          type: 'linear',
        }, axis);
        // defs['y' + yIndex] = propertyAssign(propertyMap.yAxis, {
        //   type: 'linear',
        // }, axis);
      });
    } else {
      defs['y'] = propertyAssign(propertyMap.yAxis, {
        type: 'linear',
        // 单轴时，必须同步度量，否则会两个度量叠加在一起
        sync: true
      }, config.yAxis);
      // defs['y' + barKey] = propertyAssign(propertyMap.yAxis, {
      //   type: 'linear',
      // }, config.yAxis);
    }

    chart.scale(defs);

    const xAxis = {
      title: null, // 不展示坐标轴的标题
      label:{
        formatter:config.xAxis.labelFormatter,
      }
    };

    // 网格线
    if (config.grid) {
      xAxis.grid = {
        lineStyle: {
          stroke: color.colorFill12,
          lineWidth: 1,
          // lineDash: null
        },
        // hideFirstLine: true
      };
    }
    chart.axis('x', xAxis);

    if (Array.isArray(config.yAxis)) {
      config.yAxis.forEach((axis, yIndex) => {
        const axisColor = getYAxisColor(config.lineColors, rawLineData, yIndex) || getYAxisColor(config.barColors, rawBarData, yIndex) || color.colorLine12;
        const yAxisLine = {
          title: null, // 不展示坐标轴的标题
          line: {
            stroke: axisColor
          },
          label:{
            formatter: axis.labelFormatter,
          }
        };
        if (yIndex !== 0) {
          yAxisLine.grid = null;
          // TODO 可能需要移动位置？
          yAxisLine.position = 'right';
        }

        chart.axis('y' + yIndex, yAxisLine);

        // const yAxisBar = {
        //   title: null, // 不展示坐标轴的标题
        //   line: {
        //     stroke: axisColor
        //   },
        //   label:{
        //     formatter: axis.labelFormatter,
        //   }
        // };
        // if (yIndex !== 0) {
        //   yAxisBar.grid = null;
        // }
        //
        // chart.axis('y' + yIndex + barKey, yAxisBar);
      });
    } else {
      const yAxisLine = {
        title: null, // 不展示坐标轴的标题
        label:{
          formatter:config.yAxis.labelFormatter,
        }
      };

      chart.axis('y', yAxisLine);

      // const yAxisBar = {
      //   title: null, // 不展示坐标轴的标题
      //   label:{
      //     formatter:config.yAxis.labelFormatter,
      //   }
      // };
      //
      // chart.axis('y' + barKey, yAxisBar);
    }

    // 设置图例
    if (config.legend) {
      chart.legend({
        useHtml: true,
        title: null,
        position: 'top',
        // 这个属性文档里没有，设置为false可以让图例不居中，再手动设置定位样式
        autoPosition: false,
        itemTpl: (value, color, checked, index) => {
          const item = (rawData && rawData[index]) || {};
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
          display: 'inline-block',
          position: 'relative',
          marginRight: size.s3,

          overflow: 'auto',
          fontFamily: fonts.fontFamilyBase,
          fontSize: fonts.fontSizeBaseCaption,
          lineHeight: fonts.fontSizeBaseCaption,
          color: color.colorText14,
          top: '6px',
        }, config.legend.align === 'right' ? { right: 0 } : { left: 0 }),
        'g2-legend-list': {},
        'g2-legend-list-item': {
          marginBottom: size.s3,
          marginRight: size.s3
        },
        'g2-legend-marker': {
          width: '6px',
          height: '6px',
          marginRight: size.s1,
        },
      });
    } else {
      chart.legend(false);
    }

    // tooltip
    if (config.tooltip) {
      let tooltipCfg = {
        // crosshairs 空对象不可省略，否则在混合图表中会没有crosshairs line
        crosshairs: {
          //   type: 'y' // 启用水平方向的辅助线
          //   stroke: '#dddddd',
          //   // lineWidth: 1,
        },
        // html: '<div class="ac-tooltip" style="position:absolute;visibility: hidden;"><h4 class="ac-title"></h4><ul class="ac-list"></ul></div>',
        // itemTpl: '<li><i style="background-color:{color}"></i>{x}<span>{y}</span></li>',
      };
      chart.tooltip(tooltipCfg);
      if (config.tooltip.titleFormatter || config.tooltip.nameFormatter || config.tooltip.valueFormatter) {
        chart.on('tooltip:change', function (ev) {
          if (config.tooltip.titleFormatter) {
            ev.items[0].title = config.tooltip.titleFormatter(ev.items[0].title, ev.items);
          }

          ev.items.forEach((item, index) => {
            if (config.tooltip.valueFormatter) {
              item.value = config.tooltip.valueFormatter(item.value, ev.items, index, item.point._origin);
            }
            if (config.tooltip.nameFormatter) {
              item.name = config.tooltip.nameFormatter(item.name, ev.items, index, item.point._origin);
            }
          });
        });
      }
    } else {
      chart.tooltip(false);
    }

    //正式开始绘图，创建两个不同的view
    const barView = chart.view();
    barView.source(barData);
    // barView.interval().position('name*value').color('type0').adjust(['dodge']);
    this.barView = barView;

    const lineView = chart.view();
    lineView.source(lineData);
    // lineView.line().position('name*value').color('type');
    this.lineView = lineView;

    const lineShape = config.spline ? 'smooth' : 'line';
    const areaShape = config.spline ? 'smooth' : 'area';

    if (Array.isArray(config.yAxis)) {
      config.yAxis.forEach((asix, yIndex) => {
        if (getYAxisColor(config.barColors, rawBarData, yIndex)) {
          drawBar(barView, config, 'y' + yIndex);
        }
        if (getYAxisColor(config.lineColors, rawLineData, yIndex)) {
          drawLine(lineView, config, lineShape, areaShape, 'y' + yIndex);
        }
      });
    } else {
      drawBar(barView, config);
      drawLine(lineView, config, lineShape, areaShape);
    }

    chart.render();

    // 自定义图例html
    // if (config.legend) {
    //   let chartNode = this.chartDom;
    //   chartNode.style.position = 'relative';
    //   let geom = chart.getGeoms()[0]; // 获取所有的图形
    //   let items = geom.getData(); // 获取图形对应的数据
    //   let stash = {};
    //
    //   let ulNode = document.createElement('ul');
    //   ulNode.classList.add('ac-line-legend');
    //   // ulNode.style.top = config.padding[0] + 'px';
    //   if(config.legend.align === 'right'){
    //     ulNode.style.right = config.padding[1] + 'px';
    //   }else{
    //     ulNode.style.left = 5 + 'px';
    //   }
    //   ulNode.innerHTML = '';
    //   for (let i = 0, l = items.length; i < l; i++) {
    //     let item = items[i];
    //     let itemData = item._origin;
    //     let color = item.color;
    //     let type = itemData[0].type;
    //     let name = itemData.name;
    //     let value = itemData.value;
    //
    //     let typeFormatter = config.legend.nameFormatter ? config.legend.nameFormatter(type, item, i) : type ;
    //
    //     let liHtml = '<li class="item" data-id="' + type + '"><i class="dot" style="background:' + color + ';"></i><span>' + typeFormatter + '</span></li>';
    //     ulNode.innerHTML += liHtml;
    //     chartNode.appendChild(ulNode);
    //
    //     stash[type] = {
    //       item: item,
    //       color: color,
    //       name: type,
    //       isChecked: true,
    //       index: i
    //     };
    //   }
    //   let dotDom = chartNode.getElementsByClassName('dot');
    //   Array.prototype.forEach.call(ulNode.querySelectorAll('li'), (item) => {
    //     item.addEventListener('click', (e) => {
    //       let node = getLegendNode(e.target);
    //       let type = node.getAttribute('data-id');
    //       g2LegendFilter(type, stash, Util, dotDom, chart);
    //     });
    //   });
    // }
  },
  changeData(chart, userConfig, data) {
    const rawLineData = [];
    const rawBarData = [];
    data.forEach((d) => {
      if (d.type === 'line') {
        rawLineData.push(d);
      } else if (d.type === 'bar') {
        rawBarData.push(d);
      }
    });

    const lineData = highchartsDataToG2Data(rawLineData, userConfig);
    const barData = highchartsDataToG2Data(rawBarData, userConfig);

    this.barView && this.barView.changeData(barData);
    this.lineView && this.lineView.changeData(lineData);
  }
};

function drawBar(chart, config, yAxisKey = 'y') {
  if (config.stack) {
    chart.intervalStack().position(['x', yAxisKey]).color('type', config.barColors);
  } else {
    chart.interval().position(['x', yAxisKey]).color('type', config.barColors).adjust([{
      type: 'dodge',
      marginRatio: 0, // 数值范围为 0 至 1，用于调整分组中各个柱子的间距
    }]);
  }
}

function drawLine(chart, config, lineShape, areaShape, yAxisKey = 'y') {
  if (config.area && config.stack) {
    chart.areaStack().position(['x', yAxisKey]).color('type', config.lineColors).shape(areaShape);
    chart.lineStack().position(['x', yAxisKey]).color('type', config.lineColors).shape(lineShape);
  } else if (config.area && !config.stack) {
    chart.area().position(['x', yAxisKey]).color('type', config.lineColors).shape(areaShape);
    chart.line().position(['x', yAxisKey]).color('type', config.lineColors).shape(lineShape);
  } else {
    chart.line().position(['x', yAxisKey]).color('type', config.lineColors).shape(lineShape);
  }
  // 曲线默认点
  if (config.symbol && config.area && config.stack) {
    chart.point().adjust('stack').position(['x', yAxisKey]).color('type', config.lineColors).shape('circle').size(3);
  } else if (config.symbol) {
    chart.point().position(['x', yAxisKey]).color('type', config.lineColors).shape('circle').size(3);
  }
}

function getYAxisColor(colors, rawData, yIndex) {
  let colorIndex = null;
  // 找到第一个顺序值和数据中yAxis值匹配的index
  rawData.some((d, i) => {
    const dataYAxisIndex = d.yAxis || 0;
    if (dataYAxisIndex === yIndex) {
      colorIndex = i;
      return true;
    }
  });

  if (colorIndex !== null) {
    return colors[colorIndex];
  }
}

function getLegendNode(target){
  if(target.tagName === 'LI') return target;
  else return target.parentNode;
}
