import type { LocaleTextMap } from '../types';

const zhCN: LocaleTextMap = {
  loading: '加载中...',
  aiLoading: '图表正在生成中...',
  error: '数据异常',
  noData: '无数据',
  empty: '暂无数据',
  reset: '重置',
  current: '当前值',
  min: '最小值',
  max: '最大值',
  avg: '平均值',
  defaultMask: 'HH:mm:ss\nYYYY-MM-DD',
  timeMask: [
    ['YYYY'],
    ['YYYY-MM', 'YYYY-MM'],
    ['YYYY-MM-DD', 'MM-DD', 'MM-DD'],
    ['YYYY-MM-DD HH:mm', 'MM-DD HH:mm', 'MM-DD HH:mm', 'HH:mm'],
    ['YYYY-MM-DD HH:mm', 'MM-DD HH:mm', 'MM-DD HH:mm', 'HH:mm', 'HH:mm'],
    ['HH:mm:ss\nYYYY-MM-DD', 'MM-DD HH:mm:ss', 'MM-DD HH:mm:ss', 'HH:mm:ss', 'HH:mm:ss', 'HH:mm:ss', 'HH:mm:ss.SSS'],
    ['HH:mm:ss\nYYYY-MM-DD', 'MM-DD HH:mm:ss', 'MM-DD HH:mm:ss', 'HH:mm:ss', 'HH:mm:ss', 'HH:mm:ss.SSS', 'HH:mm:ss.SSS'],
  ],
};

const enUS: LocaleTextMap = {
  loading: 'Loading...',
  aiLoading: 'The chart is generating...',
  error: 'Error',
  noData: 'No Data',
  empty: 'No Data',
  reset: 'Reset',
  current: 'Current',
  min: 'Min',
  max: 'Max',
  avg: 'Avg',
  defaultMask: 'HH:mm:ss\nYYYY-MM-DD',
  timeMask: zhCN.timeMask,
};

const zhTW: LocaleTextMap = {
  loading: '載入中...',
  aiLoading: '圖表正在生成中...',
  error: '資料異常',
  noData: '無資料',
  empty: '暫無資料',
  reset: '重置',
  current: '當前值',
  min: '最小值',
  max: '最大值',
  avg: '平均值',
  defaultMask: 'HH:mm:ss\nYYYY-MM-DD',
  timeMask: zhCN.timeMask,
};

export const builtInLocales: Record<string, LocaleTextMap> = {
  'zh-cn': zhCN,
  'zh-CN': zhCN,
  'en-us': enUS,
  'en-US': enUS,
  'zh-tw': zhTW,
  'zh-TW': zhTW,
};

export const DEFAULT_LANGUAGE = 'zh-cn';
