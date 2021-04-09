'use strict';

import * as React from 'react';
import classNames from 'classnames';
import { CountUp } from './dep/CountUp';
import { filterKey } from "../common/common";
import { Types } from '../common/types';
import './index.scss';
import chartLog from "../common/log";
import { FullCrossName, PrefixName } from '../constants';

const prefix = `${PrefixName}-wcount`;

const checkKey = ['start', 'decimals', 'duration', 'useEasing', 'useGrouping', 'separator', 'decimal', 'placeholder'];
// 检查 a, b 两个对象中某些key是否有变化
function configChange(a: Types.LooseObject, b: Types.LooseObject) {
  return checkKey.some((key) => {
    return a[key] !== b[key];
  });
}

/**
 * 数字切片函数
 *
 * @param {number} start 起始值
 * @param {number} end 结束值
 * @param {number} clipNum 切片数
 * @param {number} slipScale 幅度数组
 *
 * @return {number[]} 切片后的数值数组
 * */
function clipValue(start: number, end: number, clipNum: number, slipScale: number[]) {
  const result: number[] = [];
  const delta = end - start;
  const step = delta / clipNum;

  // 循环次数为 clipNum - 1， 最后一次直接添加end，防止计算精度误差
  for (let i = 1; i < clipNum; i++) {
    if (slipScale[i]) {
      // 自定义切片
      result.push(start + slipScale[i] * delta);
    } else {
      // 平均切片
      result.push(start + step * i);
    }
  }

  result.push(end);

  return result;
}

interface WcountProps {
  className?: string;
  style?: React.CSSProperties;
  // 切片配置
  /** 切片更新数量，大于1时生效 */
  clipNum?: number;
  /** 切片更新周期，默认 5 秒 */
  clipPeriod?: number;
  /** 切片幅度数组，默认平均切片 */
  slipScale?: number[];
  // 数据配置
  /** 开始翻牌数值 */
  start?: number;
  /** 结束翻牌数值 */
  end?: number;
  /** 小数位数，默认 0 */
  decimals?: number;
  /** 翻牌持续时间，默认 1.5 秒 */
  duration?: number;
  // 额外配置
  /** 是否缓动函数翻牌 */
  useEasing?: boolean; // toggle easing
  /** 是否显示千分位 */
  useGrouping?: boolean; // 1,000,000 vs 1000000
  /** 千分位字符 */
  separator?: string; // character to use as a separator
  /** 小数点字符 */
  decimal?: string; // character to use as a decimal
  /** 无数据时字符 */
  placeholder?: string; // 非数据时的替换
}

export default class Wcount extends React.Component<WcountProps> {
  static displayName = 'Wcount';

  static defaultProps: WcountProps = {
    // 切片配置
    clipNum: 1,
    clipPeriod: 5,
    slipScale: [],
    // countUp 配置
    // 常用
    start: 0,
    end: 0,
    decimals: 0,
    duration: 1.5,
    // 额外配置
    useEasing: true, // toggle easing
    useGrouping: true, // 1,000,000 vs 1000000
    separator: ',', // character to use as a separator
    decimal: '.', // character to use as a decimal
    placeholder: "-", // 非数据时的替换
  };

  constructor(props: WcountProps) {
    super(props);

    // 图表初始化时记录日志
    chartLog('Wcount', 'init');
  }

  dom: HTMLSpanElement = null;
  countUp: CountUp = null;

  componentDidMount() {
    if (!this.dom) {
      return;
    }

    this.createCountUp(this.props);
  }

  componentDidUpdate(prevProps: WcountProps) {
    const { /*start: newStart,*/ end: newEnd, /*decimals: newDecimals, duration: newDuration,*/ ...newOptions } = this.props;
    const { /*start: oldStart,*/ end: oldEnd, /*decimals: oldDecimals, duration: oldDuration,*/ ...oldOptions } = prevProps;

    // 大部分配置项如果改变了，直接生成新的实例
    if (configChange(newOptions, oldOptions)) {
      this.createCountUp(this.props);
    } else if (newEnd !== oldEnd && this.countUp) {
      // 如果只有 end 改变了，更新数据
      this.clipNumber(newOptions, newEnd);
    }
  }

  componentWillUnmount() {
    // 清空定时器
    clearInterval(this.clipTimer);

    // 停止 countUp 组件
    if (this.countUp) {
      this.countUp.pauseResume();
    }
  }

  clipTimer: any = null;
  clipNumber(props: WcountProps, newEnd: number) {
    const { clipNum, clipPeriod, slipScale } = props;

    // 清空定时器
    clearInterval(this.clipTimer);

    if (clipNum > 1) {
      // 切片
      // 生成切片列表，每个周期更新一次
      const clipArray = clipValue(this.countUp.endVal, newEnd, clipNum, slipScale);
      let loopIndex = 0;
      // 定时更新
      this.clipTimer = setInterval(() => {
        this.countUp && this.countUp.update(clipArray[loopIndex]);

        loopIndex += 1;
        // 已更新完切片列表，清空定时器
        if (loopIndex >= clipArray.length) {
          clearInterval(this.clipTimer);
        }
      }, clipPeriod * 1000);
    } else {
      // 直接更新
      this.countUp.update(newEnd);
    }
  }

  createCountUp(props: WcountProps) {
    const { start, end, decimals, duration, ...options } = props;
    const countUp = new CountUp(this.dom, end, {
      startVal: start,
      decimalPlaces: decimals,
      duration,
      ...options,
    });
    if (!countUp.error) {
      countUp.start();
    } else {
      console.error(countUp.error);
    }

    this.countUp = countUp;
  }

  render() {
    const { className, ...otherProps } = this.props;

    const mainClasses = classNames({
      [FullCrossName]: true,
      [prefix]: true,
      [className]: !!className
    });

    return (
      <span ref={s => (this.dom = s)} className={mainClasses} {...filterKey(otherProps, checkKey.concat(['end', 'clipNum', 'clipPeriod', 'slipScale']))} />
    );
  }
}
