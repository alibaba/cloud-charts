export const SECOND = 1000;
export const MINUTE = 60 * SECOND;
export const HOUR = 60 * MINUTE;
export const DAY = 24 * HOUR;
export const MONTH = 31 * DAY;
export const YEAR = 365 * DAY;

export interface ScaleTickConfig {
  min?: number;
  max?: number;
  values?: unknown[];
  tickCount?: number;
  tickInterval?: number;
  minTickInterval?: number;
  showLast?: boolean;
}

function getYear(date: number): number {
  return new Date(date).getFullYear();
}

function createYear(year: number): number {
  return new Date(year, 0, 1).getTime();
}

function getMonth(date: number): number {
  return new Date(date).getMonth();
}

function diffMonth(min: number, max: number): number {
  const minYear = getYear(min);
  const maxYear = getYear(max);
  const minMonth = getMonth(min);
  const maxMonth = getMonth(max);
  return (maxYear - minYear) * 12 + ((maxMonth - minMonth) % 12);
}

function createMonth(year: number, month: number): number {
  return new Date(year, month, 1).getTime();
}

function diffDay(min: number, max: number): number {
  return Math.ceil((max - min) / DAY);
}

function diffHour(min: number, max: number): number {
  return Math.ceil((max - min) / HOUR);
}

function diffMinute(min: number, max: number): number {
  return Math.ceil((max - min) / MINUTE);
}

function isNil(value: unknown): boolean {
  return value === undefined || value === null;
}

function avgTicks(min: number, max: number, tickCount: number): number[] {
  const tickLength = tickCount;
  const average = (max - min) / (tickLength - 1 <= 0 ? 1 : tickLength - 1);

  const ticks: number[] = [];
  if (!isNil(min) && !isNil(max)) {
    for (let value = min; value <= max; value += average) {
      ticks.push(value);
    }
  }

  return ticks;
}

/**
 * 计算 time 的 ticks，对 month/year 进行 pretty 处理。
 * 复现旧 common/autoTimeTicksMethod.ts 的 timePretty，去除 @antv/scale 与 lodash 依赖。
 */
export function timePretty(cfg: ScaleTickConfig): number[] {
  const { min = 0, max = 0, minTickInterval, tickCount = 7 } = cfg;
  let { tickInterval } = cfg;
  let ticks: number[] = [];

  if (!tickInterval) {
    tickInterval = (max - min) / tickCount;
    if (minTickInterval && tickInterval < minTickInterval) {
      tickInterval = minTickInterval;
    }
  }
  tickInterval = Math.max(Math.floor((max - min) / (2 ** 12 - 1)), tickInterval);

  const minYear = getYear(min);
  if (tickInterval > YEAR) {
    const maxYear = getYear(max);
    const yearInterval = Math.ceil(tickInterval / YEAR);
    for (let i = minYear; i <= maxYear + yearInterval; i += yearInterval) {
      ticks.push(createYear(i));
    }
  } else if (tickInterval > MONTH) {
    const monthInterval = Math.ceil(tickInterval / MONTH);
    const baseMonth = getMonth(min);
    const totalMonths = diffMonth(min, max);
    for (let i = 0; i <= totalMonths + monthInterval; i += monthInterval) {
      ticks.push(createMonth(minYear, i + baseMonth));
    }
  } else if (tickInterval > DAY) {
    const date = new Date(min);
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    const dayStep = Math.ceil(tickInterval / DAY);
    const totalDays = diffDay(min, max);
    for (let i = 0; i < totalDays + dayStep; i += dayStep) {
      ticks.push(new Date(year, month, day + i).getTime());
    }
  } else if (tickInterval > HOUR) {
    const date = new Date(min);
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    const hour = date.getHours();
    const hourStep = Math.ceil(tickInterval / HOUR);
    const totalHours = diffHour(min, max);
    for (let i = 0; i <= totalHours + hourStep; i += hourStep) {
      ticks.push(new Date(year, month, day, hour + i).getTime());
    }
  } else if (tickInterval > MINUTE) {
    const totalMinutes = diffMinute(min, max);
    const minuteStep = Math.ceil(tickInterval / MINUTE);
    for (let i = 0; i <= totalMinutes + minuteStep; i += minuteStep) {
      ticks.push(min + i * MINUTE);
    }
  } else if (tickInterval > SECOND) {
    let interval = tickInterval;
    if (interval < SECOND) {
      interval = SECOND;
    }
    const minSecond = Math.floor(min / SECOND) * SECOND;
    const totalSeconds = Math.ceil((max - min) / SECOND);
    const secondStep = Math.ceil(interval / SECOND);
    for (let i = 0; i < totalSeconds + secondStep; i += secondStep) {
      ticks.push(minSecond + i * SECOND);
    }
  } else {
    const totalSeconds = Math.ceil((max - min) / tickInterval);
    for (let i = 0; i < totalSeconds + tickInterval; i += 1) {
      ticks.push(min + i * tickInterval);
    }
  }

  if (ticks.length < 4 && ticks.length !== 1 && (ticks[0] < min || ticks[ticks.length - 1] > max)) {
    ticks = [min, max];
  }

  if (ticks.length === 2 && tickCount > ticks.length) {
    ticks = avgTicks(min, max, tickCount);
  }

  return ticks;
}

/** 计算分类 ticks，复现旧 calculateCatTicks。 */
export function calculateCatTicks(cfg: ScaleTickConfig): unknown[] {
  const { values = [], tickInterval, tickCount, showLast } = cfg;

  if (typeof tickInterval === 'number') {
    const ticks = values.filter((__, index) => index % tickInterval === 0);
    const lastValue = values[values.length - 1];
    if (showLast && ticks[ticks.length - 1] !== lastValue) {
      ticks.push(lastValue);
    }
    return ticks;
  }

  const length = values.length;
  let { min, max } = cfg;
  if (isNil(min)) {
    min = 0;
  }
  if (isNil(max)) {
    max = values.length - 1;
  }

  const minIndex = min as number;
  const maxIndex = max as number;

  if (typeof tickCount !== 'number' || tickCount >= length) {
    return values.slice(minIndex, maxIndex + 1);
  }
  if (tickCount <= 0 || maxIndex <= 0) {
    return [];
  }

  const interval = tickCount === 1 ? length : Math.floor(length / (tickCount - 1));
  const ticks: unknown[] = [];

  let idx = minIndex;
  for (let i = 0; i < tickCount; i += 1) {
    if (idx >= maxIndex) {
      break;
    }
    idx = Math.min(minIndex + i * interval, maxIndex);
    if (i === tickCount - 1 && showLast) {
      ticks.push(values[maxIndex]);
    } else {
      ticks.push(values[idx]);
    }
  }
  return ticks;
}

/** 时间分类算法，默认保留最后一条，复现旧 timeCat。 */
export function timeCat(cfg: ScaleTickConfig): unknown[] {
  return calculateCatTicks({ showLast: true, ...cfg });
}
