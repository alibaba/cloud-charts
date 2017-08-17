'use strict';

import Base from '../chartCommon/highBase';
import COLORS from '../chartCommon/colors';
import merge from '../utils/merge';
import Highcharts from 'highcharts';//暂时使用highcharts
import './index.scss';

Highcharts.setOptions({
  global:{useUTC: false}, //不使用HC内置时区设置
  lang:{resetZoom: '重置缩放'} //修改zoom文案
});
let dateFormat = Highcharts.dateFormat;

class Line extends Base{
  constructor (selector, options){
    super(selector, options);
    let defaultOptions = {
      legend: {
        nameFormatter: null, //可以强制覆盖，手动设置label
      },
      tooltip: {
        titleFormatter: null,
        nameFormatter: null,
        valueFormatter: null,
      },
      zoom: false,
      clickable: false,
      // type: 'line',
      spline: false,
      area: false,
      grid: false,
      symbol: false,
      stack: false,
      //以上不支持热更新
      colors: COLORS,
      padding: [12, 0, 12, 0],
      mini: false,
      xAxis: {
        type: 'linear', //默认为线性
        dateFormatter: '%m-%d', //上述type为datetime时，此字段生效
        labelFormatter: null, //可以强制覆盖，手动设置label
        // tooltipFormatter: null, //手动设置tooltip上X值的格式
        categories: null,
        max: null,
        min: null,
        lineWidth: 1
      },
      yAxis: {
        labelFormatter: null, //可以强制覆盖，手动设置label
        // tooltipFormatter: null, //手动设置tooltip上Y值的格式
        max: null,
        min: null,
        bgArea: [],
        lineWidth: 0
      }
    };
    this.options = merge({}, defaultOptions, this.options);
    this.init();
  }
  init (){
    var dom = '';
    if(this.options.legend){
      dom = `
        <div class="p2c-legend"></div>
        <div class="p2c-box"></div>
      `;
    }else{
      dom = '<div class="p2c-box"></div>';
    }
    this.element.classList.add('p2c');
    this.element.classList.add('p2c-line');
    this.element.innerHTML = dom;

    //触发一次渲染
    this.render();
  }
  destroy (){
    super.destroy();
    this.chart.destroy();
  }
  render (){
    // let titleNode = this.element.querySelector('.p2c-title');
    let boxNode = this.element.querySelector('.p2c-box');
    let legendNode = this.element.querySelector('.p2c-legend');

    //位置计算
    // this.element.style.padding = this.options.padding + 'px';
    boxNode.style.top = this.options.padding[0] + (legendNode ? 20 : 8 ) + 'px'; //此处没有计算margin，默认为30
    boxNode.style.left = this.options.padding[3] + 'px';
    boxNode.style.right = this.options.padding[1] + 'px';
    boxNode.style.bottom = this.options.padding[2] + 'px';
    //boxNode.style.bottom = this.options.padding + (legendNode ? legendNode.offsetHeight : 0 ) + 20 + 'px'; //此处没有计算margin,默认为20
    //legendNode.style.bottom = this.options.padding + 'px';
    if(legendNode){
      legendNode.style.top = this.options.padding[0] + 'px';
      if(this.options.legend.align === 'right'){
        legendNode.style.right = this.options.padding[1] + 'px';
      }else{
        legendNode.style.left = this.options.padding[3] + 'px';
      }
    }

    //标题
    // if(titleNode){
    //   titleNode.querySelector('h4').innerHTML = this.options.title;
    //   titleNode.querySelector('h5').innerHTML = this.options.subTitle;
    // }

    //图表
    if(this.data.length){
      let options = getHCOptions(this.options, this.data);
      //加入事件触发
      let self = this;
      options.plotOptions.series.point.events.mouseOver = function(){
        self.fire('mouseover', {target: self, point: {x: this.x, y: this.y}});
      };
      options.plotOptions.series.point.events.mouseOut = function(){
        self.fire('mouseover', {target: self});
      };
      options.plotOptions.series.point.events.click = function(){
        if(!self.options.clickable) return;
        // self._tooltip.refresh([this]);
        self.fire('click', {target: self, point: {x: this.x, y: this.y}, name: this.series.name}); //抛出外部处理
      };
      options.chart.events.selection = function(event){
        let e = {target: self};
        if(event.xAxis) e.selection = {min: event.xAxis[0].min, max: event.xAxis[0].max};
        self.fire('selection', e);
        if(self._tooltip) self._tooltip.hide();
      };
      options.xAxis.events.setExtremes = function(event){
        if(event.min === null && event.max === null){
          if(self.chart.resetZoomButton) self.chart.resetZoomButton.hide();
        }else{
          if(!self.chart.resetZoomButton) self.chart.showResetZoom();
          else self.chart.resetZoomButton.show();
        }
      };

      let lineType = 'line';
      if (this.options.area) {
        lineType = 'area';
      }
      if (this.options.spline) {
        lineType = 'spline';
      }
      if (this.options.area && this.options.spline) {
        lineType = 'areaspline';
      }

      if(!this.chart){
        this.data.forEach((item,index)=>{
          options.series.push({
            type: lineType,
            data: item.data,
            color: this.options.colors[index],
            lineColor: this.options.colors[index],
            name: item.name,
            yAxis: item.yAxis || 0
          });
        });
        this.chart = Highcharts.chart(boxNode,options);

        //加入事件绑定，初始化时全局绑定
        this.on('hover', this.hoverHandler);
        this.on('select', this.selectHandler);
        this.on('clickpoint', this.clickpointHandler);
        this.on('visible', this.visibleHandler);

        //首次初始化一个自定义的Tooltip
        if(!this._tooltip) this._tooltip = new Highcharts.Tooltip(this.chart, options.tooltip);

      }else{
        this.data.forEach((item,index)=>{
          if(this.chart.series[index]){
            this.chart.series[index].setData(item.data,false);
            this.chart.series[index].update({
              type: lineType,
              // data: item.data,
              color: this.options.colors[index],
              lineColor: this.options.colors[index],
              name: item.name,
              yAxis: item.yAxis || 0
            }, false);
            // this.chart.series[index].color = this.options.colors[index];
            // this.chart.series[index].lineColor = this.options.colors[index];
            // this.chart.series[index].name = item.name;
            // this.chart.series[index].yAxis = item.yAxis || 0;
          }else{
            this.chart.addSeries({
              type: lineType,
              data: item.data,
              color: this.options.colors[index],
              lineColor: this.options.colors[index],
              name: item.name,
              yAxis: item.yAxis || 0
            });
          }
        });
        //倒序循环remove
        for (let i = this.chart.series.length - 1; i > 0; i--) {
          if (!this.data[i]) {
            this.chart.series[i].remove(false);
          }
        }

        //更新轴信息
        if(this.chart.xAxis[0]) this.chart.xAxis[0].update(options.xAxis, false);
        if (Array.isArray(options.yAxis)) {
          options.yAxis.forEach((y, index) => {
            if (this.chart.yAxis[index]) {
              this.chart.yAxis[index].update(y, false);
            } else {
              this.chart.addAxis(getYAxis(this.options, y, index));
            }
          });
          for (let i = this.chart.yAxis.length - 1; i > 0; i--) {
            if (!options.yAxis[i]) {
              this.chart.yAxis[i].remove(false);
            }
          }
        } else {
          if(this.chart.yAxis[0]) this.chart.yAxis[0].update(options.yAxis, false);
        }

        this.chart.redraw(false);
      }
    }

    //图例 TODO性能优化
    if (this.data.length) {
      if (legendNode) {
        legendNode.innerHTML = getLegend(legendNode, this.options, this.data);
        Array.prototype.forEach.call(legendNode.querySelectorAll('li'), (item) => {
          item.addEventListener('click', (e) => {
            let node = getLegendNode(e.target);
            if (isLastVisbleLegendNode(legendNode) && !node.classList.contains('p2c-legend-hidden')) return;
            let id = node.getAttribute('data-id');
            if (node.classList.toggle('p2c-legend-hidden')) {
              if (this.chart.series[id]) this.chart.series[id].setVisible(false, false);
            } else {
              if (this.chart.series[id]) this.chart.series[id].setVisible(true, false);
            }
            this.chart.redraw(false);
          });
        });
      }
    }

    //检查图表容器是否变化，是否需要调整大小
    if(this._size){
      if(this._size[0] !== boxNode.offsetWidth || this._size[1] !== boxNode.offsetHeight) this.chart && this.chart.reflow();
    }
    this._size = [boxNode.offsetWidth, boxNode.offsetHeight];//记录本次尺寸
  }

  hoverHandler(e) {
    if(e.target === this) return; //防止循环触发
    let x = e.xAxis;
    if(!x && e.point) x = e.point.x;
    if(x){
      let arr = [];
      this.chart.series.forEach((item)=>{
        item.data.forEach((data)=>{
          if(data.x === x){
            arr.push(data);
            this.chart.xAxis[0] && this.chart.xAxis[0].drawCrosshair(false,data);
          }
        });
      });
      if(this.chart.tooltip && arr[0]) this.chart.tooltip.refresh(arr);
      else this._tooltip && this._tooltip.hide();
    }else{
      this.chart.xAxis[0] && this.chart.xAxis[0].hideCrosshair();
      this.chart.tooltip && this.chart.tooltip.hide();
    }
  }

  clickpointHandler(e) {
    if(e.point){
      let arr = [];
      this.chart.series.forEach((item)=>{
        item.data.forEach((data)=>{
          if(data.x === e.point.x && data.y === e.point.y){
            arr.push(data);
            data.select();
          }
        });
      });
      if(this._tooltip && arr[0]) this._tooltip.refresh(arr);
      else this._tooltip && this._tooltip.hide();
    }else{
      this._tooltip && this._tooltip.hide();
    }
  }

  selectHandler(e) {
    if(e.target === this) return; //防止循环触发
    if(!this.options.zoom) return; //不可选区的图表排除
    if(this.chart.xAxis || this.chart.xAxis[0]){
      if(e.selection){
        this.chart.xAxis[0].setExtremes(e.selection.min, e.selection.max);
        //if(!this.chart.resetZoomButton) this.chart.showResetZoom();
        //else this.chart.resetZoomButton.show();
      }else{
        this.chart.xAxis[0].setExtremes(null,null);
        //if(this.chart.resetZoomButton) this.chart.resetZoomButton.hide();
      }
    }
  }

  visibleHandler(e) {
    if(e.target === this) return; //防止循环触发
    if(this.options.legend) return; //无图例模式下可用
    let series = e.series;
    if(!series) return;
    series.forEach((s,i)=>{
      if(s){
        if(this.chart.series[i]) this.chart.series[i].setVisible(true,false);
      }else{
        if(this.chart.series[i]) this.chart.series[i].setVisible(false,false);
      }
    });
    this.chart.redraw(false);
  }
}

function getLegend(node, options, data){
  let ret = [];
  let legends = node.querySelectorAll('li');
  data.forEach((item, i)=>{
    let style = (item.data && item.data.length) ? '' : 'display:none;';
    let clsName = (legends[i] && legends[i].classList.contains('p2c-legend-hidden')) ? 'p2c-legend-hidden' : '';
    let name = (item.name && !item.name.match(/data\d+/)) ? item.name : '线'+(i+1);
    if (options.legend.nameFormatter) {
      name = options.legend.nameFormatter(name, { ...item, color: options.colors[i] }, i);
    }
    ret.push('<li data-id="'+i+'" style="'+style+'" class="'+clsName+'"><i style="background-color:'+options.colors[i]+'"></i><span>' + name + '</span></li>');
  });
  return '<ul>' + ret.join('') + '</ul>';
}

function getLegendNode(target){
  if(target.tagName === 'LI') return target;
  else return target.parentNode;
}

function isLastVisbleLegendNode(node){
  let legends = node.querySelectorAll('li');
  let hideLegends = node.querySelectorAll('li.p2c-legend-hidden');
  return (legends.length - hideLegends.length <= 1);
}

//highcharts 配置
function getHCOptions(options, data){
  function xFormat(value){
    //自定义处理逻辑优先
    if(options.xAxis.labelFormatter) return options.xAxis.labelFormatter(value);
    //默认处理逻辑
    if(options.xAxis.type === 'datetime'){
      return dateFormat(options.xAxis.dateFormatter, value);
    }else{
      return value;
    }
  }
  function thFormat(value){
    //自定义处理逻辑优先
    if(options.tooltip.titleFormatter) return options.tooltip.titleFormatter(value);
    return xFormat(value);
  }
  function tNameFormat(value, data, index, record) {
    //自定义处理逻辑优先
    if(options.tooltip.nameFormatter) return options.tooltip.nameFormatter(value, data, index, record);
    return value;
  }
  function tValueFormat(value, data, index, record) {
    //自定义处理逻辑优先
    if(options.tooltip.valueFormatter) return options.tooltip.valueFormatter(value, data, index, record);
    return value;
  }

  const config = {
    chart: {
      plotBackgroundColor: null,
      plotBorderWidth: null,
      plotShadow: false,
      marginTop: 10,
      // marginRight: 15,
      spacing: [0,0,0,0],
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
      crosshairs: {
        color: '#dddddd',
        width: !!options.tooltip ? 1 : 0
      },
      formatter: function(){
        let p = this.points;
        let ret = '<h5>' + thFormat(p[0].key) + '</h5>';
        ret += '<ul>';
        p.forEach((item,i)=>{
          ret += '<li><i style="background:'+item.series.color+'"></i>'+ tNameFormat(item.series.name, item.series, i, item) + ' <span>' + tValueFormat(item.y, item.series, i, item) + '</span></li>';
        });
        ret += '</ul>';
        return ret;
      },
      useHTML: true,
      backgroundColor: 'rgba(255, 255, 255, 0)',
      borderColor: 'rgba(255, 255, 255, 0)',
      shadow: false
    },
    legend: false,
    xAxis: {
      title: {
        enabled: false
      },
      // crosshairs: {
      //   color: '#dddddd',
      //   width: 1//
      // },
      lineWidth: 1,
      type: options.xAxis.type, //此处依赖options设置
      gridLineWidth: options.grid ? 1 : 0,
      gridLineColor: '#F2F3F7',
      tickPixelInterval:70,
      lineColor: '#DCDEE3',
      tickLength: 0,
      labels: {
        y: 20,
        formatter: function () {
          return xFormat(this.value);
        },
        style: {'fontFamily': '"Helvetica Neue", Helvetica, Arial, sans-serif, "PingFang SC", "Microsoft Yahei"','fontSize':'12px','color':'#989898'}
      },
      minPadding: 0,
      categories: options.xAxis.categories,
      //endOnTick: true,
      //startOnTick: false,
      allowDecimals: true,
      max: options.xAxis.max,
      min: options.xAxis.min,
      visible: !options.mini,
      events: {}
    },
    // yAxis: {
    //   title: {
    //     enabled: false
    //   },
    //   lineWidth: 0,
    //   lineColor: '#DCDEE3',
    //   gridLineWidth: 1,
    //   gridLineColor: '#F2F3F7',
    //   tickPixelInterval:40,
    //   labels: {
    //     x: -8,
    //     formatter: function () {
    //       return yFormat(this.value);
    //     },
    //     style: {'fontFamily': '"Helvetica Neue", Helvetica, Arial, sans-serif, "PingFang SC", "Microsoft Yahei"','fontSize':'12px','color':'#989898'}
    //   },
    //   max: options.yAxis.max,
    //   min: options.yAxis.min,
    //   plotBands: options.yAxis.bgArea.length === 2 ? {
    //     from: options.yAxis.bgArea[0],
    //     to: options.yAxis.bgArea[1],
    //     color: 'rgba(5,128,242,0.1)',
    //   } : null
    // },
    plotOptions: {
      line: {
        //animation: false,
        //stacking: 'normal',
        lineWidth: 2,
        animation: {
          duration: 500
        },
        marker: {
          enabled: true,
          symbol: 'circle',
          radius: options.symbol? 2 : 0,
          lineColor: null,
          states: {
            hover: {
              lineWidthPlus: 0,
              radiusPlus: 0,
              fillColor: 'rgba(255,255,255,1)',
              lineWidth: 2,
              radius: 3.5,
              enabled: options.clickable || options.tooltip
            },
            select: {
              lineWidthPlus: 0,
              radiusPlus: 0,
              fillColor: null,
              lineColor: null,
              lineWidth: 2,
              radius: 3.5,
              enabled: options.clickable
            }
          }
        },
        states: {
          hover: {
            lineWidthPlus: 0,
            halo: {
              size: 0
            }
          }
        }
      },
      spline: {
        lineWidth: 2,
        marker: {
          enabled: true,
          symbol: 'circle',
          radius: 0.1, //不能设置为0，否则select状态会有问题
          lineColor: null,
          states: {
            hover: {
              lineWidthPlus: 0,
              radiusPlus: 0,
              fillColor: 'rgba(255,255,255,1)',
              lineWidth: 2,
              radius: 3.5,
              enabled: options.clickable || options.tooltip
            },
            select: {
              lineWidthPlus: 0,
              radiusPlus: 5,
              fillColor: null,
              lineColor: null,
              lineWidth: 2,
              radius: 3.5,
              enabled: options.clickable
            }
          }
        },
        states: {
          hover: {
            lineWidthPlus: 0,
            halo: {
              size: 0
            }
          }
        }
      },
      area: {
        //animation: false,
        //stacking: 'normal',
        lineWidth: 2,
        fillOpacity: 0.1,
        stacking: options.stack ? 'normal' : null,
        marker: {
          enabled: true,
          symbol: 'circle',
          radius: options.symbol? 2 : 0,
          lineColor: null,
          states: {
            hover: {
              lineWidthPlus: 0,
              radiusPlus: 0,
              fillColor: 'rgba(255,255,255,1)',
              lineWidth: 3,
              radius: 4,
              enabled: options.clickable || options.tooltip
            },
            select: {
              lineWidthPlus: 0,
              radiusPlus: 0,
              fillColor: null,
              lineColor: null,
              lineWidth: 3,
              radius: 4,
              enabled: options.clickable
            }
          }
        },
        states: {
          hover: {
            lineWidthPlus: 0,
            halo: {
              size: 0
            }
          }
        }
      },
      areaspline: {
        lineWidth: 2,
        fillOpacity: 0.1,
        stacking: options.stack ? 'normal' : null,
        marker: {
          enabled: true,
          symbol: 'circle',
          radius: options.symbol? 2 : 0,
          lineColor: null,
          states: {
            hover: {
              lineWidthPlus: 0,
              radiusPlus: 0,
              fillColor: 'rgba(255,255,255,1)',
              lineWidth: 2,
              radius: 3.5,
              enabled: options.clickable || options.tooltip
            },
            select: {
              lineWidthPlus: 0,
              radiusPlus: 0,
              fillColor: null,
              lineColor: null,
              lineWidth: 2,
              radius: 3.5,
              enabled: options.clickable
            }
          }
        },
        states: {
          hover: {
            lineWidthPlus: 0,
            halo: {
              size: 0
            }
          }
        }
      },
      series: {
        cursor: options.clickable ? 'pointer' : null,
        allowPointSelect: options.clickable,
        point: {
          events: {}
        }
      }
    },
    series: []
  };

  // let ttFormat = null;

  if (Array.isArray(options.yAxis)) {
    config.yAxis = options.yAxis.map(getYAxis.bind(null, options, data));
    config.xAxis.endOnTick = true;
    config.xAxis.maxPadding = 0;
  } else {
    config.yAxis = getYAxis(options, data, options.yAxis);
  }

  return config;
}

function getYAxis(options, data, yAxis, index) {
  function yFormat(value){
    //自定义处理逻辑优先
    if(yAxis.labelFormatter) return yAxis.labelFormatter(value);
    return value;
  }
  return {
    visible: !options.mini,
    title: {
      enabled: false
    },
    lineWidth: index === undefined ? yAxis.lineWidth : (yAxis.lineWidth || 1),
    lineColor: index === undefined ? '#DCDEE3' : getYAxisColor(options, data, index),
    gridLineWidth: 1,
    gridLineColor: '#F2F3F7',
    tickPixelInterval:40,
    opposite: !!index,
    labels: {
      x: index ? 8 : -8,
      formatter: function () {
        return yFormat(this.value);
      },
      style: {'fontFamily': '"Helvetica Neue", Helvetica, Arial, sans-serif, "PingFang SC", "Microsoft Yahei"','fontSize':'12px','color':'#989898'}
    },
    max: yAxis.max,
    min: yAxis.min,
    plotBands: (yAxis.bgArea && yAxis.bgArea.length === 2) ? {
      from: yAxis.bgArea[0],
      to: yAxis.bgArea[1],
      color: 'rgba(5,128,242,0.1)',
    } : null
  };
}

function getYAxisColor(options, data, index) {
  let colorIndex = null;
  //找到第一个顺序值和数据中yAxis值匹配的index
  data.some((d, i) => {
    const dataYAxisIndex = d.yAxis || 0;
    if (dataYAxisIndex === index) {
      colorIndex = i;
      return true;
    }
  });

  if (colorIndex !== null) {
    return options.colors[colorIndex];
  } else {
    return '#DCDEE3'
  }
}

export default Line;
