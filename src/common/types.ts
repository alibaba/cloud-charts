import {
  ColorAttrCallback,
  ViewPadding,
  ViewAppendPadding,
  AnimateOption,
} from '@antv/g2/esm/interface';

export * from '@antv/g2/esm/core';

export * as G2Dependents from '@antv/g2/esm/dependents';
export * as G2DInterfaces from '@antv/g2/esm/interface';

export interface BaseChartConfig {
  /**
   * 设置图表的内边距，使用方式参考 CSS 盒模型。
   * 下图黄色区域即为 padding 的范围。
   * ![](https://gw.alipayobjects.com/mdn/rms_2274c3/afts/img/A*pYwiQrdXGJ8AAAAAAAAAAABkARQnAQ)
   *
   * @example
   * 1. padding: 20
   * 2. padding: [ 10, 30, 30 ]
   */
  padding?: ViewPadding;
  /**
   * 设置图表的内边距在padding的基础上增加appendPadding的调整。
   * @example
   * 1. padding: 20
   * 2. padding: [ 10, 30, 30 ]
   */
  appendPadding?: ViewAppendPadding;
  dataType?: string;
  /** 是否开启动画，默认开启。目前仅 线、柱、饼图支持 AnimateOption 选项 */
  animate?: AnimateOption | boolean;
}

export type ChartData = any;

export type Size = number | string;

export type Status = 'error' | 'warning' | 'normal' | 'success' | 'none';

export type StatusColor = 'red' | 'orange' | 'blue' | 'green' | 'gray';

export type Language = 'zh-cn' | 'en-us' | 'zh-CN' | 'en-US' | 'zh-tw' | 'zh-TW';

export type Trend = 'raise' | 'drop';

export type Colors = string | string[] | ColorAttrCallback;

export type Rule =
  | boolean
  | {
      /** 极端数据场景开关,true表示关闭对应处理 */
      extreme?:
        | boolean
        | {
            // 柱图是否左对齐
            alignLeft?: boolean;
            // 是否显示占位
            showPlaceholder?: boolean;
          };
      /** 大数据场景开关，true表示关闭对应处理 */
      bigdata?: boolean;
    };
