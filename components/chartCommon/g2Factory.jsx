'use strict';

import COLORS from '../chartCommon/colors';

import G2 from '@antv/g2';
import React from 'react';
import PropTypes from 'prop-types';

import { size, color, fonts } from '../variables';

//全局G2主题设置
const theme = G2.Util.deepMix({}, G2.Global, {
  // animate: false,
  // colors: {
  //   'default': COLORS
  // },
  shape: {
    line: {
      lineWidth: 2
    },
    area: {
      fillOpacity: 0.1
    },
    interval: {
      fillOpacity: 1
    },
  },
  axis: {
    bottom: {
      label: {
        textStyle: { fill: color.colorN22} // 底部标签文本的颜色
      },
      line: {
        stroke: color.colorLine12
      },
      tickLine: null
    },
    left: {
      label: {
        textStyle: { fill: color.colorN22} // 左部标签文本的颜色
      },
      grid: {
        lineStyle: {
          stroke: color.colorFill12,
          lineWidth: 1,
          lineDash: null
        },
      }
    },
    right: {
      label: {
        textStyle: { fill: color.colorN22} // 右部标签文本的颜色
      }
    }
  },
  tooltip: {
    offset: 8,
    crossLine: {
      stroke: '#dddddd',
      // lineWidth: 1,
    },
    'g2-tooltip': {
      backgroundColor: color['widgets-tooltip-background'],
      boxShadow: color['widgets-tooltip-shadow'],
      padding: size.s3,
      borderRadius: size.s1,
      fontFamily: fonts.fontFamilyBase,
      fontSize: fonts.fontSizeBaseCaption,
      lineHeight: fonts.fontSizeBaseCaption,
      color: color.colorText14,
    },
    'g2-tooltip-title': {
      marginBottom: 0,
      color: color.colorText12
    },
    'g2-tooltip-list': {},
    'g2-tooltip-list-item': {
      marginBottom: 0,
      marginTop: size.s2
    },
    'g2-tooltip-marker': {},
  },
  tooltipMarker: {
    symbol: (x, y, r, ctx, marker) => {
      ctx.fillStyle = color.colorWhite;
      ctx.lineWidth = 2;
      ctx.strokeStyle = marker.get('color');
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2, false);
      ctx.fill();
      ctx.stroke();

      // ctx.save();
      // ctx.beginPath();
      // ctx.fillStyle = '#fff';
      // ctx.strokeStyle = color;
      // ctx.globalAlpha = 0.2;
      // ctx.lineWidth = 3;
      // ctx.arc(x, y, 6, 0, Math.PI * 2, false);
      // ctx.stroke();
      // ctx.restore();
    },
    // 这里必须传数字，所以不能直接引用
    radius: 4
  },
  tooltipCrosshairsLine: {
    style: {
      stroke: color.colorN17,
      lineWidth: 1
    }
  },
  // 某个bug导致theme这里不可用，暂时在组件代码中设置图例样式
  legend: {
    top: {
      textStyle: {
        fill: color.colorN24
      },
      unCheckColor: color.colorN21
    },
    right: {
      textStyle: {
        fill: color.colorN24
      },
      unCheckColor: color.colorN21
    },
    bottom: {
      textStyle: {
        fill: color.colorN24
      },
      unCheckColor: color.colorN21
    },
    left: {
      textStyle: {
        fill: color.colorN24
      },
      unCheckColor: color.colorN21
    },
    html: {
      'g2-legend': {
        overflow: 'auto',
        fontFamily: fonts.fontFamilyBase,
        fontSize: fonts.fontSizeBaseCaption,
        lineHeight: fonts.fontSizeBaseCaption,
        color: color.colorN24
      },
      'g2-legend-list': {},
      'g2-legend-list-item': {
        marginRight: size.s3
      },
      'g2-legend-marker': {
        width: '6px',
        height: '6px',
        marginRight: size.s1,
      },
    }
  },
});
//设置屏幕dpi缩放（如果有效的话）
if (window && window.devicePixelRatio) {
  theme.pixelRatio = window.devicePixelRatio;
}
G2.Global.setTheme(theme); // 将主题设置为用户自定义的主题

// 图表唯一id
let uniqueId = 0;
function generateUniqueId() {
  return `react-g2-${uniqueId++}`;
}

const rootClassName = 'aisc-widgets ';

const events = ['MouseOver','Selection','Click'];

let requestAnimationFrame = ( window && window.requestAnimationFrame ) || function(){};

/*
* g2Factory 函数
*
* 将非React版的图表类转化为React版
*
* convertData 控制是否转化数据
* */
function g2Factory(name, Chart, convertData = true) {
  let ChartProcess = Chart;
  class AiscChart extends React.Component {
    static propTypes = {
      width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      config: PropTypes.object,
      data: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.object),
        PropTypes.object
      ]).isRequired,
      plotCfg: PropTypes.object,
      forceFit: PropTypes.bool
    };

    static defaultProps = {
      forceFit: false,
      plotCfg: {},
      config: {
      },
    };

    static displayName = 'AiscWidgets' + name;

    constructor(props, context) {
      super(props, context);
      this.chart = null;
      this.chartDom = null;
      this.chartId = generateUniqueId();
    }

    // componentWillMount () {}

    componentDidMount () {
      if (this.props.customChart) {
        ChartProcess = Object.assign({}, ChartProcess, this.props.customChart);
      }

      // this.setSize();
      const props = ChartProcess.beforeInit ? ChartProcess.beforeInit.call(this, this.props) : this.props;
      const { width, height = 400, data: initData, padding, forceFit, config, ...otherProps } = props;
      const chart = new G2.Chart({
        container: this.chartDom,
        width,
        height,
        padding,
        forceFit: width === undefined || forceFit,
        ...otherProps
      });
      const data = convertData ? (config.dataType === 'g2' ? initData : highchartsDataToG2Data(initData, config)) : initData;
      ChartProcess.init.call(this, chart, config, data, initData);
      // this.chart.setData(this.props.data);

      // //绑定事件
      // const events = [
      //   'plotmove',
      //   'plotenter',
      //   'plotleave',
      //   'plotclick',
      //   'plotdblclick',
      //   'rangeselectstart',
      //   'rangeselectend',
      //   'itemselected',
      //   'itemunselected',
      //   'itemselectedchange',
      //   'tooltipchange',
      //   'tooltipshow',
      //   'tooltiphide'
      // ];
      //
      // Object.keys(config).forEach(item => {
      //   (events.indexOf(item) > -1) && chart.on(item, config[item]);
      // });

      this.chart = chart;

      // //触发事件以属性设置方式传入触发
      // if(this.props.action){
      //   for(let i in this.props.action){
      //     this.chart.fire(i,this.props.action[i]);
      //   }
      // }
      //
      // //监听事件
      // events.forEach((ev)=>{
      //   this.chart.on(ev.toLocaleLowerCase(), (e)=>{
      //     e = e || {}, e.target = this.chart;
      //     this.props['on' + ev] && this.props['on' + ev](e);
      //   });
      // });

      //自适应大小
      // this._size = this.getSize();
      // let autoResize = ()=>{
      //   if(this.refs.chart){//如果组件已经销毁，则不再执行
      //     let size = this.getSize();
      //     if(!(size[0] === this._size[0] && size[1] === this._size[1])){
      //       this.setSize();
      //       this.chart.render();
      //       this._size = this.getSize();
      //     }
      //     requestAnimationFrame(autoResize.bind(this));
      //   }
      // };
      // requestAnimationFrame(autoResize.bind(this));
    }

    componentWillReceiveProps(nextProps){
      const { data: newData, width: newWidth, height: newHeight, padding: newPadding, config: newConfig } = nextProps;
      const { data: oldData, width: oldWidth, height: oldHeight, padding: oldPadding } = this.props;

      if (newPadding !== oldPadding) {
        console.warn('padding 不支持修改');
      }

      if (newData !== oldData || newData.length !== oldData.length) {
        const data = convertData ? (newConfig.dataType === 'g2' ? newData : highchartsDataToG2Data(newData, newConfig)) : newData;
        if (ChartProcess.changeData) {
          ChartProcess.changeData.call(this, this.chart, newConfig, data);
        } else {
          this.chart.changeData(data);
        }
      }
      if (newWidth !== oldWidth || newHeight !== oldHeight) {
        if (ChartProcess.changeSize) {
          ChartProcess.changeSize.call(this, this.chart, newConfig, newWidth, newHeight);
        } else {
          this.chart.changeSize(newWidth, newHeight);
        }
      }
    }

    shouldComponentUpdate (nextProps) {
      // if(this.props.data !== nextProps.data){
      //   this.chart.setData(nextProps.data);
      // }
      // if(this.props.config !== nextProps.config){
      //   this.chart.setOption(nextProps.config);
      // }
      // if(this.props.orignalOptions !== nextProps.orignalOptions){
      //   this.chart.chart && this.chart.chart.update(orignalOptions);
      // }
      // if(this.props.width !== nextProps.width || this.props.height !== nextProps.height){
      //   this.setSize();
      // }
      // //action判断
      // for(let i in nextProps.action){
      //   if(this.props.action[i] !== nextProps.action[i]){
      //     let e = nextProps.action[i];
      //     if(e.target !== this.chart){
      //       this.chart.fire(i,e);
      //     }
      //   }
      // }
      return false;
    }

    // componentWillUpdate (nextProps) {}

    componentWillUnmount () {
      if (ChartProcess.destroy) {
        ChartProcess.destroy.call(this, this.chart);
      }

      this.chart.destroy && this.chart.destroy();
      this.chart = null;
      this.chartDom = null;
      this.chartId = null;
    }

    // getChart() {
    //   return this.chart;
    // }

    // setSize() {
    //   let w = '', h = '';
    //   let node = this.refs.chart;
    //   //设置宽度
    //   if (this.props.width) {
    //     w = this.props.width + 'px';
    //   } else if(node.parentNode) {
    //      w = node.parentNode.clientWidth + 'px';
    //   }
    //   this.refs.chart.style.width = w;
    //   //设置高度
    //   if(this.props.height){
    //     h = this.props.height + 'px';
    //   }else{
    //     if(node.parentNode) h = node.parentNode.clientHeight + 'px';
    //     else h = '';
    //   }
    //   this.refs.chart.style.height = h;
    // }
    //
    // getSize() {
    //   let node = this.refs.chart,
    //     w = node.offsetWidth,
    //     h = node.offsetHeight;
    //   //如果是自动获取宽高的情况，则监听父级宽高
    //   if(!this.props.width && node.parentNode) w = node.parentNode.clientWidth;
    //   if(!this.props.height && node.parentNode) h = node.parentNode.clientHeight;
    //   return [w, h];
    // }

    render() {
      return (
        <div ref={dom => this.chartDom = dom} id={this.chartId} className={rootClassName + name} />
      );
    }
  }

  //暴露原版类
  AiscChart.Chart = Chart;

  return AiscChart;
}

function highchartsDataToG2Data(data, config) {
  const newData = [];
  if (Array.isArray(config.yAxis)) {
    data.forEach((oneData) => {
      const { name: dataName, yAxis: yIndex = 0 } = oneData;

      oneData.data.forEach((d, i) => {
        if (Array.isArray(d)) {
          const [x, y, ...extra] = d;
          newData.push({
            x,
            ['y' + yIndex]: y,
            extra,
            type: dataName
          });
        } else if (config.xAxis && config.xAxis.categories && config.xAxis.categories[i]) {
          const x = config.xAxis.categories[i];
          const y = isNaN(d) ? d[0] : d;
          newData.push({
            x,
            ['y' + yIndex]: y,
            extra: [],
            type: dataName
          });
        } else {
          const { x, y, ...extra } = d;
          newData.push({
            x,
            ['y' + yIndex]: y,
            extra,
            type: dataName
          });
        }
      });
    });
  } else {
    data.forEach((oneData) => {
      const { name: dataName } = oneData;

      oneData.data.forEach((d, i) => {
        if (Array.isArray(d)) {
          const [x, y, ...extra] = d;
          newData.push({
            x,
            y,
            extra,
            type: dataName
          });
        } else if (config.xAxis && config.xAxis.categories && config.xAxis.categories[i]) {
          const x = config.xAxis.categories[i];
          const y = isNaN(d) ? d[0] : d;
          newData.push({
            x,
            y,
            extra: [],
            type: dataName
          });
        } else {
          const { x, y, ...extra } = d;
          newData.push({
            x,
            y,
            extra,
            type: dataName
          });
        }
      });
    });
  }
  return newData;
}

export default g2Factory;
