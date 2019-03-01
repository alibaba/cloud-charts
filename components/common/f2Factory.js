import F2 from '@antv/f2';
import React from 'react';
import PropTypes from 'prop-types';
import { dealData, setDomStyle, setInlineDomStyle, escapeHtml, getTooltipId, getLegendId, getContainerId } from './f2Utils';
import { color } from '../theme/';

F2.Global.pixelRatio = window.devicePixelRatio;

const theme = {
  pixelRatio: window.devicePixelRatio,
  guide: {
    line: {
      lineWidth: 1,
    },
  },
};

let uniqueId = 0;
function generateUniqueId() {
  return `react-f2-${uniqueId++}`;
}

const rootClassName = 'aism-widgets ';
const events = ['MouseOver', 'Selection', 'Click'];
const requestAnimationFrame = (window && window.requestAnimationFrame) || function () {};

/*
* g2Factory 函数
*
* 将非React版的图表类转化为React版
*
* convertData 控制是否转化数据
* */
function f2Factory(name, Chart) {
  const ChartProcess = Chart;
  const chartName = name;
  const isPieChart = chartName === 'f2Pie';

  class AismChart extends React.Component {
    static propTypes = {
      width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      config: PropTypes.object,
      data: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.object), PropTypes.object]).isRequired,
      plotCfg: PropTypes.object,
      forceFit: PropTypes.bool,
    }

    static defaultProps = {
      forceFit: false,
      plotCfg: {},
      config: {},
    }

    static displayName = `AismWidgets${name}`;

    hasSetColor = false;

    showTooltip = true;

    timeoutId = null;

    touchY = 0;

    constructor(props, context) {
      super(props, context);
      this.chart = null;
      this.chartDom = null;
      this.chartId = generateUniqueId();
    }

    componentWillMount() {
      const { config } = this.props;

      // 如果外部有传入颜色主题，则使用这个主题
      if (config.colors) {
        theme.colors = config.colors;
      }
      if (config.theme) {
        Object.assign(theme, config.theme);
      }

      F2.Global.setTheme(theme);
    }

    componentDidMount() {
      // 开始初始化图表
      const { width, height, data: chartData, forceFit, config, ...otherProps } = this.props;
      const { padding, legend, xAxis, yAxis, width: configWidth } = config;
      const initData = [];
      const colors = F2.Global.colors;

      chartData.forEach(item => {
        const curObj = {
          name: item.name,
          data: [],
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
        ...otherProps,
      });

      // tooltip、legend 都是自己实现的，将默认的关掉
      chart.tooltip(false);
      chart.legend(false);

      initData.forEach((i, index) => {
        i.color = colors[index];
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
      // 把数据处理为g2可以识别的格式
      const data = dealData(initData, config);
      ChartProcess.init.call(this, chart, config, data, initData, this);

      this.resultData = data;
      this.originData = initData;
      this.chart = chart;
      this.config = config;
      this.addCanvasEvents();

      this.renderLegend(initData);
      ChartProcess.afterRender &&
        ChartProcess.afterRender.call(this, this.canvas, this.chart, this.config, this.props, this, ChartProcess);
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

        const data = dealData(newData, newConfig, isPieChart);

        this.changeData(data, newConfig);
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

    changeData = (data, config) => {
      if (ChartProcess.changeData) {
        ChartProcess.changeData.call(this, this.chart, config, data);
      } else if (this.chart) {
        this.chart.changeData(data);
      }

      if (ChartProcess.afterChangeData) {
        ChartProcess.afterChangeData.call(this, this.canvas, this.chart, this.config, this.props, this);
      }
    }

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
        const container = document.querySelector(`#${getContainerId(this.chartId)}`);
        this.canvas.addEventListener('mousedown', this.onTouchStart);
        this.canvas.addEventListener('mouseup', this.onTouchEnd);
      }
    };

    renderLegend = (legendData, legendItems) => {
      const config = this.props.config;
      const { show, position, titleStyle, valueStyle, unCheckStyle } = config.legend;

      if (show === false) {
        return null;
      }

      this.lastData = legendData;
      const colors = theme.colors;
      const legendContainer = document.querySelector(`#${getLegendId(this.chartId)}`);
      const legendFormatter = this.config.legend.formatter;
      const isInit = !legendItems;

      if (position === 'top') {
        const newData = legendData;
        const resultData = [];
        if (newData.length < this.originData.length) {
          this.originData.forEach((item, index) => {
            if (!newData[index] || item.name !== newData[index].name) {
              newData.splice(index, 0, { color: color.widgetsLegendUncheck, name: item.name, value: '--' });
            } else {
              resultData.push(item);
            }
          });
        }

        let legendStr = '<div style="display: flex;WebkitUserSelect: none; flex-wrap: wrap; font-size: 12px; line-height: 1.2; box-sizing: border-box;-webkit-font-smoothing: antialiased; padding-left: 12px; padding-top: 12px;">';
        if (isPieChart) {
          legendData[0].data.forEach((d, i) => {
            const visible = isInit || legendItems[i].visible;
            const dotColor = visible ? colors[i] : unCheckStyle.fill;
            legendStr += `
              <div class="legend" data-close=${visible ? 'false' : 'true'} ${setInlineDomStyle({
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
              })} data-name=${escapeHtml(d[0])}>
                ${this.getLegendCircle(dotColor)} ${legendFormatter(d, titleStyle, valueStyle)}
              </div>`;
          });
        } else {
          legendData.forEach((i, index) => {
            let dotColor = i.color;
            if (colors.indexOf(dotColor) >= 0) {
              dotColor = colors[colors.indexOf(dotColor)];
            }
            const visible = isInit || legendItems[index].visible;
            legendStr += `
              <div
                style="margin-right: 30px; margin-bottom: 12px; white-space: nowrap"
                data-close=${
                  visible ? 'false' : 'true'
                }
                class="legend"
                data-name=${escapeHtml(i.name)}
              >
                <span style="display: inline-block; box-sizing: border-box;margin-right: 4px;text-align: center;width: 14px;height: 14px;border-radius: 100%;background-color: transparent;border: 1px solid ${visible ? dotColor : unCheckStyle.fill}">
                  <span style="display: inline-block; width: 10px;height: 10px; border-radius: 100%;background-color:${visible ? dotColor : unCheckStyle.fill}">
                  </span>
                </span>
                ${legendFormatter(i, titleStyle, valueStyle)}
              </div>`;
          });
        }

        legendStr += '</div>';
        legendContainer.innerHTML = '';
        legendContainer.insertAdjacentHTML('afterbegin', legendStr);
      } else if (position === 'right') {
        // 将图例放置到右边
        const chartContainer = document.querySelector(`#${getContainerId(this.chartId)}`);
        setDomStyle(chartContainer, {
          flexDirection: 'row',
        });

        setDomStyle(legendContainer, {
          order: 1,
          position: 'relative',
          marginLeft: '10px',
        });
        // 构造图例字符串
        let legendStr = '';

        if (isPieChart) {
          legendData[0].data.forEach((d, i) => {
            const visible = isInit || legendItems[i].visible;
            const dotColor = visible ? colors[i] : unCheckStyle.fill;
            legendStr += `
              <div class="legend" data-close=${visible ? 'false' : 'true'} ${setInlineDomStyle({
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: '6px',
              })} data-name=${escapeHtml(d[0])}>
                ${this.getLegendCircle(dotColor)} ${legendFormatter(d, titleStyle, valueStyle)}
              </div>`;
          });
        } else {
          legendData.forEach((d, i) => {
            const visible = isInit || legendItems[i].visible;
            const dotColor = visible ? colors[i] : unCheckStyle.fill;
            legendStr += `
              <div class="legend" data-close=${visible ? 'false' : 'true'} ${setInlineDomStyle({
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
              })} data-name=${escapeHtml(d.name)}>
                ${this.getLegendCircle(dotColor)} ${legendFormatter(d, titleStyle, valueStyle)}
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
            flexGrow: 1,
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
          const legendItems = [...legends].map(l => {
            return {
              visible: l.getAttribute('data-close') === 'false',
              name: l.getAttribute('data-name'),
            };
          });
          const curVisible = e.currentTarget.getAttribute('data-close') === 'false';

          if (curVisible) {
            legendItems[i].visible = false;
          } else {
            legendItems[i].visible = true;
          }
          this.filterData(legendItems);
        });
      }
    };

    // 构造图例的小圆点
    getLegendCircle = color => `<span style="display: inline-block; width: 10px;height: 10px; border-radius: 100%;background-color: ${color};margin-right: 6px"></span>`;

    /**
     * @param {Array} legendItems
     */
    filterData = (legendItems) => {
      const data = this.resultData;
      const colorIndexes = [];
      const visibleNames = legendItems.filter(i => i.visible).map(i => i.name);
      this.chart.filter(isPieChart ? 'x' : 'type', val => {
        return visibleNames.indexOf(val) > -1;
      });
      this.chart.repaint();
      this.renderLegend(this.lastData, legendItems);
      ChartProcess.onRepaint && ChartProcess.onRepaint.call(this, this, ChartProcess);
    };

    clearLegend = () => {
      const legendContainer = document.querySelector(`#${getLegendId(this.chartId)}`);
      const values = legendContainer.querySelectorAll('.value');
      values.forEach(i => {
        i.innerHTML = '';
      });
    };

    render() {
      const { style = {}, width, height, config } = this.props;
      const backgroundColor = style.backgroundColor || color.widgetsColorWhite;
      const chartStyle = {
        position: 'relative',
        WebkitUserSelect: 'none',
        backgroundColor,
        overflow: 'hidden',
      };
      const canvasStyle = {
        backgroundColor,
      };

      if (config.legend.position === 'right') {
        chartStyle.display = 'flex';
        chartStyle.alignItems = 'center';
      }

      if (Array.isArray(config.appendPadding)) {
        const padding = config.appendPadding.map(i => `${i}px`).join(' ');
        chartStyle.padding = padding;
      }
      if (typeof config.appendPadding === 'number') {
        const padding = `${config.appendPadding}px`;
        chartStyle.padding = padding;
      }

      return (
        <div id={`${getContainerId(this.chartId)}`} style={chartStyle}>
          <div id={`${getLegendId(this.chartId)}`} style={{ width }} />
          <canvas ref={dom => (this.canvas = dom)} id={this.chartId} className={rootClassName + name} style={canvasStyle} />
        </div>
      );
    }
  }

  // 暴露原版类
  AismChart.Chart = Chart;

  function ChartHOC(props) {
    // 开始初始化图表
    const newProps = ChartProcess.beforeInit ? ChartProcess.beforeInit.call(this, props) : props;

    if (props.customChart) {
      Object.assign(newProps, props.customChart);
    }

    return <AismChart {...newProps} />;
  }

  return ChartHOC;
}

f2Factory.generateUniqueId = generateUniqueId;

export default f2Factory;
