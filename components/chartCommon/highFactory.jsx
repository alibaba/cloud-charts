import React from 'react';

// const ChartsMap = {
//   'line': Line,
//   'bar': Bar,
//   'pie': Pie,
//   'miniLine': MiniLine
// };

const events = ['MouseOver','Selection','Click'];

let requestAnimationFrame = ( window && window.requestAnimationFrame ) || function(){};

/*
* highFactory 函数
*
* 将非React版的图表类转化为React版
* */
function highFactory(name, Chart) {
  class AiscChart extends React.Component {
    static propTypes = {
      // type: React.PropTypes.oneOf(Object.keys(ChartsMap)).isRequired,
      config: React.PropTypes.object,
      data: React.PropTypes.oneOfType([
        React.PropTypes.object,
        React.PropTypes.array
      ]).isRequired,
      originalOptions: React.PropTypes.object
    };

    static displayName = 'AiscWidgets' + name;

    componentWillMount () {}

    componentDidMount () {

      this.setSize();

      // this.chart = new ChartsMap[this.props.type](
      this.chart = new Chart(
        this.refs.chart,
        this.props.config || {}
      );
      this.chart.setData(this.props.data);

      //触发事件以属性设置方式传入触发
      if(this.props.action){
        for(let i in this.props.action){
          this.chart.fire(i,this.props.action[i]);
        }
      }

      //监听事件
      events.forEach((ev)=>{
        this.chart.on(ev.toLocaleLowerCase(), (e)=>{
          e = e || {}, e.target = this.chart;
          this.props['on' + ev] && this.props['on' + ev](e);
        });
      });

      //自适应大小
      this._size = this.getSize();
      let autoResize = ()=>{
        if(this.refs.chart){//如果组件已经销毁，则不再执行
          let size = this.getSize();
          if(!(size[0] === this._size[0] && size[1] === this._size[1])){
            this.setSize();
            this.chart.render();
            this._size = this.getSize();
          }
          requestAnimationFrame(autoResize.bind(this));
        }
      };
      requestAnimationFrame(autoResize.bind(this));
    }

    componentWillReceiveProps(nextProps){
    }

    shouldComponentUpdate (nextProps) {
      const { data: newData, width: newWidth, height: newHeight, config: newConfig, originalOptions: newOriginalOptions } = nextProps;
      const { data: oldData, width: oldWidth, height: oldHeight, config: oldConfig, originalOptions: oldOriginalOptions } = this.props;

      if(newData !== oldData || newData.length !== oldData.length || (newData.data && oldData.data && newData.data !== oldData.data)) {
        this.chart.setData(newData);
      }
      if(newConfig !== oldConfig) {
        this.chart.setOption(newConfig);
      }
      if(newOriginalOptions !== oldOriginalOptions) {
        this.chart.chart && this.chart.chart.update(newOriginalOptions);
      }
      if(newWidth !== oldWidth || newHeight !== oldHeight) {
        this.setSize(newWidth, newHeight);
      }
      //action判断
      for(let i in nextProps.action){
        if(this.props.action[i] !== nextProps.action[i]){
          let e = nextProps.action[i];
          if(e.target !== this.chart){
            this.chart.fire(i,e);
          }
        }
      }
      return false;
    }

    componentWillUpdate (nextProps) {}

    componentWillUnmount () {
      this.chart.destroy && this.chart.destroy();
    }

    getChart() {
      return this.chart;
    }

    setSize(width, height) {
      const propsWidth = width || this.props.width;
      const propsHeight = height || this.props.height;
      let w, h;
      let node = this.refs.chart;
      //设置宽度
      if(propsWidth){
        w = propsWidth + 'px';
      }else{
        if(node.parentNode) w = node.parentNode.clientWidth + 'px';
        else w = '';
      }
      this.refs.chart.style.width = w;
      //设置高度
      if(propsHeight){
        h = propsHeight + 'px';
      }else{
        if(node.parentNode) h = node.parentNode.clientHeight + 'px';
        else h = '';
      }
      this.refs.chart.style.height = h;
    }

    getSize() {
      let node = this.refs.chart,
        w = node.offsetWidth,
        h = node.offsetHeight;
      //如果是自动获取宽高的情况，则监听父级宽高
      if(!this.props.width && node.parentNode) w = node.parentNode.clientWidth;
      if(!this.props.height && node.parentNode) h = node.parentNode.clientHeight;
      return [w, h];
    }

    render() {
      return (
        <div ref="chart" />
      );
    }
  }

  //暴露原版类
  AiscChart.Chart = Chart;

  return AiscChart;
}



export default highFactory;