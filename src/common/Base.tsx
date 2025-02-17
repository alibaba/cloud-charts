'use strict';

import { Chart, View } from '@antv/g2/esm';
import { registerTickMethod } from '@antv/scale/esm';
import * as React from 'react';
import { BaseChartConfig, ChartData, Size, Language, Types, Rule } from './types';
import { getParentSize, requestAnimationFrame, isEqualWith, merge, mapColors } from './common';
import highchartsDataToG2Data from './dataAdapter';
import chartLog, { warn } from './log';
import eventBus from './eventBus';
import { FullCrossName } from '../constants';
import { integer } from './tickMethod';
import {
  checkColor,
  checkPadding,
  checkSize,
  checkSizeConfig,
  checkSpecialConfig,
} from './checkFunctions';
import { ChartContext } from '../ChartProvider';
import chartRefs from './chartRefs';
import { runInitRule, runBeforePaintRule, runAfterDataChangedRule } from '../rule/runRule';
import { processFinalConfig } from '../rule/configRules';
import { processFinalData } from '../rule/dataRules';
import registerAopController from '../aop/controller/index';
import { convertThemeKey } from '../themes';
import { getG2theme } from '../themes/themeTools';
import { GlobalResizeObserver } from './globalResizeObserver';
import '../Wplaceholder/index.scss';

registerTickMethod('integer', integer);

registerAopController();

// 图表唯一id
let uniqueId = 0;
function generateUniqueId(): string {
  return `react-g2-${uniqueId++}`;
}

export const rootClassName = `${FullCrossName} `;
export const rootChildClassName = `${FullCrossName}-children`;

/** 修复旧版 padding 部分 auto 的设置导致图表白屏的问题 */
function fixPadding(padding: Types.ViewPadding | (number | string)[]) {
  if (Array.isArray(padding)) {
    for (let i = 0; i < padding.length; i++) {
      if (padding[i] === 'auto') {
        warn('config.padding', "不再支持 auto 和 数值 混用，请使用 config.padding = 'auto'");
        return 'auto';
      }
    }
  }
  return padding as Types.ViewPadding;
}

const needFixEventName = {
  plotenter: 'plot:enter',
  plotmove: 'plot:move',
  plotleave: 'plot:leave',
  plotclick: 'plot:click',
  plotdblclick: 'plot:dblclick',
};
/** 修复部分事件名称改变导致在新版不生效的问题 */
function fixEventName(eventName: string): string {
  // @ts-ignore
  if (needFixEventName[eventName]) {
    // @ts-ignore
    warn('event', `事件 ${eventName} 名称更改为：${needFixEventName[eventName]}`);
    // @ts-ignore
    return needFixEventName[eventName];
  }
  return eventName;
}

function setGeometryAnimateRecursive(view: View) {
  if (view.geometries) {
    const geometries = view.geometries;
    for (let i = 0; i < geometries.length; i++) {
      const geometry = geometries[i];
      geometry.animate(true);
    }
  }
  if (view.views) {
    const views = view.views;
    for (let i = 0; i < views.length; i++) {
      setGeometryAnimateRecursive(views[i]);
    }
  }
}

// function getGeometryAnimateRecursive(view: View, viewParentKey: string = 'root', result: Record<string, any> = {}) {
//   if (view.geometries) {
//     const geometries = view.geometries;
//     for (let i = 0; i < geometries.length; i++) {
//       const geometry = geometries[i];
//       result[`view${viewParentKey}-geom${i}`] = geometry.animateOption;
//     }
//   }
//   if (view.views) {
//     const views = view.views;
//     for (let i = 0; i < views.length; i++) {
//       getGeometryAnimateRecursive(views[i], `view${viewParentKey}-view${i}`, result);
//     }
//   }
//   return result;
// }

export interface ChartProps<ChartConfig> {
  className?: string;
  style?: React.CSSProperties;
  width?: Size;
  height?: Size;
  config?: ChartConfig;
  data?: ChartData;
  event?: {
    [eventKey: string]: Function;
  };
  interaction?: {
    [actionName: string]: Types.LooseObject;
  };
  language?: Language;
  /** 获取图表实例的回调 */
  getChartInstance?: (chart: Chart) => void;
  /** 是否响应配置项中的函数更新，默认关闭。 */
  enableFunctionUpdate?: boolean;
  // G2 顶层属性
  /**
   * 设置图表的内边距，使用方式参考 CSS 盒模型。
   * 下图黄色区域即为 padding 的范围。
   * ![](https://gw.alipayobjects.com/mdn/rms_2274c3/afts/img/A*pYwiQrdXGJ8AAAAAAAAAAABkARQnAQ)
   *
   * @example
   * 1. padding: 20
   * 2. padding: [ 10, 30, 30 ]
   */
  padding?: Types.ViewPadding;
  /**
   * 设置图表的内边距在padding的基础上增加appendPadding的调整。
   * @example
   * 1. padding: 20
   * 2. padding: [ 10, 30, 30 ]
   */
  appendPadding?: Types.ViewAppendPadding;
  /** 是否开启局部刷新，默认开启。 */
  localRefresh?: boolean;
  /** 指定渲染引擎，默认使用 canvas。 */
  renderer?: 'canvas' | 'svg';
  /**
   * 是否同步子 view 的 padding，可以是 boolean / SyncViewPaddingFn
   * 比如:
   *  view1 的 padding 10
   *  view2 的 padding 20
   * 那么两个子 view 的 padding 统一变成最大的 20.
   *
   * 如果是 Funcion，则使用自定义的方式去计算子 view 的 padding，这个函数中去修改所有的 views autoPadding 值
   */
  syncViewPadding?: boolean | Types.SyncViewPaddingFn;
  // 已废弃属性
  /** @deprecated 该属性移至 config.animate */
  animate?: boolean;
  /** @deprecated 自定义图表请使用类继承 */
  customChart?: any;
  /** 是否使用业务配置覆盖规则，默认为否。true表示关闭所有处理 */
  force?: Rule;
  /** loading状态 */
  loading?: boolean;
  /** 错误信息，非空时直接显示图表的异常状态 */
  errorInfo?: string;
  /** chartRef */
  chartRef?: React.MutableRefObject<any>;
  chartLifecycle?: {
    // 初始化时执行的操作
    init: () => {};
    // 开始获取数据时执行的操作
    fetchStart: () => {};
    // 获取数据结束时执行的操作
    fetchEnd: () => {};
    // 开始渲染时执行的操作
    renderStart: () => {};
    // 渲染结束时执行的操作
    renderEnd: () => {};
  };
}

/**
 * React 图表基类
 *
 * @template ChartConfig 泛型 - 配置项
 * @template Props 泛型 - Props参数
 * */
class Base<
  ChartConfig extends BaseChartConfig,
  Props extends ChartProps<ChartConfig> = ChartProps<ChartConfig>,
> extends React.Component<Props> {
  static defaultProps? = {};

  static isG2Chart = true;

  public chartName = 'Base';

  public legendField = 'type';

  public chart: Chart;

  public chartDom: HTMLDivElement;

  readonly chartId: string;

  public defaultConfig: ChartConfig;

  // 通过context传递的合并后的config
  public mergeConfig: ChartConfig;

  protected language: Language;

  protected rawData: ChartData;

  // protected dataSize: number;

  protected isEmpty: boolean;

  // private isBigData: boolean;

  // private isExtreme: boolean;

  // private errorInfo: string;

  // chartRef
  private ref: React.MutableRefObject<any> = React.createRef();

  static contextType = ChartContext;

  constructor(props: Props) {
    super(props);
    this.chart = null;
    this.chartDom = null;
    this.chartId = generateUniqueId();
    this.defaultConfig = this.getDefaultConfig();

    this.autoResize = this.autoResize.bind(this);
    this.rerender = this.rerender.bind(this);
  }

  // 图表生命周期

  /** 是否自动转换数据格式 */
  public convertData: boolean = true;

  /** 获取图表默认配置项 */
  public getDefaultConfig(): ChartConfig {
    return {} as ChartConfig;
  }

  /** 初始化前对props额外处理 */
  public beforeInit?(props: Props): Props;

  /** 初始化函数 */
  public init(chart: Chart, config: ChartConfig, data: ChartData): void {}

  /** 自定义判断配置项是否更改 */
  public isChangeEqual?(objValue: any, othValue: any, key: number | string): undefined | boolean;

  /** 更新数据 */
  public changeData(chart: Chart, config: ChartConfig, data: ChartData): void {
    chart && chart.changeData(data);
  }

  /** 更新尺寸 */
  public changeSize(chart: Chart, config: ChartConfig, width: number, height: number): void {
    chart && chart.changeSize(width, height);
  }

  /** 销毁图表 */
  public destroy?(): void;

  // 基类自己的生命周期

  componentDidMount() {
    // 图表初始化时记录日志
    chartLog(this.chartName, 'init');
    this.props.chartLifecycle?.init?.();

    this.language = this.props.language || this.context.language;

    // 设置初始高宽
    this.initSize();

    this.initChart();

    // 图表初始化时记录用户自定义配置项
    chartLog(this.chartName, 'configInfo', {
      chartId: this.chartId,
      config: this.props.config || {},
      chartName: this.chartName,
    });

    eventBus.on('setTheme', this.rerender);
    eventBus.on('setLanguage', this.rerender);
  }

  protected isReRendering = false;

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
    const enableFunctionUpdate = this.props.enableFunctionUpdate;
    // 默认忽略全部function，开启 enableFunctionUpdate 可以接受function更新
    if (!enableFunctionUpdate && typeof objValue === 'function' && typeof othValue === 'function') {
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

  componentDidUpdate(prevProps: Props) {
    const {
      data: newData,
      width: newWidth,
      height: newHeight,
      config: newConfig,
      event: newEvent,
      interaction: newInteraction,
      loading: newLoading,
      // changeConfig = true,
    } = this.props;
    const {
      data: oldData,
      width: oldWidth,
      height: oldHeight,
      // config: oldConfig,
      event: oldEvent,
      interaction: oldInteraction,
      loading: oldLoading,
    } = prevProps;

    this.language = this.props.language || this.context.language;

    // loading状态改变，直接重绘
    if (newLoading !== oldLoading) {
      this.rerender();
      return;
    }

    if (oldLoading && !newLoading) {
      this.initSize();

      this.initChart();
    }

    // 通过上下文传递的通用配置项
    const globalBaseConfig = this.context?.defaultConfig?.baseConfig;
    // 通过上下文传递的图表配置项
    const globalComsConfig = this.context?.defaultConfig?.[this.chartName.replace('G2', '')] ?? {};
    // 用户自定义 > 图表 > 通用 > 默认
    const newAllConfig = merge(
      {},
      this.defaultConfig,
      globalBaseConfig,
      globalComsConfig,
      newConfig,
    );

    // 处理padding
    newAllConfig.padding = fixPadding(prevProps.padding || newAllConfig.padding);
    newAllConfig.appendPadding = prevProps.appendPadding || newAllConfig.appendPadding;

    // 颜色映射
    newAllConfig.colors = mapColors(newAllConfig.colors);

    // 配置项有变化，重新生成图表
    // 还需要判断上下文传的config有没有发生变化
    // if (changeConfig !== false) {
    if (this.checkConfigChange(newAllConfig, this.mergeConfig)) {
      this.rerender();

      return;
    }
    // }
    // console.log('componentDidUpdate', getG2theme(convertThemeKey(this.context.theme)))

    // 判断context内的theme是否有变化
    if (this.context.theme) {
      this.chart.theme(getG2theme(convertThemeKey(this.context.theme)));
    }

    // 更新事件
    if (newEvent !== oldEvent) {
      // 清除旧事件
      Object.keys(oldEvent).forEach((eventKey) => {
        this.chart.off(fixEventName(eventKey), oldEvent[eventKey]);
      });
      // 绑定新事件
      Object.keys(newEvent).forEach((eventKey) => {
        this.chart.on(fixEventName(eventKey), newEvent[eventKey]);
      });
    }

    if (newInteraction !== oldInteraction) {
      // 清除旧交互
      Object.keys(oldInteraction).forEach((interactionName) => {
        this.chart.removeInteraction(interactionName);
      });
      // 绑定新交互
      Object.keys(newInteraction).forEach((interactionName) => {
        this.chart.interaction(interactionName, newInteraction[interactionName]);
      });
    }

    // let needAfterRender = false;

    const dataChanged =
      newData !== oldData ||
      (Array.isArray(newData) && Array.isArray(oldData) && newData.length !== oldData.length);
    const sizeChanged = newWidth !== oldWidth || newHeight !== oldHeight;

    // 数据与尺寸同时改变,直接重绘
    if (dataChanged && sizeChanged) {
      this.rerender();
      return;
    }

    // 数据有变化
    else if (dataChanged) {
      const data =
        this.convertData && newAllConfig.dataType !== 'g2'
          ? highchartsDataToG2Data(newData, newAllConfig)
          : newData;
      this.rawData = newData;

      // 运行规则
      // 目前仅检测极端数据
      // 数据变化时，若替换配置项，必须重绘图表才能生效
      const needRerender = runAfterDataChangedRule(this, newAllConfig, data);

      // 必须重绘的场景：空数据变成有数据、极端与非极端切换、异常与非异常切换
      if (needRerender) {
        this.rerender();
        return;
      }

      this.emitWidgetsEvent(newEvent, 'beforeWidgetsChangeData', newAllConfig, data);

      this.changeData(this.chart, newAllConfig, data);

      this.emitWidgetsEvent(newEvent, 'afterWidgetsChangeData', newAllConfig, data);
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

      // needAfterRender = true;
    }

    // 传入的长宽有变化
    else if (sizeChanged) {
      this.handleChangeSize(newAllConfig, newWidth, newHeight);

      // needAfterRender = true;
    }

    // if (needAfterRender) {
    //   this.handleAfterRender(newConfig);
    // }
  }

  // 渲染控制，仅 class、style、children 变化会触发渲染
  // shouldComponentUpdate(nextProps) {
  //   console.log('shouldComponentUpdate', nextProps);
  //   const { className: newClass, style: newStyle, children: newChild } = nextProps;
  //   const { className: oldClass, style: oldStyle, children: oldChild } = this.props;
  //   return newClass !== oldClass || newStyle !== oldStyle || newChild !== oldChild;
  // }

  // 准备销毁
  unmountCallbacks: ((chart: Chart) => void)[] = [];

  handleDestroy() {
    // 清空缩放相关变量和事件
    this.resizeRunning = false;
    window.cancelAnimationFrame(this.resizeTimer);

    // 在卸载的阶段调用
    const { chartDom: element } = this;
    // 获取父元素
    const parent = element && element.parentElement.parentElement;
    if (parent) {
      GlobalResizeObserver.unobserve(parent);
    }

    // 清除配置变化重新生成图表的定时器
    // window.cancelAnimationFrame(this.reRenderTimer);
    // 清除afterRender的定时器
    // clearTimeout(this.afterRenderTimer);

    if (this.destroy) {
      this.chart && this.destroy();
    }
    if (this.unmountCallbacks.length > 0) {
      this.unmountCallbacks.forEach((cb) => {
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

    // this.afterRenderCallbacks = [];
    this.unmountCallbacks = [];
  }

  componentWillUnmount() {
    this.handleDestroy();

    eventBus.off('setTheme', this.rerender);
  }

  initChart() {
    // 合并默认配置项
    this.defaultConfig = this.getDefaultConfig();
    // 通过上下文传递的通用配置项 - 全局通用配置项
    const globalBaseConfig = this.context?.defaultConfig?.baseConfig;
    // 通过上下文传递的图表配置项 - 全局图表配置项
    const globalComsConfig = this.context?.defaultConfig?.[this.chartName.replace('G2', '')] ?? {};
    // 是否执行全局规则使用 - 默认为否（待规则完善后再默认开启）
    let globalRule = false;

    // 默认不传该配置项
    if (typeof this.props.force === undefined) {
      globalRule = !!this.context?.rule;
    } else if (typeof this.props.force === 'boolean') {
      // 属性优先级 > 上下文
      globalRule = this.props.force;
    } else if (typeof this.context?.rule === 'object' && typeof this.props.force === 'object') {
      globalRule = merge({}, this.context?.rule, this.props.force);
    }

    let currentProps: Props = {
      ...this.props,
      config: merge({}, this.defaultConfig, globalBaseConfig, globalComsConfig, this.props.config),
      force: globalRule,
    };

    // 开始初始化图表
    if (this.beforeInit) {
      currentProps = this.beforeInit(currentProps);
    }

    // 处理padding
    // todo: 加入规则体系中
    currentProps.config.padding = fixPadding(currentProps.padding || currentProps.config.padding);
    currentProps.config.appendPadding =
      currentProps.appendPadding || currentProps.config.appendPadding;

    // 颜色映射
    currentProps.config.colors = mapColors(currentProps.config.colors);

    // 用户自定义 > 图表 > 通用 > 默认
    this.mergeConfig = currentProps.config;

    const {
      width,
      height,
      data: initData,
      // padding,
      // forceFit,
      event,
      interaction,
      animate,
      force,
      chartLifecycle,
      localRefresh = false,
      ...otherProps
    } = currentProps;
    let { config } = currentProps;

    // 预处理数据
    let data =
      this.convertData && config.dataType !== 'g2'
        ? highchartsDataToG2Data(initData, config)
        : initData;
    this.rawData = initData;

    // 初始化规则
    const { data: specialData, config: specialConfig } = runInitRule(this, config, data);
    data = specialData ?? data;
    config = specialConfig ?? config;

    // 后置配置项处理
    config = processFinalConfig(this, config);

    // 后置数据处理
    const { data: finalData, config: finalConfig } = processFinalData(this, data, config);
    data = finalData;
    config = finalConfig;

    // 特殊配置项检测
    // 目前仅对线图、线点图与散点图微调x轴range
    // todo: 加入规则体系
    // const extraConfig = checkSpecialConfig(this.chartName, config, force);
    // config = merge({}, config, extraConfig);

    // 检测饼图、多重饼图、多重圆环是否有chilren
    // if (['G2Pie', 'G2MultiPie', 'G2MultiCircle'].includes(this.chartName) && this.props.children) {
    //   // @ts-ignore
    //   if (this.props.config?.innerContent) {
    //     warn(`W${this.chartName.slice(2)}`, '图表的中心内容innerContent配置项会被chilren覆盖，建议删除chilren');
    //   } else {
    //     warn(`W${this.chartName.slice(2)}`, '推荐通过innerContent配置项设置中心内容');
    //   }
    // }

    // 生成图表实例
    const chart = new Chart({
      container: this.chartDom,
      width: this.size[0],
      height: this.size[1] || 200,
      padding: config.padding,
      appendPadding: config.appendPadding,
      localRefresh: localRefresh,
      limitInPlot: false,
      // forceFit: forceFit || false,
      // auto-padding 时自带的内边距
      // autoPaddingAppend: 3,
      ...otherProps,
    });

    this.chart = chart;

    // 绑定上下文
    // @ts-ignore
    this.chart.widgetsCtx = this;

    // 上下文的主题配置, 优先级高于全局变量 ｜ 全局事件
    if (this.context?.theme) {
      this.chart.theme(getG2theme(convertThemeKey(this.context.theme)));
    }

    // todo: 加入规则体系
    // 检测颜色规则
    checkColor(config, this.chartName, chart);
    // 检测间距
    checkPadding(config, this.chartName, chart);
    // 检测尺寸
    checkSizeConfig(this.chartName, config, this.size[0], this.size[1] || 200);

    if (animate !== undefined) {
      warn('animate', '请使用 config.animate 设置动画开关。');
      // 将 props.animate 传入 config.animate
      if (config.animate === undefined) {
        config.animate = animate;
      }
    }

    this.emitWidgetsEvent(event, 'beforeWidgetsInit', config, data);

    // 绘制逻辑
    chart && this.init(chart, config, data);

    this.emitWidgetsEvent(event, 'afterWidgetsInit', config, data);

    // 全局动画设置
    if (typeof config.animate === 'boolean') {
      chart.animate(config.animate);
    }

    // 绑定事件，这里透传了G2的所有事件，暂时不做额外封装
    if (chart && event) {
      Object.keys(event).forEach((eventKey) => {
        chart.on(fixEventName(eventKey), event[eventKey]);
      });
    }

    // 绑定交互
    if (chart && interaction) {
      Object.keys(interaction).forEach((interactionName) => {
        chart.interaction(interactionName, interaction[interactionName]);
      });
    }

    if (typeof currentProps.getChartInstance === 'function') {
      currentProps.getChartInstance(chart);
    }

    // 渲染前规则
    runBeforePaintRule(this, config, data);

    // 后置检测
    chart.on('afterpaint', () => {
      // todo: 加入规则体系
      // 检测图形尺寸与间距，目前仅检测柱状图的柱宽与间距
      checkSize(this.chartName, this.chart);
    });

    const startTime = new Date().getTime();
    chartLifecycle?.renderStart?.();

    // 开始渲染
    chart.render();

    const endTime = new Date().getTime();
    chartLifecycle?.renderEnd?.();

    chartLog(this.chartName, 'renderTime', {
      chartId: this.chartId,
      chartName: this.chartName,
      renderTime: endTime - startTime,
    });

    // this.handleAfterRender(config);

    // 绑定ref
    this.ref.current = chartRefs(this, config);
    if (this.props.chartRef) {
      this.props.chartRef.current = this.ref.current;
    }
  }

  private emitWidgetsEvent(
    event: Record<string, Function> | undefined,
    name: string,
    ...args: any[]
  ) {
    if (this.chart && event && event[name]) {
      event[name].apply(this.chart, args);
    }
  }

  public size: number[] = [0, 0];

  // 初始化时适配高宽
  initSize() {
    const { width, height } = this.props;

    const parentSize = getParentSize(this.chartDom, width, height);

    this.setSize(parentSize);

    const { chartDom: element } = this;
    // 获取父元素
    const parent = element && element.parentElement.parentElement;
    if (parent) {
      GlobalResizeObserver.observe(parent, this.autoResize);
    }
  }

  handleChangeSize(config: ChartConfig, w: Size = this.size[0], h: Size = this.size[1]) {
    this.setSize([w, h]);

    const notSetAnimate =
      this.props.animate === undefined && (!config || config.animate === undefined);
    if (notSetAnimate) {
      this.chart.animate(false);
    }
    // 强制转换为数字
    this.changeSize(this.chart, config, Number(w), Number(h));
    if (notSetAnimate) {
      this.chart.animate(true);
      // G2 关闭 view 动画后，在渲染时会递归关闭所有 geom 的动画，这里需要反向操作手动开启 animate
      setGeometryAnimateRecursive(this.chart);
    }

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

        // this.handleAfterRender();
      }
    });
  }

  // 设置高宽
  setSize([w, h]: Size[]) {
    const element = this.chartDom;
    this.size = [Number(w), Number(h) || 200];

    if (w) {
      element.style.width = `${w}px`;
    }
    if (h) {
      element.style.height = `${h}px`;
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
      appendPadding,
      config,
      event,
      interaction,
      animate,
      language,
      localRefresh = false,
      renderer,
      syncViewPadding,
      customChart,
      getChartInstance,
      enableFunctionUpdate,
      loading,
      errorInfo,
      chartRef,
      force,
      ...otherProps
    } = this.props;

    const position = (
      config?.legend?.position ??
      this.defaultConfig?.legend?.position ??
      'bottom'
    ).split('-')[0];

    return (
      <div
        style={{
          position: 'relative',
          width: width ? `${width}px` : '100%',
          height: height ? `${height}px` : '100%',
          display: 'flex',
          // 部分图表的legend默认开启table布局
          flexDirection:
            (config?.legend?.table || this.defaultConfig?.legend?.table) && position === 'right' ? 'row' : 'column',
        }}
      >
        <div
          ref={(dom) => (this.chartDom = dom)}
          id={this.chartId}
          key={this.chartId}
          className={`${rootClassName + this.chartName} ${className}`}
          style={style}
          {...otherProps}
        >
          {children ? <div className={rootChildClassName}>{children}</div> : null}
        </div>
      </div>
    );
  }
}

// Base.baseClassName = rootClassName + name;

export default Base;

export interface BaseClass<ChartConfig, Props = {}> {
  new (props: Props): Base<ChartConfig, Props>;
  isG2Chart: boolean;
  displayName?: string;
  defaultProps?: Partial<Props>;
}
