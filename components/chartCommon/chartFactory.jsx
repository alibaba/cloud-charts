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
* chartFactory 函数
*
* 将非React版的图表类转化为React版
* */
function chartFactory(name, Chart) {
  class AiscChart extends React.Component {
    static propTypes = {
      // type: React.PropTypes.oneOf(Object.keys(ChartsMap)).isRequired,
      config: React.PropTypes.object,
      data: React.PropTypes.oneOfType([
        React.PropTypes.object,
        React.PropTypes.array
      ]).isRequired,
      orignalOptions: React.PropTypes.object
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
      if(this.props.data !== nextProps.data){
        this.chart.setData(nextProps.data);
      }
      if(this.props.config !== nextProps.config){
        this.chart.setOption(nextProps.config);
      }
      if(this.props.orignalOptions !== nextProps.orignalOptions){
        this.chart.chart && this.chart.chart.update(orignalOptions);
      }
      if(this.props.width !== nextProps.width || this.props.height !== nextProps.height){
        this.setSize();
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

    setSize() {
      let w, h;
      let node = this.refs.chart;
      //设置宽度
      if(this.props.width){
        w = this.props.width + 'px';
      }else{
        if(node.parentNode) w = node.parentNode.clientWidth + 'px';
        else w = '';
      }
      this.refs.chart.style.width = w;
      //设置高度
      if(this.props.height){
        h = this.props.height + 'px';
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



export default chartFactory;