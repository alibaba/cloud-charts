import { isMobile } from './platform';
import {
  VERSION,
  THEME,
  FullTrackName,
  FullTestName,
  TrackName,
  FullCamelName,
  FullCrossName,
  FullQualityName,
} from '../constants';
import { calcChartScore, postMessage } from './postMessage';

/**
 * 日志记录
 *
 * 包含 chartLog  getLog 方法
 * */
const logMap: {
  [chartName: string]: {
    init: number;
    // 规则执行的错误统计
    rulesInfo: any;
    // 用户自定义的配置项
    configInfo: any;
    renderTimeArray: any;
  };
} = {};

/**
 * chartLog 图表日志
 *
 * @param {string} name 图表名称
 * @param {string} logType 单次日志类型
 * */
export default function chartLog(name: string, logType: string, logInfo?: any) {
  if (!logMap[name]) {
    logMap[name] = {
      init: 0,
      rulesInfo: [],
      configInfo: [],
      renderTimeArray: [],
    };
  }

  if (logType === 'init') {
    logMap[name][logType] += 1;
  } else if (logType === 'rulesInfo') {
    const chartClass = `${FullCrossName} ${name}`;
    logMap[name][logType].push({
      domInfo: {
        tagName: 'div',
        className: chartClass,
        selector: logInfo.selector,
      },
      checkItem: logInfo.checkItem,
      errorInfo: logInfo.errorInfo,
    });
  } else if (logType === 'configInfo') {
    logMap[name][logType].push(logInfo);
  } else if (logType === 'renderTime') {
    logMap[name]['renderTimeArray'].push(logInfo);
  }
}

export function getLog() {
  return logMap;
}

let currentTheme = '';
export function themeLog(name: string) {
  currentTheme = name;
}

let trackable = window[FullTrackName] !== false;
let testable = window[FullTestName] !== false;

/**
 * 打点控制函数
 *
 * @param {bool} enable 是否开启打点
 * */
export function track(enable: boolean): void {
  // 新版本中 G2 不再打点，所以关闭该指令
  // G2.track(enable);
  // F2.track(enable);
  trackable = enable;
}

/**
 * test控制函数
 *
 * @param {bool} enable 是否开启打点
 * */
export function test(enable: boolean): void {
  testable = enable;
}

// 打点逻辑，使用黄金令箭
const logUrl = `//gm.mmstat.com/${TrackName}`;
setTimeout(() => {
  // 规则计算部分
  if (testable) {
    const chartRulesResult = calcChartScore(logMap);
    console.log(chartRulesResult);
    // 方便图表获取质量分数
    // 增加一个当前统计的图表数量
    window[FullQualityName] = chartRulesResult;
    postMessage(chartRulesResult);
  }

  // 打点部分
  if (trackable && process.env.NODE_ENV === 'production') {
    const chartInit = Object.keys(logMap)
      .map((name) => {
        const chartLog = logMap[name];

        return `${name}:${chartLog.init}`;
      })
      .join(',');

    const image = new Image();
    // 统计 版本、主题、当前域名、图表初始化次数
    image.src = `${logUrl}?version=${VERSION}&theme=${currentTheme || THEME}&t=${Date.now()}&host=${
      location && location.host
    }&chartinit=${chartInit}&uamobile=${isMobile}`;
  }
}, 6000);

export function warn(component: string, info: string, ...other: any[]) {
  console.warn(`[${FullCamelName}] ${component}:`, info, ...other);
}
