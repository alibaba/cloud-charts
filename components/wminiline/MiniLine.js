'use strict';

import Base from '../chartCommon/base';
import merge from '../utils/merge';
import Draw from './draw';

class MiniLine extends Base{
  constructor (selector, options){
    super(selector, options);
    let defaultOptions = {
      spline: false,
      area: false,
      interactive: false,
      max: null,
      min: null,
      padding: [8,6,8,6],
      color: '#389BFF',
      areaColor: 'rgba(56,155,255,0.2)'
    };
    this.options = merge({}, defaultOptions, this.options);
    this.init();
  }
  init(){
    let dom = '<div class="p2c-box"></div>';
    this.element.classList.add('p2c');
    this.element.classList.add('p2c-miniline');
    this.element.innerHTML = dom;

    //触发一次渲染
    this.render();
  }

  render(){

    let dom = this.element.querySelector('.p2c-box');
    let domSize = [dom.clientWidth, dom.clientHeight];

    let padding = this.options.padding;

    let data = [];
    if(this.data[0] && this.data[0].data) data = this.data[0].data; //只取第一条线
    if(data.length > 1){//对data进行处理，转换成有序且画布坐标系点
      let extreme = getExtreme(data);
      let max = this.options.max || extreme.max,
          min = this.options.min || extreme.min;
      let xInterval = (domSize[0] - padding[1] - padding[3]) / (data.length - 1), //x轴计算每一个点等间距
          yInterval = (domSize[1] - padding[0] - padding[2]) / (max - min); //y轴计算每一份数值多少距离
      let xo = padding[3], yo = padding[0]; //计算基准点
      if(max === min){//特殊情况:所有值都一样
        yInterval = 1; //这个值最终会乘以0，所以随便设置，只要不是NaN
        yo = (domSize[1] - padding[0] - padding[2]) / 2 + padding[0]; //基准点垂直居中
      }
      let points = [];
      data.forEach((item,i)=>{
        let vx = item[0], vy = item[1];
        let x = i * xInterval + xo;
        let y = (max - vy) * yInterval + yo;
        points.push([x,y]);
      });
      //console.log(points);
      //进行渲染
      if(!this.draw){
        this.draw = new Draw(dom, domSize,
          {
            spline: this.options.spline,
            active: this.options.interactive,
            onMouseOver: (e)=>{
              this.fire('mouseover', {
                point: {
                  x: this.data[0].data[e.index][0],
                  y: this.data[0].data[e.index][1]
                },
                position: {
                  x: e.point[0],
                  y: e.point[1]
                },
                target: this
              });
            }
          }
        );
      }
      this.draw.setSize(domSize); //调整大小
      if(this.options.area) this.draw.area(points, {color: this.options.color, areaColor: this.options.areaColor});
      else this.draw.line(points, {color: this.options.color});
    }

  }
}

function getExtreme(points){
  let max = null, min = null;
  points.forEach((item)=>{
    if(max === null || max < item[1]) max = item[1];
    if(min === null || min > item[1]) min = item[1];
  });
  return {max: max, min: min}
}

export default MiniLine;
// module.exports = MiniLine; //为了UMD包只能这么暴露