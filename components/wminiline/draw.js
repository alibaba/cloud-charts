'use strict';

import isEqual from '../utils/isEqual';
import SVG from '../chartCommon/svg';

class Draw{
  constructor(dom, size, options){
    this.options = options || {};
    this.points = [];
    this.size = size;
    this.spline = !!this.options.spline;

    this.type = '';
    //初始化画布
    this.svg = SVG(dom);
    this.point = null;
    this.lineColor = null;

    this.activePoint = null;

    this.svg.on('mousemove',(e) => {
      if(this.options.active){
        let sp = closetPoint(this.points, e.layerX);

        if(!isEqual(this.activePoint, sp.point)){
          this.active(sp.point);
          this.options.onMouseOver({point: sp.point, index: sp.index});
        }
      }
    });

    this.svg.on('mouseleave',(e)=>{
      if(this.point){
        this.point.remove();
        this.point = null;
        this.activePoint = null;
      }
    })

  }
  active(point){
    if(!this.point){
      this.point = this.svg.circle(9);
      this.point.fill('#fff').stroke({color: this.lineColor, width: 2});
    }
    this.point.center(point[0],point[1]);
    this.activePoint = point;
    return this;
  }
  line(points, styles){
    this.type = 'line';
    //画线前检查是否需要重绘
    if(isEqual(points, this.points)) return this;
    else this.points = points;
    this.clear();

    let pathString = this.spline ? pathSplineMaker(this.points) : pathLineMaker(this.points);

    this.svg.path(pathString)
        .stroke({color: styles.color, width: 2, linecap: 'round', linejoin: 'round'})
        .fill('none');

    this.lineColor = styles.color;
    
    return this;
  }
  area(points, styles){
    this.type = 'area';
    //画线前检查是否需要重绘
    if(isEqual(points, this.points)) return this;
    else this.points = points;
    this.clear();

    let linePathString = this.spline ? pathSplineMaker(this.points) : pathLineMaker(this.points);
    let areaPathString = linePathString + ' V ' + this.size[1] + ' H ' + points[0][0] + ' Z';
    
    this.svg.path(linePathString)
      .stroke({color: styles.color, width: 2, linecap: 'round', linejoin: 'round'})
      .fill('none');
    
    this.svg.path(areaPathString)
      .stroke({})
      .fill(styles.areaColor);
    
    this.lineColor = styles.color;

    return this;
  }
  addPoints(points){
  }
  setSize(size){
    this.size = size;
    this.svg.size(size[0], size[1]);
    return this;
  }
  clear(){
    this.svg.clear();
    return this;
  }
}

function pathLineMaker(p){
  if(p.length <= 1) return '';
  let path = 'M ' + p[0].join(' ');
  for(var i = 1; i < p.length; i++){
    path += ' L ' + p[i-1].join(' ') + ' ' + p[i].join(' ');
  }
  return path;
}

function pathSplineMaker(p){
  if(p.length <= 1) return '';
  if(p.length === 2) return 'M ' + p[0].join(' ') + ' L ' + p[0].join(' ') + ' ' + p[1].join(' ');
  let path = 'M ' + p[0].join(' ');
  let tmp = [];
  for(var i = 1; i < p.length; i++){
    if(!p[i+1]){//其实就是最后一个点的情况
      path += ' Q ' + tmp.join(' ') + ' ' + p[i].join(' ');
      break;
    }
    let cp = getControlPoints(p[i-1][0],p[i-1][1],p[i][0],p[i][1],p[i+1][0],p[i+1][1]);
    if(i === 1){
      path += ' Q ' + [cp[0],cp[1],p[i][0],p[i][1]].join(' ');
    }else{
      path += ' C ' + [tmp[0],tmp[1],cp[0],cp[1],p[i][0],p[i][1]].join(' ');
    }
    tmp = [cp[2], cp[3]];
  }
  return path;
}

function getControlPoints(x0,y0,x1,y1,x2,y2){
  var d01=Math.sqrt(Math.pow(x1-x0,2)+Math.pow(y1-y0,2));
  var d12=Math.sqrt(Math.pow(x2-x1,2)+Math.pow(y2-y1,2));
  var fa=0.5*d01/(d01+d12);   // scaling factor for triangle Ta
  var fb=0.5*d12/(d01+d12);   // ditto for Tb, simplifies to fb=t-fa
  var p1x=x1-fa*(x2-x0);    // x2-x0 is the width of triangle T
  var p1y=y1-fa*(y2-y0);    // y2-y0 is the height of T
  var p2x=x1+fb*(x2-x0);
  var p2y=y1+fb*(y2-y0);  
  return [p1x,p1y,p2x,p2y];
}

function closetPoint(points,x){
  let p = [], index = -1;
  points.forEach((item,i)=>{
    if( p[0] === undefined ){
      p = item;
      index = i;
      return;
    }
    if( Math.abs(item[0] - x) < Math.abs(p[0] - x) ){
      p = item;
      index = i;
    }
  });
  return {
    point: p,
    index: index
  };
}

export default Draw;