'use strict';

exports.__esModule = true;

exports.default = function (defs, data) {
  var def = defs.x;
  if ((def.type === 'time' || def.type === 'timeCat') && def.mask === 'auto' && Array.isArray(data) && data[0] && Array.isArray(data[0].data)) {
    def.mask = getAutoMask(def, data[0].data);
  }
};

var defaultMask = 'YYYY-MM-DD HH:mm:ss';
var MINUTE_MS = 60 * 1000;
var HOUR_MS = 3600 * 1000;
var DAY_MS = 24 * HOUR_MS;
var YEAR_MS = 365 * DAY_MS;
// 跨度判定列表：大于半年、大于一个月、大于一天、大于一小时、大于一分钟、（小于分钟）
var timeList = [0.51 * YEAR_MS, 28 * DAY_MS, DAY_MS, HOUR_MS, MINUTE_MS];
/*
| 间隔 \ 跨度 | 大于半年             | 大于一个月      | 大于一天        | 大于一小时  | 大于一分钟   | 小于分钟  |
| 大于半年    | YYYY                | -              | -              | -          | -          | -        |
| 大于一个月  | YYYY-MM             | YYYY-MM        | -              | -          | -          | -        |
| 大于一天    | YYYY-MM-DD          | MM-DD          | MM-DD          | -          | -          | -        |
| 大于一小时  | YYYY-MM-DD HH:mm    | MM-DD HH:mm    | MM-DD HH:mm    | HH:mm      | -          | -        |
| 大于一分钟  | YYYY-MM-DD HH:mm    | MM-DD HH:mm    | MM-DD HH:mm    | HH:mm      | HH:mm      | -        |
| 小于分钟    | YYYY-MM-DD HH:mm:ss | MM-DD HH:mm:ss | MM-DD HH:mm:ss | HH:mm:ss   | mm:ss      | mm:ss    |
*/
var maskMap = [['YYYY'], ['YYYY-MM', 'YYYY-MM'], ['YYYY-MM-DD', 'MM-DD', 'MM-DD'], ['YYYY-MM-DD HH:mm', 'MM-DD HH:mm', 'MM-DD HH:mm', 'HH:mm'], ['YYYY-MM-DD HH:mm', 'MM-DD HH:mm', 'MM-DD HH:mm', 'HH:mm', 'HH:mm'], ['YYYY-MM-DD HH:mm:ss', 'MM-DD HH:mm:ss', 'MM-DD HH:mm:ss', 'HH:mm:ss', 'mm:ss', 'mm:ss']];
function getTimeIndex(t) {
  for (var i = 0; i < timeList.length; i++) {
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


// 取数据的跨度和间距两种值，跨度决定上限，间距决定下限。
function getAutoMask(def, data) {
  if (data.length < 2) {
    return defaultMask;
  }
  // 假设数据是升序的，且传入为 Date 能识别的格式
  var min = new Date(data[0][0]).getTime();
  var minFirst = new Date(data[1][0]).getTime();
  var max = new Date(data[data.length - 1][0]).getTime();
  if (isNaN(min) || isNaN(max) || isNaN(minFirst)) {
    return defaultMask;
  }
  var span = max - min;
  var interval = def.tickInterval || minFirst - min;

  var spanIndex = getTimeIndex(span);
  var intervalIndex = getTimeIndex(interval);
  if (intervalIndex > spanIndex) {
    return defaultMask;
  }
  return maskMap[intervalIndex][spanIndex];
}