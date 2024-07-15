// 复写G2时间轴标签计算方法
import { ScaleConfig } from '@antv/scale/esm/types';
import { filter, isNil, isNumber, last } from '@antv/util';
import { DAY, HOUR, MINUTE, MONTH, SECOND, YEAR } from '@antv/scale/esm/util/time';
import _ from 'lodash';

function getYear(date: number) {
  return new Date(date).getFullYear();
}

function createYear(year: number) {
  return new Date(year, 0, 1).getTime();
}

function getMonth(date: number) {
  return new Date(date).getMonth();
}

function diffMonth(min: number, max: number) {
  const minYear = getYear(min);
  const maxYear = getYear(max);
  const minMonth = getMonth(min);
  const maxMonth = getMonth(max);
  return (maxYear - minYear) * 12 + ((maxMonth - minMonth) % 12);
}

function creatMonth(year: number, month: number) {
  return new Date(year, month, 1).getTime();
}

function diffDay(min: number, max: number) {
  return Math.ceil((max - min) / DAY);
}

function diffHour(min: number, max: number) {
  return Math.ceil((max - min) / HOUR);
}

function diffMinus(min: number, max: number) {
  return Math.ceil((max - min) / (60 * 1000));
}

// 如果计算出来的ticks超出最大最小值，保证最大最小值正确，然后根据宽度和数据量均分
// 1. 确认最大最小值正确，默认刻度个数为7个
// 2. 用户自定义高于一切
// 3. 如果计算出来的的刻度数量小于默认刻度个数，则使用计算出来的刻度
function avgTicks(min: number, max: number, tickCount: number, sourceTicks: any) {
  // console.log(min, max, tickCount, sourceTicks);
  // const tickLength = sourceTicks?.length < tickCount ? sourceTicks?.length : tickCount;
  const tickLength = tickCount;
  const avg = (max - min) / (tickLength - 1 <= 0 ? 1 : tickLength - 1);

  const ticks = [];
  if(!isNil(min) && !isNil(max)){
    for (let i = min; i <= max; i += avg) {
      ticks.push(i);
    }
  }

  // if (_.isEqual(ticks, sourceTicks)) {
  //   console.log(1111)
  // }
  return ticks;
}

/**
 * 计算 time 的 ticks，对 month, year 进行 pretty 处理
 * @param cfg 度量的配置项
 * @returns 计算后的 ticks
 */
export function timePretty(cfg: ScaleConfig): number[] {
  const { min, max, minTickInterval, tickCount } = cfg;
  let { tickInterval } = cfg;
  let ticks: number[] = [];
  // 指定 tickInterval 后 tickCount 不生效，需要重新计算
  if (!tickInterval) {
    tickInterval = (max - min) / tickCount;
    // 如果设置了最小间距，则使用最小间距
    if (minTickInterval && tickInterval < minTickInterval) {
      tickInterval = minTickInterval;
    }
  }
  tickInterval = Math.max(Math.floor((max - min) / (2 ** 12 - 1)), tickInterval);
  const minYear = getYear(min);
  // 如果间距大于 1 年，则将开始日期从整年开始
  if (tickInterval > YEAR) {
    const maxYear = getYear(max);
    const yearInterval = Math.ceil(tickInterval / YEAR);
    for (let i = minYear; i <= maxYear + yearInterval; i = i + yearInterval) {
      ticks.push(createYear(i));
    }
  } else if (tickInterval > MONTH) {
    // 大于月时
    const monthInterval = Math.ceil(tickInterval / MONTH);
    const mmMoth = getMonth(min);
    const dMonths = diffMonth(min, max);
    for (let i = 0; i <= dMonths + monthInterval; i = i + monthInterval) {
      ticks.push(creatMonth(minYear, i + mmMoth));
    }
  } else if (tickInterval > DAY) {
    // 大于天
    const date = new Date(min);
    const year = date.getFullYear();
    const month = date.getMonth();
    const mday = date.getDate();
    const day = Math.ceil(tickInterval / DAY);
    const ddays = diffDay(min, max);
    for (let i = 0; i < ddays + day; i = i + day) {
      ticks.push(new Date(year, month, mday + i).getTime());
    }
  } else if (tickInterval > HOUR) {
    // 大于小时
    const date = new Date(min);
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    const hour = date.getHours();
    const hours = Math.ceil(tickInterval / HOUR);
    const dHours = diffHour(min, max);
    for (let i = 0; i <= dHours + hours; i = i + hours) {
      ticks.push(new Date(year, month, day, hour + i).getTime());
    }
  } else if (tickInterval > MINUTE) {
    // 大于分钟
    const dMinus = diffMinus(min, max);
    const minutes = Math.ceil(tickInterval / MINUTE);
    for (let i = 0; i <= dMinus + minutes; i = i + minutes) {
      ticks.push(min + i * MINUTE);
    }
  } else {
    // 小于分钟
    let interval = tickInterval;
    if (interval < SECOND) {
      interval = SECOND;
    }
    const minSecond = Math.floor(min / SECOND) * SECOND;
    const dSeconds = Math.ceil((max - min) / SECOND);
    const seconds = Math.ceil(interval / SECOND);
    for (let i = 0; i < dSeconds + seconds; i = i + seconds) {
      ticks.push(minSecond + i * SECOND);
    }
  }

  // 最好是能从算法能解决这个问题，但是如果指定了 tickInterval，计算 ticks，也只能这么算，所以
  // 打印警告提示
  if (ticks.length >= 512) {
    console.warn(
      `Notice: current ticks length(${ticks.length}) >= 512, may cause performance issues, even out of memory. Because of the configure "tickInterval"(in milliseconds, current is ${tickInterval}) is too small, increase the value to solve the problem!`,
    );
  }

  // 自己复写filter逻辑，当刻度计算小于6个的时候，且计算出的ticks有超出最大最小值的，只展示首尾
  // 1. 数据为1个。就只显示一个
  // 2. 数据为2个，则只显示首尾
  if ((ticks.length < 4 && ticks.length !== 1) && (ticks?.[0] < min || ticks?.[ticks.length - 1] > max)) {
    ticks = [min, max]
  }

  // 如果只展示了首尾展示，但是用户自定义了tickCount，则展示平均刻度
  if (ticks.length === 2 && tickCount > ticks.length) {
    ticks = avgTicks(min, max, tickCount, ticks);
  }

  // 通过配置项开启
  // 1. 数据超出3个点，至少保留三个点
  // ticks = avgTicks(min, max, tickCount, ticks);

  return ticks;
}

/**
 * 计算分类 ticks
 * @param cfg 度量的配置项
 * @returns 计算后的 ticks
 */
export default function calculateCatTicks(cfg: ScaleConfig): any[] {
  const { values, tickInterval, tickCount, showLast } = cfg;

  if (isNumber(tickInterval)) {
    const ticks = filter(values, (__: any, i: number) => i % tickInterval === 0);
    const lastValue = last(values);
    if (showLast && last(ticks) !== lastValue) {
      ticks.push(lastValue);
    }
    return ticks;
  }

  const len = values.length;
  let { min, max } = cfg;
  if (isNil(min)) {
    min = 0;
  }
  if (isNil(max)) {
    max = values.length - 1;
  }

  if (!isNumber(tickCount) || tickCount >= len) return values.slice(min, max + 1);
  if (tickCount <= 0 || max <= 0) return [];

  const interval = tickCount === 1 ? len : Math.floor(len / (tickCount - 1));
  const ticks = [];

  let idx = min;
  for (let i = 0; i < tickCount; i++) {
    if (idx >= max) break;

    idx = Math.min(min + i * interval, max);
    if (i === tickCount - 1 && showLast) ticks.push(values[max]);
    else ticks.push(values[idx]);
  }
  return ticks;
}

// 时间分类算法
export function timeCat(cfg: ScaleConfig): number[] {
  // 默认保留最后一条
  const ticks = calculateCatTicks({ showLast: true, ...cfg });
  return ticks;
}
