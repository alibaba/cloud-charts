import F2 from '@antv/f2';
import React from 'react';
import PropTypes from 'prop-types';
// import { View, Theme, Client, Unit } from '@alife/aism';
import { dealData, setDomStyle, setInlineDomStyle } from './utils';

// const { bp } = Unit;

const View = function(props) {
  const defaultStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    boxSizing: 'border-box',
    borderWidth: 0,
    borderStyle: 'solid',
    margin: 0,
    padding: 0,
    position: 'relative',
    zIndex: 0,
    minHeight: 0,
    minWidth: 0,
  };
  const { style, ...extra } = props;
  const s = Object.assign({}, defaultStyle, style);

  return <div style={s} {...extra}>{props.children}</div>;
}

const Client = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const Theme = {
  colors: {
    GrayLightest: '#F7F9FB',
    Font9: '#999',
    Font3: '#333',
    GrayLine: '#E5E7E9'
  },
  line: {
    widthDefault: 0.5
  }
};
const bp = 1;

F2.Global.pixelRatio = window.devicePixelRatio;

const colorMap = ['#2196F3', '#26C6DA', '#9CCC65', '#F9A825', '#AB47BC', '#3067C1'];
const areaColorMap = ['#D3EAFD', '#D4F4F8', '#EBF5E0', '#FEEED3', '#EEDAF2', '#D6E1F3'];
const theme = {
  colors: colorMap,
  pixelRatio: window.devicePixelRatio,
  guide: {
    line: {
      lineWidth: 1
    }
  }
};

F2.Global.setTheme(theme);
let uniqueId = 0;
function generateUniqueId() {
  return `react-f2-${uniqueId++}`;
}

const rootClassName = 'aism-widgets ';

const events = ['MouseOver', 'Selection', 'Click'];

let requestAnimationFrame = (window && window.requestAnimationFrame) || function() {};

/*
* g2Factory 函数
*
* 将非React版的图表类转化为React版
*
* convertData 控制是否转化数据
* */
function g2Factory(name, Chart) {
  let ChartProcess = Chart;
  class AismChart extends React.Component {
    static propTypes = {
      width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      config: PropTypes.object,
      data: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.object), PropTypes.object]).isRequired,
      plotCfg: PropTypes.object,
      forceFit: PropTypes.bool
    };

    static defaultProps = {
      forceFit: false,
      plotCfg: {},
      config: {}
    };

    static displayName = 'AismWidgets' + name;

    hasSetColor = false;

    constructor(props, context) {
      super(props, context);
      this.chart = null;
      this.chartDom = null;
      this.chartId = generateUniqueId();
    }

    // componentWillMount () {}

    componentDidMount() {
      if (this.props.customChart) {
        ChartProcess = Object.assign({}, ChartProcess, this.props.customChart);
      }

      // 开始初始化图表
      const props = ChartProcess.beforeInit ? ChartProcess.beforeInit.call(this, this.props) : this.props;
      // 如果外部有传入颜色主题，则使用这个主题
      if (props.config.colors) {
        F2.Global.colors = props.config.colors;
      }
      F2.Global.pixelRatio = 2;
      const { width, height, data: chartData, forceFit, config, ...otherProps } = props;
      const { padding, legend, xAxis, yAxis, width: configWidth } = config;
      const initData = [];
      chartData.forEach(item => {
        let curObj = {
          name: item.name,
          data: []
        };
        item.data.forEach(dataItem => {
          curObj.data.push(dataItem.concat([]));
        });

        initData.push(curObj);
      });
      const chart = new F2.Chart({
        id: this.chartId,
        width: width || configWidth,
        height,
        padding,
        forceFit: width === undefined || forceFit,
        ...otherProps
      });

      initData.forEach(i => {
        i.data.forEach(dataItem => {
          if (xAxis.labelFormatter) {
            dataItem[0] = xAxis.labelFormatter(dataItem[0]);
          } else {
            dataItem[0] = `${dataItem[0]}`;
          }
          if (yAxis.labelFormatter) {
            dataItem[1] = yAxis.labelFormatter(dataItem[1]);
          }
        });
      });
      //把数据处理为g2可以识别的格式
      const data = dealData(initData, config);
      ChartProcess.init.call(this, chart, config, data, initData, this);
      initData.forEach((i, index) => {
        i.color = colorMap[index];
      });

      this.initData = initData;
      this.resultData = data;
      this.originData = initData;
      this.chart = chart;
      this.config = config;
      this.addCanvasEvents();

      if (!legend || (legend && legend.show !== false)) {
        if (!legend) {
          this.renderLegend('top', initData);
        } else {
          this.renderLegend(legend.dir, initData);
        }
      }
      ChartProcess.afterRender &&
        ChartProcess.afterRender.call(this, this.canvas, this.chart, this.config, this.props, this);
    }

    componentWillReceiveProps(nextProps) {
      const { data: newData, width: newWidth, height: newHeight, padding: newPadding, config: newConfig } = nextProps;
      const { data: oldData, width: oldWidth, height: oldHeight, padding: oldPadding } = this.props;

      if (newPadding !== oldPadding) {
        console.warn('padding 不支持修改');
      }

      if (newData !== oldData || newData.length !== oldData.length) {
        const { xAxis = {}, yAxis = {} } = newConfig;
        newData.forEach(i => {
          i.data.forEach(dataItem => {
            if (xAxis.labelFormatter) {
              dataItem[0] = xAxis.labelFormatter(dataItem[0]);
            } else {
              dataItem[0] = `${dataItem[0]}`;
            }
            if (yAxis.labelFormatter) {
              dataItem[1] = yAxis.labelFormatter(dataItem[1]);
            }
          });
        });

        const data = dealData(newData, newConfig);

        if (ChartProcess.changeData) {
          ChartProcess.changeData.call(this, this.chart, newConfig, data);
        } else {
          this.chart && this.chart.changeData(data);
        }

        if (ChartProcess.afterChangeData) {
          ChartProcess.afterChangeData.call(this, this.canvas, this.chart, this.config, this.props, this);
        }
      }

      if (newWidth !== oldWidth || newHeight !== oldHeight) {
        if (ChartProcess.changeSize) {
          ChartProcess.changeSize.call(this, this.chart, newConfig, newWidth, newHeight);
        } else {
          this.chart && this.chart.changeSize(newWidth, newHeight);
        }
      }
    }

    shouldComponentUpdate() {
      return false;
    }

    componentWillUnmount() {
      if (ChartProcess.destroy) {
        ChartProcess.destroy.call(this, this.chart);
      }

      this.chart && this.chart.destroy && this.chart.destroy();
      this.chart = null;
      this.chartDom = null;
      this.chartId = null;
    }

    showTooltip = true;
    timeoutId = null;
    touchY = 0;

    onTouchStart = e => {
      this.inTouch = true;
      this.originCanvas = this.canvas.toDataURL();
      const { tooltip } = this.config;
      if (e.touches) {
        this.touchY = e.touches[0].clientY;
      } else {
        this.touchY = e.clientY;
      }
      this.showTooltip = true;
      if (!tooltip || (tooltip && tooltip.show === false)) {
        return;
      } else {
        this.timeoutId = setTimeout(() => {
          if (this.showTooltip === true) {
            ChartProcess.chartTouchStart.call(
              this,
              e,
              this.chart,
              this.config,
              this.canvas,
              this.resultData,
              this.originData,
              this,
              ChartProcess
            );
          }
        }, 150);
      }
    };

    onTouchMove = e => {
      let touchMoveY;
      if (e.touches) {
        touchMoveY = e.touches[0].clientY;
      } else {
        touchMoveY = e.clientY;
      }

      if (Math.abs(touchMoveY - this.touchY) > 20) {
        this.showTooltip = false;
      }

      ChartProcess.chartTouchMove &&
        ChartProcess.chartTouchMove.call(
          this,
          e,
          this.chart,
          this.config,
          this.canvas,
          this.resultData,
          this.originData,
          this,
          ChartProcess
        );
    };

    onTouchEnd = e => {
      this.inTouch = false;
      this.showTooltip = false;
      clearTimeout(this.timeoutId);
      ChartProcess.chartTouchEnd.call(
        this,
        e,
        this.chart,
        this.config,
        this.canvas,
        this.resultData,
        this.originData,
        this,
        ChartProcess
      );
    };

    addCanvasEvents = () => {
      if ('ontouchstart' in document.documentElement) {
        this.canvas.addEventListener('touchstart', this.onTouchStart);
        this.canvas.addEventListener('touchmove', this.onTouchMove);
        this.canvas.addEventListener('touchend', this.onTouchEnd);
      } else {
        const container = document.querySelector(`#aismcontainer-${this.chartId}`);
        this.canvas.addEventListener('mousedown', this.onTouchStart);
        // this.canvas.addEventListener('mousemove', this.onTouchMove);
        this.canvas.addEventListener('mouseup', this.onTouchEnd);
        // this.canvas.addEventListener('mouseleave', this.onTouchEnd);
      }
    };

    renderLegend = (dir = 'top', legendData, filterName) => {
      this.lastData = legendData;
      if (dir === 'top') {
        const newData = legendData;
        const resultData = [];
        if (newData.length < this.originData.length) {
          this.originData.forEach((item, index) => {
            if (!newData[index] || item.name !== newData[index].name) {
              newData.splice(index, 0, { color: '#E9EDF0', name: item.name, value: '--' });
            } else {
              resultData.push(item);
            }
          });
        }

        const legendContainer = document.querySelector(`#aismlegend${this.chartId}`);
        let lengendStr =
          '<div style="display: flex;-webkit-user-select: none; flex-wrap: wrap; font-size: 12px; line-height: 1.2; box-sizing: border-box;-webkit-font-smoothing: antialiased; padding-left: 12px;">';

        legendData.forEach(i => {
          let color = i.color;
          if (areaColorMap.indexOf(color) >= 0) {
            color = colorMap[areaColorMap.indexOf(color)];
          }
          lengendStr += `<div style="margin-right: 30px; margin-bottom: 12px; white-space: nowrap" data-close=${
            filterName === i.name ? 'true' : 'false'
          } class="legend"><span style="display: inline-block; box-sizing: border-box;margin-right: 4px;text-align: center;width: 14px;height: 14px;border-radius: 100%;background-color: #fff;border: 1px solid ${
            filterName === i.name ? '#E9EDF0' : color
          }"><span style="display: inline-block; width: 10px;height: 10px; border-radius: 100%;background-color:${
            filterName === i.name ? '#E9EDF0' : filterName === i.name ? '#E9EDF0' : color
          }"></span></span><span class="name" style="color: ${Theme.colors.Font9}; margin-right: 6px;">${
            i.name
          }</span><span class="value" style="color: ${Theme.colors.Font3}">${
            i.value !== null ? i.value : ''
          }</span></div>`;
        });
        lengendStr += '</div>';
        legendContainer.innerHTML = '';
        legendContainer.insertAdjacentHTML('afterbegin', lengendStr);
      } else if (dir === 'right') {
        //将图例放置到右边
        const chartContainer = document.querySelector(`#aismcontainer-${this.chartId}`);
        setDomStyle(chartContainer, {
          flexDirection: 'row'
        });
        //调整图表的位置
        const chart = this.canvas;
        setDomStyle(chart, {
          marginLeft: `${20 * bp}px`
        });
        //图例容器
        const legendContainer = document.querySelector(`#aismlegend${this.chartId}`);
        setDomStyle(legendContainer, {
          order: 1,
          position: 'relative',
          marginLeft: `${10 * bp}px`
        });
        //构造图例字符串
        let legendStr = '';
        //获取图的颜色
        const colors = this.props.config.colors;
        const legendFormatter = this.config.legend.formatter || this.defaultLegendFormatter;
        legendData[0].data.forEach((d, i) => {
          legendStr += `<div ${setInlineDomStyle({
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center'
          })}>${this.getLegendCircle(colors[i])} ${legendFormatter(d)}</div>`;
        });
        legendContainer.insertAdjacentHTML(
          'afterbegin',
          `<div ${setInlineDomStyle({
            height: '100%',
            display: 'flex',
            display: '-webkit-flex',
            '-webkit-flex-direction': 'column',
            flexDirection: 'column',
            '-webkit-justify-content': 'space-around',
            justifyContent: 'space-around',
            padding: '15px 0 20px',
            '-webkit-flex-grow': 1,
            flexGrow: 1
          })}>${legendStr}</div>`
        );
      }

      const legends = document.querySelector(`#aismlegend${this.chartId}`).querySelectorAll('.legend');
      if (!legends || legends.length <= 1) {
        return;
      }
      for (let i = 0; i < legends.length; i++) {
        const legendItem = legends[i];
        const index = i;
        legendItem.addEventListener('click', e => {
          const name = e.currentTarget.querySelector('.name').innerHTML;
          if (e.currentTarget.getAttribute('data-close') === 'true') {
            this.showAllData();
          } else {
            this.filterData(name, index);
          }
        });
      }
    };

    //默认的图例Formatter
    defaultLegendFormatter = d => {
      return `${d[0]} ${d[1] * 100} %`;
    };

    //构造图例的小圆点
    getLegendCircle = color => {
      const circle =
        '<span style="display: inline-block; width: 10px;height: 10px; border-radius: 100%;background-color:' +
        color +
        '"></span>';

      return circle;
    };

    showAllData = () => {
      this.chart && this.chart.changeData(this.resultData);
      this.renderLegend('top', this.lastData);
    };

    filterData = (name, index) => {
      let data = this.resultData;
      let resultData1 = [];

      data.forEach(item => {
        if (item.type !== name) {
          resultData1.push({
            x: item.x,
            y: -1,
            type: item.type
          });
        } else {
          resultData1.push(name);
        }
      });

      const resultData = data.filter(item => {
        return item.type !== name;
      });

      const colorMap = ['#2196F3', '#26C6DA', '#9CCC65', '#F9A825', '#AB47BC', '#3067C1'];
      colorMap.splice(index, 1);
      F2.Global.colors = colorMap;
      this.chart && this.chart.changeData(resultData);
      // ChartProcess.filter.call(this);
      this.renderLegend('top', this.lastData, name);
    };

    clickLegend = i => {};

    clearLegend = () => {
      const legendContainer = document.querySelector(`#aismlegend${this.chartId}`);
      const values = legendContainer.querySelectorAll('.value');
      values.forEach(i => {
        i.innerHTML = '';
      });
    };

    render() {
      const { style = {}, width, height } = this.props;
      const chartStyle = {
        position: 'relative',
        '-webkit-user-select': 'none',
        backgroundColor: style.backgroundColor || '#fff',
        overflow: 'hidden'
      };

      return (
        <View id={`aismcontainer-${this.chartId}`} style={chartStyle}>
          <View id={`aismlegend${this.chartId}`} style={{ width: width }} />
          <canvas ref={dom => (this.canvas = dom)} id={this.chartId} className={rootClassName + name} />
        </View>
      );
    }
  }

  //暴露原版类
  AismChart.Chart = Chart;

  return AismChart;
}

g2Factory.generateUniqueId = generateUniqueId;

export default g2Factory;
