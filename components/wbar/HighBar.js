'use strict';

import Highcharts from 'highcharts'; // 暂时使用highcharts
import Base from '../chartCommon/highBase';
import COLORS from '../chartCommon/colors';
import merge from '../utils/merge';
import { colors, fonts } from '../variables';
import './index.scss';

Highcharts.setOptions({ global: { useUTC: false } }); // 不使用HC内置时区设置
const dateFormat = Highcharts.dateFormat;

class Bar extends Base {
  constructor(selector, options) {
    super(selector, options);
    const defaultOptions = {
      legend: {
        nameFormatter: null // 可以强制覆盖，手动设置label
      },
      tooltip: {
        titleFormatter: null,
        nameFormatter: null,
        valueFormatter: null
      },
      clickable: false,
      column: true,
      grid: false,
      // 以上不支持热更新
      colors: COLORS,
      stack: false,
      padding: [12, 0, 12, 0],
      labels: false,
      xAxis: {
        labelFormatter: null, // 可以强制覆盖，手动设置label
        // tooltipFormatter: null, //手动设置tooltip上X值的格式
        min: null,
        max: null
      },
      yAxis: {
        labelFormatter: null, // 可以强制覆盖，手动设置label
        // tooltipFormatter: null, //手动设置tooltip上Y值的格式
        min: null,
        max: null,
        guideLine: false
      }
    };
    this.options = merge({}, defaultOptions, this.options);
    this.init();
  }
  init() {
    let dom = '';
    if (this.options.legend) {
      dom = `
        <div class="p2c-legend"></div>
        <div class="p2c-box"></div>
      `;
    } else {
      dom = '<div class="p2c-box"></div>';
    }
    this.element.classList.add('p2c');
    this.element.classList.add('p2c-bar');
    this.element.innerHTML = dom;

    // 触发一次渲染
    this.render();
  }
  destroy() {
    super.destroy();
    this.chart && this.chart.destroy();
  }
  // setData (data, sync){
  //   super.setData(data, false);

  //   sync = sync === undefined ? true : sync;
  //   if(sync) this.render();
  // }
  render() {
    // let titleNode = this.element.querySelector('.p2c-title');
    const boxNode = this.element.querySelector('.p2c-box');
    const legendNode = this.element.querySelector('.p2c-legend');

    // 位置计算
    // this.element.style.padding = this.options.padding + 'px';
    boxNode.style.top = `${this.options.padding[0] + (legendNode ? 20 : 8)}px`; // 此处没有计算margin，默认为20
    boxNode.style.left = `${this.options.padding[3]}px`;
    boxNode.style.right = `${this.options.padding[1]}px`;
    boxNode.style.bottom = `${this.options.padding[2]}px`;
    // boxNode.style.bottom = this.options.padding + (legendNode ? legendNode.offsetHeight : 0 ) + 20 + 'px'; //此处没有计算margin,默认为20
    // legendNode.style.bottom = this.options.padding + 'px';
    if (legendNode) {
      legendNode.style.top = `${this.options.padding[0]}px`;
      if (this.options.legend.align === 'right') {
        legendNode.style.right = `${this.options.padding[1]}px`;
      } else {
        legendNode.style.left = `${this.options.padding[3]}px`;
      }
    }

    // 标题
    // if(titleNode){
    //   titleNode.querySelector('h4').innerHTML = this.options.title;
    //   titleNode.querySelector('h5').innerHTML = this.options.subTitle;
    // }

    // 图表
    const data = this.data.concat(); // 复制一个数组，浅复制
    // if(this.options.stacking) data.reverse();

    if (this.data.length) {
      const options = getHCOptions(this.options, data);
      // 加入事件触发
      const self = this;
      options.plotOptions.series.point.events.click = function () {
        if (!self.options.clickable) return;
        self.fire('click', { target: self, point: { x: this.x, y: this.y, xName: this.name }, name: this.series.name }); // 抛出外部处理
      };

      if (!this.chart) {
        data.forEach((item, index) => {
          // let colorIndex = this.options.stacking ? data.length - 1 - index : index;
          options.series.push({
            type: this.options.column ? 'column' : 'bar',
            data: item.data,
            color: this.options.colors[index],
            name: item.name
          });
        });
        this.chart = Highcharts.chart(boxNode, options);
      } else {
        data.forEach((item, index) => {
          // let colorIndex = this.options.stacking ? data.length - 1 - index : index;
          const colorIndex = index;
          if (this.chart.series[index]) {
            this.chart.series[index].setData(item.data, false);
            this.chart.series[index].color = this.options.colors[colorIndex];
            this.chart.series[index].name = item.name;
          } else {
            this.chart.addSeries({
              type: this.options.column ? 'column' : 'bar',
              data: item.data,
              color: this.options.colors[colorIndex],
              name: item.name
            });
          }
        });
        // 倒序循环remove
        for (let i = this.chart.series.length - 1; i > 0; i--) {
          if (!data[i]) {
            this.chart.series[i].remove(false);
          }
        }
        // if(this.chart.xAxis && this.chart.xAxis[0]) this.chart.xAxis[0].setCategories(getLabels(this.options, data), false); //更新可能的x轴
        if (this.chart.xAxis[0]) this.chart.xAxis[0].update(options.xAxis, false);
        if (this.chart.yAxis[0]) this.chart.yAxis[0].update(options.yAxis, false);
        this.chart.redraw(false);
      }
    }

    // 图例 TODO性能优化
    if (this.data.length) {
      if (legendNode) {
        legendNode.innerHTML = getLegend(legendNode, this.options, data);
        Array.prototype.forEach.call(legendNode.querySelectorAll('li'), (item) => {
          item.addEventListener('click', (e) => {
            const node = getLegendNode(e.target);
            if (isLastVisbleLegendNode(legendNode) && !node.classList.contains('p2c-legend-hidden')) return;
            const id = node.getAttribute('data-id');
            if (node.classList.toggle('p2c-legend-hidden')) {
              if (this.chart.series[id]) this.chart.series[id].setVisible(false, false);
            } else if (this.chart.series[id]) this.chart.series[id].setVisible(true, false);
            this.chart.redraw(false);
          });
        });
      }
    }

    // 检查图表容器是否变化，是否需要调整大小
    if (this._size) {
      if (this._size[0] !== boxNode.offsetWidth || this._size[1] !== boxNode.offsetHeight) this.chart && this.chart.reflow();
    }
    this._size = [boxNode.offsetWidth, boxNode.offsetHeight]; // 记录本次尺寸
  }
}

function getLegend(node, options, data) {
  const ret = [];
  const legends = node.querySelectorAll('li');
  data.forEach((item, i) => {
    const style = item.data && item.data.length ? '' : 'display:none;';
    const clsName = legends[i] && legends[i].classList.contains('p2c-legend-hidden') ? 'p2c-legend-hidden' : '';
    let name = item.name && !item.name.match(/data\d+/) ? item.name : `柱${i + 1}`;
    if (options.legend.nameFormatter) {
      name = options.legend.nameFormatter(name, { ...item, color: options.colors[i] }, i);
    }
    ret.push(`<li data-id="${i}" style="${style}" class="${clsName}"><i style="background-color:${options.colors[i]}"></i><span>${name}</span></li>`);
  });
  return `<ul>${ret.join('')}</ul>`;
}

function getLegendNode(target) {
  if (target.tagName === 'LI') return target;
  return target.parentNode;
}

function isLastVisbleLegendNode(node) {
  const legends = node.querySelectorAll('li');
  const hideLegends = node.querySelectorAll('li.p2c-legend-hidden');
  return legends.length - hideLegends.length <= 1;
}

function getLabels(options, data) {
  let ret = options.xAxis.categories;
  if (!ret && data[0] && data[0].data && Array.isArray(data[0].data[0])) {
    ret = [];
    data[0].data.forEach((item) => {
      ret.push(item[0] || '');
    });
  }
  return ret;
}

// highcharts 配置
function getHCOptions(options, data) {
  function xFormat(value) {
    // 自定义处理逻辑优先
    if (options.xAxis.labelFormatter) return options.xAxis.labelFormatter(value);
    return value;
  }
  function yFormat(value) {
    if (options.yAxis.labelFormatter) return options.yAxis.labelFormatter(value);
    return value;
  }
  function thFormat(value) {
    // 自定义处理逻辑优先
    if (options.tooltip.titleFormatter) return options.tooltip.titleFormatter(value);
    return xFormat(value);
  }
  function tNameFormat(value, data, index, record) {
    // 自定义处理逻辑优先
    if (options.tooltip.nameFormatter) return options.tooltip.nameFormatter(value, data, index, record);
    return value;
  }
  function tValueFormat(value, data, index, record) {
    // 自定义处理逻辑优先
    if (options.tooltip.valueFormatter) return options.tooltip.valueFormatter(value, data, index, record);
    return value;
  }
  function labelsFormatter(value) {
    if (options.labels.labelFormatter) return options.labels.labelFormatter(value);
    return value;
  }
  const categories = getLabels(options, data);

  return {
    chart: {
      plotBackgroundColor: null,
      plotBorderWidth: null,
      plotShadow: false,
      marginTop: 10,
      spacing: [0, 0, 0, 0],
      backgroundColor: false,
      zoomType: options.zoom ? 'x' : false,
      events: {}
    },
    credits: false,
    exporting: false,
    title: false,
    tooltip: {
      enabled: !!options.tooltip,
      shared: true,
      useHTML: true,
      backgroundColor: 'rgba(255, 255, 255, 0)',
      borderColor: 'rgba(255, 255, 255, 0)',
      shadow: false,
      formatter() {
        const p = this.points;
        let ret = `<h5>${thFormat(p[0].key)}</h5>`;
        ret += '<ul>';
        p.forEach((item, i) => {
          ret += `<li><i style="background:${item.series.color}"></i>${tNameFormat(item.series.name, item.series, i, item)} <span>${tValueFormat(item.y, item.series, i, item)}</span></li>`;
        });
        ret += '</ul>';
        return ret;
      }
    },
    legend: false,
    xAxis: {
      title: {
        enabled: false
      },
      crosshair: options.tooltip
        ? {
          color: '#dddddd',
          width: 1,
          zIndex: 6
        }
        : false,
      lineWidth: 1,
      type: options.xAxis.type, // 此处依赖options设置
      gridLineWidth: options.grid ? 1 : 0,
      gridLineColor: colors.colorFill12,
      tickPixelInterval: 70,
      lineColor: colors.colorLine12,
      tickLength: 0,
      labels: {
        formatter() {
          return xFormat(this.value);
        },
        style: { fontFamily: fonts.fontFamilyBase, fontSize: fonts.fontSizeBaseBody1, color: '#989898' }
      },
      minPadding: 0,
      // endOnTick: false,
      // startOnTick: true,
      allowDecimals: true,
      categories,
      max: options.xAxis.max,
      min: options.xAxis.min
    },
    yAxis: {
      title: {
        enabled: false
      },
      lineWidth: 0,
      lineColor: colors.colorLine12,
      gridLineWidth: 1,
      gridLineColor: colors.colorFill12,
      labels: {
        formatter() {
          return yFormat(this.value);
        },
        style: { fontFamily: fonts.fontFamilyBase, fontSize: fonts.fontSizeBaseBody1, color: '#989898' }
      },
      max: options.yAxis.max,
      min: options.yAxis.min,
      plotLines: options.yAxis.guideLine && plotLinesFormat(options.yAxis.guideLine)
    },
    plotOptions: {
      series: {
        cursor: options.clickable ? 'pointer' : null,
        dataLabels: {
          enabled: !!options.labels,
          shadow: false,
          // inside: false,
          style: { fontFamily: fonts.fontFamilyBase, fontWeight: fonts.fontWeightRegular, fontSize: fonts.fontSizeBaseCaption, color: '#989898' },
          formatter() {
            return labelsFormatter(this.y);
          }
        },
        events: {},
        point: {
          events: {}
        },
        animation: {
          duration: 500
        },
        pointPadding: 0,
        // groupPadding: 0.2,
        maxPointWidth: 74
      },
      column: {
        // animation: false,
        stacking: options.stack ? 'normal' : '',
        borderWidth: 0,
        // pointPadding: 0.2,
        states: {
          hover: {
            brightness: 0
          }
        },
        events: {}
      },
      bar: {
        // animation: false,
        stacking: options.stack ? 'normal' : '',
        borderWidth: 0,
        // pointPadding: 0.2,
        states: {
          hover: {
            brightness: 0
          }
        },
        events: {}
      }
    },
    series: []
  };
}

export default Bar;

function plotLinesFormat(plotLines) {
  if (plotLines && Array.isArray(plotLines)) {
    return plotLines.map(item => ({
      color: item.color || colors.colorF41,
      dashStyle: 'dash',
      value: item.value,
      width: item.width || 1,
      zIndex: 5
    }));
  }
}
