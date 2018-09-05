import F2 from '@antv/f2';
import React from 'react';
import PropTypes from 'prop-types';
import { dealData, setDomStyle, setInlineDomStyle, escapeHtml } from './f2Utils';
import { color } from '../theme/';

F2.Global.pixelRatio = window.devicePixelRatio;

const colorMap = color.category_12;
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
function f2Factory(name, Chart) {
  let ChartProcess = Chart;
  const chartName = name;
  const isPieChart = chartName === 'f2Pie';

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

    componentDidMount() {
      // 开始初始化图表
      const props = this.props;

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

      chart.tooltip(false);
      chart.legend(false);

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
          if (this.showTooltip === true && ChartProcess.chartTouchStart) {
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
      ChartProcess.chartTouchEnd &&
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
        this.canvas.addEventListener('mouseup', this.onTouchEnd);
      }
    };

    renderLegend = (dir = 'top', legendData, visibleItemNames) => {
      this.lastData = legendData;
      const colors = colorMap;
      const legendContainer = document.querySelector(`#aismlegend${this.chartId}`);
      const legendFormatter = this.config.legend.formatter;
      const isInit = !visibleItemNames;

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

        let legendStr =
          '<div style="display: flex;WebkitUserSelect: none; flex-wrap: wrap; font-size: 12px; line-height: 1.2; box-sizing: border-box;-webkit-font-smoothing: antialiased; padding-left: 12px;">';
        if (isPieChart) {
          legendData[0].data.forEach((d, i) => {
            const visible = isInit || visibleItemNames.indexOf(d[0]) > -1;
            const dotColor = visible ? colors[i] : '#E9EDF0';
            legendStr += `
              <div class="legend" data-close=${visible ? 'false' : 'true'} ${setInlineDomStyle({
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center'
                })} data-name=${escapeHtml(d[0])}>
                ${this.getLegendCircle(dotColor)} ${legendFormatter(d)}
              </div>`;
          });
        } else {
          legendData.forEach((i) => {
            let dotColor = i.color;
            if (colorMap.indexOf(dotColor) >= 0) {
              dotColor = colorMap[colorMap.indexOf(dotColor)];
            }
            const visible = isInit || visibleItemNames.indexOf(i.name) > -1;
            legendStr += `
              <div
                style="margin-right: 30px; margin-bottom: 12px; white-space: nowrap"
                data-close=${
                  visible ? 'false' : 'true'
                }
                class="legend"
                data-name=${escapeHtml(i.name)}
              >
                <span style="display: inline-block; box-sizing: border-box;margin-right: 4px;text-align: center;width: 14px;height: 14px;border-radius: 100%;background-color: #fff;border: 1px solid ${visible ? dotColor: '#E9EDF0'}">
                  <span style="display: inline-block; width: 10px;height: 10px; border-radius: 100%;background-color:${visible ?  dotColor : '#E9EDF0'}">
                  </span>
                </span>
                ${legendFormatter(i)}
              </div>`;
          });
        }

        legendStr += '</div>';
        legendContainer.innerHTML = '';
        legendContainer.insertAdjacentHTML('afterbegin', legendStr);
      } else if (dir === 'right') {
        // 将图例放置到右边
        const chartContainer = document.querySelector(`#aismcontainer-${this.chartId}`);
        setDomStyle(chartContainer, {
          flexDirection: 'row'
        });

        setDomStyle(legendContainer, {
          order: 1,
          position: 'relative',
          marginLeft: '10px'
        });
        // 构造图例字符串
        let legendStr = '';

        if (isPieChart) {
          legendData[0].data.forEach((d, i) => {
            const visible = isInit || visibleItemNames.indexOf(d[0]) > -1;
            const dotColor = visible ? colors[i] : '#E9EDF0';
            legendStr += `
              <div class="legend" data-close=${visible ? 'false' : 'true'} ${setInlineDomStyle({
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center'
                })} data-name=${escapeHtml(d[0])}>
                ${this.getLegendCircle(dotColor)} ${legendFormatter(d)}
              </div>`;
          });
        } else {
          legendData.forEach((d, i) => {
            const visible = isInit || visibleItemNames.indexOf(d.name) > -1;
            const dotColor = visible ? colors[i] : '#E9EDF0';
            legendStr += `
              <div class="legend" data-close=${visible ? 'false' : 'true'} ${setInlineDomStyle({
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center'
              })} data-name=${escapeHtml(d.name)}>
              ${this.getLegendCircle(dotColor)} ${legendFormatter(d)}
            </div>`;
          });
        }

        legendContainer.innerHTML = '';
        legendContainer.insertAdjacentHTML(
          'afterbegin',
          `<div ${setInlineDomStyle({
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-around',
            padding: '15px 0 20px',
            flexGrow: 1
          })}>${legendStr}</div>`
        );
      }

      const legends = legendContainer.querySelectorAll('.legend');

      if (!legends || legends.length <= 1) {
        return;
      }

      for (let i = 0; i < legends.length; i++) {
        const legendItem = legends[i];
        const index = i;
        legendItem.addEventListener('click', e => {
          const visibleItems = [...legends].filter(l => l.getAttribute('data-close') === 'false').map(l => l.getAttribute('data-name'));
          const curName = e.currentTarget.getAttribute('data-name');
          const curVisible = e.currentTarget.getAttribute('data-close') === 'false';

          if (curVisible) {
            const index = visibleItems.indexOf(curName);
            visibleItems.splice(index, 1);
          }
          else {
            visibleItems.push(curName);
          }

          this.filterData(visibleItems);
        });
      }
    };

    // 构造图例的小圆点
    getLegendCircle = color => `<span style="display: inline-block; width: 10px;height: 10px; border-radius: 100%;background-color: ${color};margin-right: 6px"></span>`;

    /**
     * @param {Array} visibleItemNames
     */
    filterData = (visibleItemNames) => {
      const data = this.resultData;
      const colorIndexes = [];
      const resultData = data.filter((item, index) => {
        const i = visibleItemNames.indexOf(item[isPieChart ? 'x' : 'type']);
        if (i > -1) {
          colorIndexes.push(index);
        }
        return i > -1;
      });
      const newColorMap = colorMap.filter((c, index) => colorIndexes.indexOf(index) > -1);
      F2.Global.colors = newColorMap;
      this.chart && this.chart.changeData(resultData);
      const dir = this.config.legend && this.config.legend.dir;
      this.renderLegend(dir, this.lastData, visibleItemNames);
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
      const { style = {}, width, height, config } = this.props;
      const chartStyle = {
        position: 'relative',
        'WebkitUserSelect': 'none',
        backgroundColor: style.backgroundColor || '#fff',
        overflow: 'hidden',
      };

      if (config.legend && config.legend.dir && config.legend.dir === 'right') {
        chartStyle.display = 'flex';
        chartStyle.alignItems = 'center';
      }

      return (
        <div id={`aismcontainer-${this.chartId}`} style={chartStyle}>
          <div id={`aismlegend${this.chartId}`} style={{ width: width }} />
          <canvas ref={dom => (this.canvas = dom)} id={this.chartId} className={rootClassName + name} />
        </div>
      );
    }
  }

  //暴露原版类
  AismChart.Chart = Chart;

  function ChartHOC(props) {
    // 开始初始化图表
      const newProps = ChartProcess.beforeInit ? ChartProcess.beforeInit.call(this, props) : props;

      if (props.customChart) {
        Object.assign(newProps, props.customChart)
      }

      return <AismChart {...newProps} />;
  }

  return ChartHOC;
}

f2Factory.generateUniqueId = generateUniqueId;

export default f2Factory;
