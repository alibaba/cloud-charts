'use strict';

import * as G2 from '@antv/g2';
import * as React from 'react';
import * as PropTypes from 'prop-types';
import { BaseChartConfig, ChartData, Size, Language } from "./types";
import { getParentSize, requestAnimationFrame, isEqualWith, merge } from './common';
import highchartsDataToG2Data from './dataAdapter';
import chartLog from './log';
import eventBus from './eventBus';
// import './g2Hacker';

// 图表唯一id
let uniqueId = 0;
function generateUniqueId(): string {
  return `react-g2-${uniqueId++}`;
}

const rootClassName = 'cloud-charts ';
const rootChildClassName = 'cloud-charts-children';

export interface ChartProps<ChartConfig> {
  className?: string;
  style?: React.CSSProperties;
  width?: Size;
  height?: Size;
  config?: ChartConfig;
  data?: ChartData;
  event?: {
    [eventKey: string]: () => void;
  };
  language?: Language;
  getChartInstance?: (chart: G2.Chart) => void;
  // G2 顶层属性
  padding?: G2.Types.ViewPadding;
  localRefresh?: boolean;
  renderer?: 'canvas' | 'svg';
}

/**
 * React 图表基类
 * */
class Base<ChartConfig extends BaseChartConfig> extends React.Component<ChartProps<ChartConfig>> {
  static propTypes = {
    width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    config: PropTypes.object,
    data: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.object),
      PropTypes.object,
    ]).isRequired,
    event: PropTypes.object,
    // forceFit: PropTypes.bool,
  };

  static defaultProps = {
    config: {},
  };

  static isG2Chart = true;

  public chartName = 'Base';

  public chart: G2.Chart;

  public chartDom: HTMLDivElement;

  readonly chartId: string;

  public defaultConfig: ChartConfig;

  protected language: Language;

  protected rawData: ChartData;

  constructor(props: ChartProps<ChartConfig>) {
    super(props);
    this.chart = null;
    this.chartDom = null;
    this.chartId = generateUniqueId();
    this.defaultConfig = ({} as ChartConfig);

    this.autoResize = this.autoResize.bind(this);
    this.rerender = this.rerender.bind(this);

    // 图表初始化时记录日志
    chartLog(this.chartName, 'init');
  }

  // 图表生命周期

  protected convertData: boolean = true;

  protected getDefaultConfig(): ChartConfig {
    return ({} as ChartConfig);
  }

  protected beforeInit?(props: ChartProps<ChartConfig>): ChartProps<ChartConfig>;

  protected init(chart: G2.Chart, config: ChartConfig, data: ChartData): void { };

  protected isChangeEqual?(objValue: any, othValue: any, key: number | string): undefined | boolean;

  protected changeData(chart: G2.Chart, config: ChartConfig, data: ChartData): void {
    chart && chart.changeData(data);
  };

  protected changeSize(chart: G2.Chart, config: ChartConfig, width: number, height: number): void {
    chart && chart.changeSize(width, height);
  };

  protected afterRender?(config: ChartConfig): void;

  protected destroy?(): void;


  // 基类自己的生命周期

  componentDidMount() {
    this.language = this.props.language || 'zh-cn';

    // 设置初始高宽
    this.initSize();

    this.initChart();

    eventBus.on('setTheme', this.rerender);
  }

  private isReRendering = false;

  // private reRenderTimer: any = null;

  rerender() {
    // 修复 变化过快时 chart.destroy 方法无法清除dom，导致dom重复的问题。
    if (this.isReRendering) {
      // window.cancelAnimationFrame(this.reRenderTimer);
    }

    this.isReRendering = true;
    this.handleDestroy();

    // this.reRenderTimer = requestAnimationFrame(() => {
      if (!this.chartDom) {
        return;
      }
      this.initSize();

      this.initChart();

      this.isReRendering = false;
    // });
  }

  isEqualCustomizer = (objValue: any, othValue: any, key: number | string): undefined | boolean => {
    const res = this.isChangeEqual ? this.isChangeEqual(objValue, othValue, key) : undefined;
    if (res !== undefined) {
      return res;
    }
    // 默认忽略全部function
    if (typeof objValue === 'function' && typeof othValue === 'function') {
      return true;
    }
    // 其余情况使用lodash的默认判断
    return undefined;
  };

  checkConfigChange(newConfig: ChartConfig, oldConfig: ChartConfig): boolean {
    let hasConfigChange = false;

    if (!isEqualWith(newConfig, oldConfig, this.isEqualCustomizer)) {
      hasConfigChange = true;
    }

    return hasConfigChange;
  }

  componentDidUpdate(prevProps: ChartProps<ChartConfig>) {
    const {
      data: newData,
      width: newWidth,
      height: newHeight,
      // padding: newPadding,
      config: newConfig,
      // changeConfig = true,
    } = this.props;
    const {
      data: oldData,
      width: oldWidth,
      height: oldHeight,
      // padding: oldPadding,
      config: oldConfig,
    } = prevProps;

    this.language = this.props.language || 'zh-cn';

    // 配置项有变化，重新生成图表
    // if (changeConfig !== false) {
      if (this.checkConfigChange(newConfig, oldConfig)) {
        this.rerender();

        return;
      }
    // }

    // if (newPadding !== oldPadding) {
    //   console.warn('padding 不支持修改');
    // }

    let needAfterRender = false;

    // 数据有变化
    if (
      newData !== oldData ||
      (Array.isArray(newData) &&
        Array.isArray(oldData) &&
        newData.length !== oldData.length)
    ) {
      const data =
        this.convertData &&
        newConfig.dataType !== 'g2'
          ? highchartsDataToG2Data(newData, newConfig)
          : newData;
      this.rawData = newData;
      this.changeData(this.chart, newConfig, data);
      // if (this.chartProcess.changeData) {
      //   this.chart &&
      //     this.chartProcess.changeData.call(
      //       this,
      //       this.chart,
      //       newConfig,
      //       data
      //     );
      // } else {
      //   this.chart && this.chart.changeData(data);
      // }

      needAfterRender = true;
    }
    // 传入的长宽有变化
    if (newWidth !== oldWidth || newHeight !== oldHeight) {
      this.handleChangeSize(newConfig, newWidth, newHeight);

      needAfterRender = true;
    }

    if (needAfterRender) {
      this.handleAfterRender(newConfig);
    }
  }

  // 渲染控制，仅 class、style、children 变化会触发渲染
  // shouldComponentUpdate(nextProps) {
  //   const { className: newClass, style: newStyle, children: newChild } = nextProps;
  //   const { className: oldClass, style: oldStyle, children: oldChild } = this.props;
  //   return newClass !== oldClass || newStyle !== oldStyle || newChild !== oldChild;
  // }

  // 准备销毁
  unmountCallbacks: ((chart: G2.Chart) => void)[] = [];

  handleDestroy() {
    // 清空缩放相关变量和事件
    this.resizeRunning = false;
    window.cancelAnimationFrame(this.resizeTimer);
    window.removeEventListener('resize', this.autoResize);
    // 清除配置变化重新生成图表的定时器
    // window.cancelAnimationFrame(this.reRenderTimer);
    // 清除afterRender的定时器
    clearTimeout(this.afterRenderTimer);

    if (this.destroy) {
      this.chart && this.destroy();
    }
    if (this.unmountCallbacks.length > 0) {
      this.unmountCallbacks.forEach(cb => {
        cb && cb.call(this, this.chart);
      });
    }

    this.chart && this.chart.destroy && this.chart.destroy();
    this.chart = null;
    // this.chartDom = null;
    // this.chartId = null;

    if (typeof this.props.getChartInstance === 'function') {
      this.props.getChartInstance(null);
    }

    this.afterRenderCallbacks = [];
    this.unmountCallbacks = [];
  }

  componentWillUnmount() {
    this.handleDestroy();

    eventBus.off('setTheme', this.rerender);
  }

  initChart() {
    this.defaultConfig = this.getDefaultConfig();
    // 合并默认配置项
    let currentProps: ChartProps<ChartConfig> = {
      ...this.props,
      config: merge({}, this.defaultConfig, this.props.config),
    };
    // 开始初始化图表
    if (this.beforeInit) {
      currentProps = this.beforeInit(currentProps);
    }
    const {
      width,
      height,
      data: initData,
      padding,
      // forceFit,
      config,
      event,
      ...otherProps
    } = currentProps;
    // 生成图表实例
    const chart = new G2.Chart({
      container: this.chartDom,
      width: this.size[0],
      height: this.size[1] || 200,
      padding,
      // forceFit: forceFit || false,
      // auto-padding 时自带的内边距
      // autoPaddingAppend: 3,
      ...otherProps,
    });

    // 预处理数据
    const data =
      this.convertData &&
      config.dataType !== 'g2'
        ? highchartsDataToG2Data(initData, config)
        : initData;
    this.rawData = initData;

    // 生命绘制逻辑
    chart && this.init(chart, config, data);

    // 开始渲染
    chart.render();

    // 绑定事件，这里透传了G2的所有事件，暂时不做额外封装
    if (chart && event) {
      Object.keys(event).forEach(eventKey => {
        chart.on(eventKey, event[eventKey]);
      });
    }

    this.chart = chart;

    if (typeof currentProps.getChartInstance === 'function') {
      currentProps.getChartInstance(chart);
    }

    this.handleAfterRender(config);
  }

  public size: number[] = [0, 0];

  // 初始化时适配高宽
  initSize() {
    const { width, height } = this.props;

    const parentSize = getParentSize(this.chartDom, width, height);

    this.setSize(parentSize);

    window.addEventListener('resize', this.autoResize);
  }

  handleChangeSize(config: ChartConfig, w: Size = this.size[0], h: Size = this.size[1]) {
    this.setSize([w, h]);

    // 强制转换为数字
    this.changeSize(this.chart, config, Number(w), Number(h));

    // if (this.chartProcess.changeSize) {
    //   this.chart &&
    //     this.chartProcess.changeSize.call(this, this.chart, config, w, h);
    // } else {
    //   this.chart && this.chart.changeSize(w, h);
    // }
  }

  // 动态适配高宽，利用 resizeRunning 做节流
  private resizeRunning = false;

  private resizeTimer: any = null;

  autoResize() {
    if (this.resizeRunning) {
      // this.resizeRunning = false;
      // window.cancelAnimationFrame(this.resizeTimer);
      return;
    }

    const { chartDom: element, props, size } = this;
    this.resizeRunning = true;

    this.resizeTimer = requestAnimationFrame(() => {
      this.resizeRunning = false;

      const parentSize = getParentSize(element, props.width, props.height);
      // 读取的高宽需要是有效值，0 也不可以
      if (
        !(parentSize[0] === size[0] && parentSize[1] === size[1]) &&
        parentSize[0] &&
        parentSize[1]
      ) {
        this.handleChangeSize(props.config, parentSize[0], parentSize[1]);

        this.handleAfterRender();
      }
    });
  }

  // 设置高宽
  setSize([w, h]: Size[]) {
    const element = this.chartDom;
    this.size = [Number(w), Number(h)];

    if (w) {
      element.style.width = `${w}px`;
    }
    if (h) {
      element.style.height = `${h}px`;
    }
  }

  protected afterRenderCallbacks: ((chart: G2.Chart, config: ChartConfig) => void)[] = [];

  protected afterRenderTimer: any = null;

  handleAfterRender(config?: ChartConfig) {
    if (this.afterRender || this.afterRenderCallbacks.length > 0) {
      this.afterRenderTimer = setTimeout(() => {
        if (this.chart && this.afterRender) {
          this.afterRender(config || this.props.config);
        }
        if (this.afterRenderCallbacks.length > 0) {
          this.afterRenderCallbacks.forEach(cb => {
            cb && cb.call(this, this.chart, config || this.props.config);
          });
        }
      }, 50);
    }
  }

  render() {
    const {
      className = '',
      style,
      children,
      data,
      width,
      height,
      padding,
      config,
      event,
      // animate,
      language,
      // customChart,
      getChartInstance,
      ...otherProps
    } = this.props;
    return (
      <div
        ref={dom => (this.chartDom = dom)}
        id={this.chartId}
        key={this.chartId}
        className={`${rootClassName + this.chartName} ${className}`}
        style={style}
        {...otherProps}>
        {children ? (
          <div className={rootChildClassName}>{children}</div>
        ) : null}
      </div>
    );
  }
}

// Base.propTypes = {
//   width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
//   height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
//   config: PropTypes.object,
//   data: PropTypes.oneOfType([
//     PropTypes.arrayOf(PropTypes.object),
//     PropTypes.object,
//   ]).isRequired,
//   event: PropTypes.object,
//   forceFit: PropTypes.bool,
// };

// Base.defaultProps = {
//   config: {},
// };

// Base.isG2Chart = true;

// Base.displayName = `CloudCharts${name}`;
//
// Base.baseClassName = rootClassName + name;

export default Base;
