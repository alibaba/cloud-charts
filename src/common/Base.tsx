'use strict';

import { Chart, View, registerAction } from '@antv/g2/esm';
import { registerTickMethod } from '@antv/scale/esm';
import * as React from 'react';
import { BaseChartConfig, ChartData, Size, Language, Types } from './types';
import { getParentSize, requestAnimationFrame, isEqualWith, merge } from './common';
import highchartsDataToG2Data from './dataAdapter';
import chartLog, { warn } from './log';
import eventBus from './eventBus';
import { FullCrossName } from '../constants';
import { ListChecked } from './interaction';
import { integer } from './tickMethod';
import BigDataType, { CalculationType } from './bigDataType';
import {
  checkEmptyData,
  checkBigData,
  checkColor,
  checkPadding,
  checkSize,
  checkSizeConfig,
  checkExtremeData,
} from './checkFunctions';
import EmptyDataType from './emptyDataType';
import themes from '../themes/index';

registerAction('list-checked', ListChecked);

registerTickMethod('integer', integer);

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
  /** 是否使用业务配置覆盖规则，默认为否。 */
  force?: boolean;
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

  public chart: Chart;

  public chartDom: HTMLDivElement;

  readonly chartId: string;

  public defaultConfig: ChartConfig;

  protected language: Language;

  protected rawData: ChartData;

  protected dataSize: number;

  private detectTimer: any;

  private bigDataConfig: any;

  private emptyState: boolean;

  constructor(props: Props) {
    super(props);
    this.chart = null;
    this.chartDom = null;
    this.chartId = generateUniqueId();
    this.defaultConfig = {} as ChartConfig;

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

  /** 防抖 */
  /*
  public debounceDetect(data: any) {
    if (this.detectTimer) {
      clearTimeout(this.detectTimer);
      this.detectTimer = null;
    }
    this.detectTimer = setTimeout(() => {
      return this.checkDataBeforeRender(data);
    }, 500);
  }
  */

  /** 计算数据量 */
  public calcDataSize(data: any) {
    if (!data) {
      this.dataSize = 0;
      return;
    }
    const type = this.bigDataConfig?.calculation;

    if (type === CalculationType.COMMON) {
      if (Array.isArray(data) && data.length > 0) {
        const types = Array.from(new Set(data.map((item: any) => item.type)));
        const typeCount = types.map((type: any) => data.filter((item: any) => item.type === type).length);
        this.dataSize = Math.max(...typeCount);
      } else {
        this.dataSize = 0;
      }
    } else if (type === CalculationType.COUNT) {
      this.dataSize = data?.length ?? 0;
    } else if (type === CalculationType.SPECIAL) {
      if (Array.isArray(data) && data.length > 0) {
        this.dataSize = Math.max(...data.map((item: any) => item?.data?.length ?? 0));
      } else {
        this.dataSize = 0;
      }
    } else if (type === CalculationType.LEVEL) {
      this.dataSize = this.calcTreeDataSize(data);
    }
  }

  private calcTreeDataSize(root: any) {
    let queue = [root];
    let res = 0;

    while (queue.length) {
      res = queue.length;
      let newQueue: any[] = [];
      queue.forEach((node: any) => {
        if (node?.children?.length) {
          newQueue = [...newQueue, ...node.children];
        }
      });
      queue = newQueue;
    }
    return res;
  }

  // todo: 检查数据格式

  /** 渲染前的数据检查 */
  public checkDataBeforeRender(data: any): {
    isEmpty?: boolean;
    isExtreme?: boolean;
    isExceed?: boolean;
    data?: any;
    config?: any;
    fillBackground?: boolean;
  } {
    // 检查空数据，若为空数据则返回覆盖的数据与配置项
    if (checkEmptyData(data, this.chartName)) {
      const { replacement, fillBackground } = (EmptyDataType as any)[this.chartName];
      const { data: replacementData, config: replacementConfig } = replacement;
      return {
        isEmpty: true,
        data: replacementData ?? null,
        config: replacementConfig ?? null,
        fillBackground,
      };
    }

    // 检查极端数据
    const {
      isExtreme,
      data: replacementData,
      config: replacementConfig,
    } = checkExtremeData(
      data,
      this.chartName,
      this.props.config,
      this.chartDom.offsetWidth,
      this.chartDom.offsetHeight,
      this.dataSize,
    );
    if (isExtreme) {
      return {
        isExtreme,
        data: replacementData ?? null,
        config: replacementConfig ?? null,
      };
    }

    // 检查大数据
    const isExceed = checkBigData(
      this.chartName,
      this.props.config,
      this.bigDataConfig?.exceedJudge,
      this.dataSize,
      this.chartDom.offsetWidth,
      this.chartDom.offsetHeight,
    );

    return {
      isExceed: isExceed,
      isEmpty: false,
      data: null,
      config: null,
      fillBackground: false,
    };
  }

  /** 更新数据 */
  public changeData(chart: Chart, config: ChartConfig, data: ChartData): void {
    chart && chart.changeData(data);
  }

  /** 更新尺寸 */
  public changeSize(chart: Chart, config: ChartConfig, width: number, height: number): void {
    chart && chart.changeSize(width, height);
  }

  /** @deprecated 图表渲染后回调 */
  // public afterRender?(config: ChartConfig): void;

  /** 销毁图表 */
  public destroy?(): void;

  // 基类自己的生命周期

  componentDidMount() {
    // 图表初始化时记录日志
    chartLog(this.chartName, 'init');

    this.language = this.props.language || 'zh-cn';

    // 设置初始高宽
    this.initSize();

    this.initChart();

    eventBus.on('setTheme', this.rerender);
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
      // changeConfig = true,
    } = this.props;
    const {
      data: oldData,
      width: oldWidth,
      height: oldHeight,
      config: oldConfig,
      event: oldEvent,
      interaction: oldInteraction,
    } = prevProps;

    this.language = this.props.language || 'zh-cn';

    // 配置项有变化，重新生成图表
    // if (changeConfig !== false) {
    if (this.checkConfigChange(newConfig, oldConfig)) {
      this.rerender();

      return;
    }
    // }

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
      newData !== oldData || (Array.isArray(newData) && Array.isArray(oldData) && newData.length !== oldData.length);
    const sizeChanged = newWidth !== oldWidth || newHeight !== oldHeight;

    // 数据与尺寸同时改变,或从空状态变成有数据状态
    if ((dataChanged && sizeChanged) || (dataChanged && this.emptyState)) {
      this.rerender();
    }

    // 数据有变化
    else if (dataChanged) {
      let mergeConfig = merge({}, this.defaultConfig, newConfig);
      const data =
        this.convertData && mergeConfig.dataType !== 'g2' ? highchartsDataToG2Data(newData, mergeConfig) : newData;
      this.rawData = newData;

      // 重新计算数据量
      this.calcDataSize(data);

      // 检查数据
      // 数据变化时，若替换配置项，必须重绘图表才能生效，因此此处暂不进行各种数据处理
      /*
      const { isExceed, isExtreme, config: specialConfig } = this.checkDataBeforeRender(data);

      // 极端数据处理
      if (isExtreme) {
        mergeConfig = merge({}, mergeConfig, specialConfig);
      }

      // 大数据情况下执行配置项的约束
      const configChecked = this.props?.force ? false : isExceed;
      if (configChecked) {
        const filterConfig = BigDataType?.[this.chartName]?.filterConfig ?? {};
        // 暂时这么写，做配置项的合并
        Object.keys(filterConfig)?.forEach((key: string) => {
          if (key === 'slider' && filterConfig?.[key]?.open) {
            // 缩略轴自适应
            mergeConfig[key] = {
              start: 1 - Math.max(((filterConfig?.[key]?.coef ?? 100) / this.dataSize).toFixed(2), 0.01),
              end: 1,
              ...(typeof mergeConfig[key] === 'object' ? mergeConfig[key] : {}),
            };
          } else {
            mergeConfig[key] = filterConfig?.[key];
          }
        });
      }
      */

      this.emitWidgetsEvent(newEvent, 'beforeWidgetsChangeData', mergeConfig, data);

      this.changeData(this.chart, mergeConfig, data);

      this.emitWidgetsEvent(newEvent, 'afterWidgetsChangeData', mergeConfig, data);

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
      this.handleChangeSize(newConfig, newWidth, newHeight);

      // needAfterRender = true;
    }

    // if (needAfterRender) {
    //   this.handleAfterRender(newConfig);
    // }
  }

  // 渲染控制，仅 class、style、children 变化会触发渲染
  // shouldComponentUpdate(nextProps) {
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
    window.removeEventListener('resize', this.autoResize);
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

    let currentProps: Props = {
      ...this.props,
      config: merge({}, this.defaultConfig, this.props.config),
    };

    // 开始初始化图表
    if (this.beforeInit) {
      currentProps = this.beforeInit(currentProps);
    }
    currentProps.config.padding = fixPadding(currentProps.padding || currentProps.config.padding);
    currentProps.config.appendPadding = currentProps.appendPadding || currentProps.config.appendPadding;
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
      ...otherProps
    } = currentProps;
    let { config } = currentProps;

    // 预处理数据
    const data = this.convertData && config.dataType !== 'g2' ? highchartsDataToG2Data(initData, config) : initData;
    this.rawData = initData;

    // 获取大数据判断参数
    this.bigDataConfig = (BigDataType as any)?.[this.chartName];

    // 判断是否特殊情况
    const specialCases = this.bigDataConfig?.specialCases ?? [];
    for (const sp of specialCases) {
      let isSame = true;
      Object.keys(sp?.config ?? {}).forEach((key: string) => {
        if ((this.props.config as any)?.[key] !== sp?.config?.[key]) {
          isSame = false;
        }
      });
      if (isSame) {
        this.bigDataConfig = sp;
        break;
      }
    }

    // 计算数据量
    this.calcDataSize(data);

    // 数据检查
    const {
      isEmpty,
      isExceed,
      isExtreme,
      data: specialData,
      config: specialConfig,
      fillBackground,
    } = this.checkDataBeforeRender(data);

    // 根据规则判断对图表配置项做一步处理
    // 合并特殊配置项
    if (isEmpty) {
      config = merge({}, config, specialConfig);

      // 空数据时双y轴取消
      if (Array.isArray(config?.yAxis) && !Array.isArray(specialConfig?.yAxis)) {
        config.yAxis = specialConfig.yAxis;
      }
    }

    // 这一部分可以写到空数据规则里面
    // 数据中name未指定时，legend与tooltip也不显示名称
    if (config?.legend && config?.legend?.nameFormatter) {
      config.legend.nameFormatter = (name: string, data: any, index: number) => {
        if (name.startsWith('undefined-name-')) {
          return '';
        }
        if (this.props.config?.legend?.nameFormatter) {
          return this.props.config?.legend?.nameFormatter(name, data, index);
        }
        return name;
      };
    }

    if (config?.tooltip && config?.tooltip?.nameFormatter) {
      config.tooltip.nameFormatter = (name: string, data: any, index: number, rawData: any) => {
        if (name.startsWith('undefined-name-')) {
          return '';
        }
        if (this.props.config?.tooltip?.nameFormatter) {
          return this.props.config?.tooltip?.nameFormatter(name, data, index, rawData);
        }
        return name;
      };
    }

    // 极端数据处理
    if (isExtreme) {
      config = merge({}, config, specialConfig);
    }

    // 大数据情况下执行配置项的约束
    const configChecked = force ? false : isExceed;
    if (configChecked) {
      const filterConfig = BigDataType?.[this.chartName]?.filterConfig ?? {};
      // 暂时这么写，做配置项的合并
      Object.keys(filterConfig)?.forEach((key: string) => {
        if (key === 'slider' && filterConfig?.[key]?.open) {
          // 缩略轴自适应
          config[key] = {
            start: 1 - Math.max(Number(((filterConfig?.[key]?.coef ?? 100) / this.dataSize).toFixed(2)), 0.01),
            end: 1,
            ...(typeof config[key] === 'object' ? config[key] : {}),
          };
        } else {
          config[key] = filterConfig?.[key];
        }
      });
    }

    // 生成图表实例
    const chart = new Chart({
      container: this.chartDom,
      width: this.size[0],
      height: this.size[1] || 200,
      padding: config.padding,
      appendPadding: config.appendPadding,
      // forceFit: forceFit || false,
      // auto-padding 时自带的内边距
      // autoPaddingAppend: 3,
      ...otherProps,
    });

    this.chart = chart;

    // 检测颜色规则
    checkColor(config, this.chartName, chart);
    // 检测间距
    checkPadding(config);
    // 检测尺寸
    checkSizeConfig(this.chartName, config);

    if (animate !== undefined) {
      warn('animate', '请使用 config.animate 设置动画开关。');
      // 将 props.animate 传入 config.animate
      if (config.animate === undefined) {
        config.animate = animate;
      }
    }

    this.emitWidgetsEvent(event, 'beforeWidgetsInit', config, data);

    // 绘制逻辑
    chart && this.init(chart, config, specialData ?? data);

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

    // 空数据处理
    if (isEmpty && !this.props.children) {
      // 设置背景色
      if (fillBackground) {
        this.chartDom.style.backgroundColor = themes['widgets-color-layout-background'];
      }

      // 加暂无数据提示
      chart.annotation().html({
        html: `
          <div style="display: flex; align-items: center;">
            <svg width="14px" height="14px" viewBox="0 0 1024 1024"><path d="M512 64c247.424 0 448 200.576 448 448s-200.576 448-448 448-448-200.576-448-448 200.576-448 448-448z m11.2 339.2h-64l-1.3888 0.032A32 32 0 0 0 427.2 435.2l0.032 1.3888A32 32 0 0 0 459.2 467.2h32v227.2H448l-1.3888 0.032A32 32 0 0 0 448 758.4h140.8l1.3888-0.032A32 32 0 0 0 588.8 694.4h-33.6V435.2l-0.032-1.3888A32 32 0 0 0 523.2 403.2zM512 268.8a44.8 44.8 0 1 0 0 89.6 44.8 44.8 0 0 0 0-89.6z" fill="#AAAAAA"></path></svg>
            <span style="font-size: 12px;color: #808080; margin-left: 5px;">暂无数据<span>
          </div>
        `,
        alignX: 'middle',
        alignY: 'middle',
        position: ['50%', '50%'],
      });
    } else {
      // 当不是无数据状态时需要删除对应背景色
      this.chartDom.style.removeProperty('background-color');
    }

    // 记录是否是空状态，用于无数据状态变成有数据状态的切换
    this.emptyState = isEmpty;

    // 后置检测
    chart.on('afterpaint', () => {
      // 检测图形尺寸与间距，目前仅检测柱状图的柱宽与间距
      checkSize(this.chartName, this.chart);
    });

    // 开始渲染
    chart.render();

    // this.handleAfterRender(config);
  }

  private emitWidgetsEvent(event: Record<string, Function> | undefined, name: string, ...args: any[]) {
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

    window.addEventListener('resize', this.autoResize);
  }

  handleChangeSize(config: ChartConfig, w: Size = this.size[0], h: Size = this.size[1]) {
    this.setSize([w, h]);

    const notSetAnimate = this.props.animate === undefined && (!config || config.animate === undefined);
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
      if (!(parentSize[0] === size[0] && parentSize[1] === size[1]) && parentSize[0] && parentSize[1]) {
        this.handleChangeSize(props.config, parentSize[0], parentSize[1]);

        // this.handleAfterRender();
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

  // protected afterRenderCallbacks: ((chart: Chart, config: ChartConfig) => void)[] = [];

  // protected afterRenderTimer: any = null;

  // handleAfterRender(config?: ChartConfig) {
  //   if (this.afterRender || this.afterRenderCallbacks.length > 0) {
  //     this.afterRenderTimer = setTimeout(() => {
  //       if (this.chart && this.afterRender) {
  //         this.afterRender(config || this.props.config);
  //       }
  //       if (this.afterRenderCallbacks.length > 0) {
  //         this.afterRenderCallbacks.forEach((cb) => {
  //           cb && cb.call(this, this.chart, config || this.props.config);
  //         });
  //       }
  //     }, 50);
  //   }

  //   // 大数据检测
  //   setTimeout(() => {
  //     this.throttleDetect();
  //   }, 500);
  // }

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
      localRefresh,
      renderer,
      syncViewPadding,
      customChart,
      getChartInstance,
      enableFunctionUpdate,
      ...otherProps
    } = this.props;
    return (
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
