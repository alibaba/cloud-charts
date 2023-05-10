'use strict';

import { Types, ChartData } from "./types";

const defaultMask = 'YYYY-MM-DD HH:mm:ss';
const MINUTE_MS = 60 * 1000;
const HOUR_MS = 3600 * 1000;
const DAY_MS = 24 * HOUR_MS;
const YEAR_MS = 365 * DAY_MS;
// 跨度判定列表：大于半年、大于一个月、大于一天、大于一小时、大于一分钟、（小于分钟）
const timeList = [0.51 * YEAR_MS, 28 * DAY_MS, DAY_MS, HOUR_MS, MINUTE_MS];
/*
| 间隔 \ 跨度 | 大于半年             | 大于一个月      | 大于一天        | 大于一小时  | 大于一分钟   | 小于分钟  |
| 大于半年    | YYYY                | -              | -              | -          | -          | -        |
| 大于一个月  | YYYY-MM             | YYYY-MM        | -              | -          | -          | -        |
| 大于一天    | YYYY-MM-DD          | MM-DD          | MM-DD          | -          | -          | -        |
| 大于一小时  | YYYY-MM-DD HH:mm    | MM-DD HH:mm    | MM-DD HH:mm    | HH:mm      | -          | -        |
| 大于一分钟  | YYYY-MM-DD HH:mm    | MM-DD HH:mm    | MM-DD HH:mm    | HH:mm      | HH:mm      | -        |
| 小于分钟    | YYYY-MM-DD HH:mm:ss | MM-DD HH:mm:ss | MM-DD HH:mm:ss | HH:mm:ss   | mm:ss      | mm:ss    |
*/
const maskMap = [
  ['YYYY'],
  ['YYYY-MM', 'YYYY-MM'],
  ['YYYY-MM-DD', 'MM-DD', 'MM-DD'],
  ['YYYY-MM-DD HH:mm', 'MM-DD HH:mm', 'MM-DD HH:mm', 'HH:mm'],
  ['YYYY-MM-DD HH:mm', 'MM-DD HH:mm', 'MM-DD HH:mm', 'HH:mm', 'HH:mm'],
  ['YYYY-MM-DD HH:mm:ss', 'MM-DD HH:mm:ss', 'MM-DD HH:mm:ss', 'HH:mm:ss', 'mm:ss', 'mm:ss'],
];

function getTimeIndex(t: number): number {
  for (let i = 0; i < timeList.length; i++) {
    if (t >= timeList[i]) {
      return i;
    }
  }
  return timeList.length;
}

/**
 * 自动计算时间格式。
 * @param defs {object} 数据列定义
 * @param data {array} G2图表实例
 * */
export default function (defs: Record<string, Types.ScaleOption>, data: ChartData): void {
  const def = defs.x;
  if (
    (def.type === 'time' || def.type === 'timeCat') &&
    def.mask === 'auto' &&
    Array.isArray(data) &&
    data[0] &&
    Array.isArray(data[0].data)
  ) {
    def.mask = getAutoMask(def, data[0].data);
  }
}

// 取数据的跨度和间距两种值，跨度决定上限，间距决定下限。
function getAutoMask(def: Types.ScaleOption, data: any): string {
  if (data.length < 2) {
    return defaultMask;
  }
  // 假设数据是升序的，且传入为 Date 能识别的格式
  // 只取第一、二个元素的间距
  const min = (new Date(data[0][0])).getTime();
  const minFirst = (new Date(data[1][0])).getTime();
  const max = (new Date(data[data.length - 1][0])).getTime();
  if (isNaN(min) || isNaN(max) || isNaN(minFirst)) {
    return defaultMask;
  }
  const span = max - min; // 间隔
  const interval = def.tickInterval || (minFirst - min); // 跨度

  const spanIndex = getTimeIndex(span);
  const intervalIndex = getTimeIndex(interval);

  // 如果记录表中没有记录，则使用默认 mask
  return maskMap[intervalIndex][spanIndex] || defaultMask;
}
