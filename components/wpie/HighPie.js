'use strict';

import Base from '../chartCommon/highBase';
import COLORS from '../chartCommon/colors';
import merge from '../utils/merge';
import Highcharts from 'highcharts';//暂时使用highcharts
import './index.scss';

Highcharts.setOptions({global:{useUTC: false}});//不使用HC内置时区设置
let dateFormat = Highcharts.dateFormat;

class Pie extends Base{
  constructor (selector, options){
    super(selector, options);
    let defaultOptions = {
      cycle: false,
      tooltip: {
        nameFormatter: null,
        valueFormatter: null,
      },
      clickable: false,
      //以上不支持热更新
      colors: COLORS,
      padding: 40,
      legend: {
        labelFormatter: null, //可以强制覆盖，手动设置label
      }
    };
    this.options = merge({}, defaultOptions, this.options);
    this.init();
  }
  init (){
    var dom = '';
    if(this.options.legend){
      dom = `
        <div class="p2c-legend"><ul></ul></div>
        <div class="p2c-box"></div>
      `;
    }else{
      dom = '<div class="p2c-box"></div>';
    }
    this.element.classList.add('p2c');
    this.element.classList.add('p2c-pie');
    this.element.innerHTML = dom;

    //触发一次渲染
    this.render();
  }
  destroy (){
    super.destroy();
    this.chart.destroy();
  }
  render() {
    // let titleNode = this.element.querySelector('.p2c-title');
    let boxNode = this.element.querySelector('.p2c-box');
    let legendNode = this.element.querySelector('.p2c-legend');

    //位置计算
    // let titleHeight = titleNode ? titleNode.offsetHeight : 0;
    let boxHeight = this.element.offsetHeight - this.options.padding * 2;
    let boxWidth = this.element.offsetWidth - this.options.padding * 2;
    let diameter = boxHeight < boxWidth ? boxHeight * 0.84 : boxWidth * 0.84;

    this.element.style.padding = this.options.padding + 'px';

    if(!this.options.legend){//单图不计算位置
      boxNode.style.top = this.options.padding + 'px';
      boxNode.style.bottom = this.options.padding + 'px';
      boxNode.style.left = this.options.padding + 'px';
      boxNode.style.right = this.options.padding + 'px';
    }else{
      boxNode.style.width = diameter + 'px';
      boxNode.style.height = diameter + 'px';
      boxNode.style.top = this.options.padding + 'px';
      boxNode.style.left = this.options.padding + boxWidth * 0.05 + 'px';
    }

    if(legendNode){
      legendNode.style.top = this.options.padding + 'px';
      legendNode.style.left = this.options.padding + diameter + boxWidth * 0.05 * 2 + 'px';
      if(legendNode.querySelector('ul')) legendNode.querySelector('ul').style.height = diameter + 'px';
    }

    //标题
    // if(titleNode){
    //   titleNode.querySelector('h4').innerHTML = this.options.title;
    //   titleNode.querySelector('h5').innerHTML = this.options.subTitle;
    // }

    //图表
    let data = this.data;
    if(this.data.length){

      let options = getHCOptions(this.options, data);
      //事件绑定
      let self = this;
      options.plotOptions.series.point.events.click = function(){
        if(!self.options.clickable) return;
        self.fire('click', {target: self, point: {x: this.x, y: this.y, xName: this.name}, name: this.series.name}); //抛出外部处理
      };

      if(!this.chart){
        data.forEach((item,index)=>{
          options.series.push({
            type: 'pie',
            data: item.data,
            name: item.name
          });
        });
        this.chart = Highcharts.chart(boxNode,options);
      }else{
        data.forEach((item,index)=>{
          if(this.chart.series[index]){
            this.chart.series[index].setData(item.data,false);
            this.chart.series[index].name = item.name;
          }else{
            this.chart.addSeries({
              type: 'pie',
              data: item.data,
              name: item.name
            });
          }
        });
        //倒序循环remove
        for (let i = this.chart.series.length - 1; i > 0; i--) {
          if (!data[i]) {
            this.chart.series[i].remove(false);
          }
        }
        this.chart.redraw();
      }
    }

    //图例 暂时仅支持单列数据
    if(this.data.length && legendNode){
      legendNode.querySelector('ul').innerHTML = getLegend(legendNode, this.options, data);
    }

    //检查图表容器是否变化，是否需要调整大小
    if(this._size){
      if(this._size[0] !== boxNode.offsetWidth || this._size[1] !== boxNode.offsetHeight) this.chart && this.chart.reflow();
    }
    this._size = [boxNode.offsetWidth, boxNode.offsetHeight];//记录本次尺寸

  }
}

function getLegend(dom, options, data){

  function labelFormatter(value){
    //自定义处理逻辑优先
    if(options.legend && options.legend.labelFormatter) return options.legend.labelFormatter(value, dateFormat);
    //默认处理逻辑
    else return value;
  }

  let ret = [];
  let legends = dom.querySelectorAll('li');
  data[0].data.forEach((item, i)=>{
    let name = Array.isArray(item) ? item[0] : '区域'+(i+1);
    let value = labelFormatter(Array.isArray(item) ? item[1] : item);
    ret.push('<li data-id="'+i+'"><i style="background-color:'+options.colors[i]+'"></i><b>' + name + '</b><span>' + value + '</span></li>');
  });
  return ret.join('');
}

//highcharts 配置
function getHCOptions(options, data){

  function labelFormatter(value){
    //自定义处理逻辑优先
    if( options.legend && options.legend.labelFormatter) return options.legend.labelFormatter(value, dateFormat);
    //默认处理逻辑
    else return value;
  }

  function tNameFormat(value) {
    //自定义处理逻辑优先
    if(options.tooltip && options.tooltip.nameFormatter) return options.tooltip.nameFormatter(value, dateFormat);
    return value;
  }
  function tValueFormat(value) {
    //自定义处理逻辑优先
    if(options.tooltip && options.tooltip.valueFormatter) return options.tooltip.valueFormatter(value, dateFormat);
    return value;
  }

  return {
    chart: {
      plotBackgroundColor: null,
      plotBorderWidth: null,
      plotShadow: false,
      //marginTop: 0,
      spacing: [0,0,0,0],
      backgroundColor: false
    },
    credits: false,
    exporting: false,
    title: false,
    tooltip: {
      enabled: !!options.tooltip,
      //followPointer: false,
      useHTML: true,
      backgroundColor: 'rgba(255, 255, 255, 0)',
      borderColor: 'rgba(255, 255, 255, 0)',
      shadow: false,
      formatter: function(){
        let ret = '<ul>';
          ret += '<li><i style="background:'+this.color+'"></i>'+tNameFormat(this.key)+'<span>'+tValueFormat(this.y)+'</span></li>';
        ret += '</ul>';
        return ret;
      }
    },
    legend: false,
    plotOptions: {
      series: {
        cursor: options.clickable ? 'pointer' : null,
        events: {},
        point: {
          events: {}
        },
        animation: {
          duration: 500
        }
      },
      pie: {
        dataLabels: false,
        slicedOffset: 0,
        size: '100%',
        innerSize: options.cycle ? '66%' : 0,
        states: {
          hover: {enabled:false}
        },
        borderWidth: 0,
        colors: options.colors
      }
    },
    series: []
  }
}

export default Pie;
