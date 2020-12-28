import { isMobile } from './platform';
import { VERSION, THEME, FullTrackName, TrackName, FullCamelName } from '../constants';

/**
 * 日志记录
 *
 * 包含 chartLog  getLog 方法
 * */
const logMap: {
  [chartName: string]: {
    init: number;
  };
} = {};

/**
 * chartLog 图表日志
 *
 * @param {string} name 图表名称
 * @param {string} logType 单次日志类型
 * */
export default function chartLog(name: string, logType: string) {
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

let currentTheme = '';
export function themeLog(name: string) {
  currentTheme = name;
}

let trackable = window[FullTrackName] !== false;
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

// 打点逻辑，使用黄金令箭
const logUrl = `//gm.mmstat.com/${TrackName}`;
setTimeout(() => {
  if (trackable && process.env.NODE_ENV === 'production') {
    const chartInit = Object.keys(logMap).map((name) => {
      const chartLog = logMap[name];

      return `${name}:${chartLog.init}`;
    }).join(',');

    const image = new Image();
    // 统计 版本、主题、当前域名、图表初始化次数
    image.src = `${logUrl}?version=${VERSION}&theme=${currentTheme || THEME}&t=${Date.now()}&host=${location && location.host}&chartinit=${chartInit}&uamobile=${isMobile}`;
  }
}, 3000);

export function warn(component: string, info: string, ...other: any[]) {
  console.warn(`[${FullCamelName}] ${component}:`, info, ...other);
}
