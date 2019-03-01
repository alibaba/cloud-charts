/**
 * 日志记录
 *
 * 包含 chartLog  getLog 方法
 * */

const logMap = {};

/**
 * chartLog 图表日志
 *
 * @param {string} name 图表名称
 * @param {string} logType 单次日志类型
 * */
export default function chartLog(name, logType) {
  if (!logMap[name]) {
    logMap[name] = {
      init: 0,
    };
  }

  if (logType === 'init') {
    logMap[name][logType] += 1;
  }
}

export function getLog() {
  return logMap;
}
