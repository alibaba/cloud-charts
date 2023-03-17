export interface LocaleItem {
  loading: string;
  error: string;
  noData: string;
  empty: string;
  reset: string
}

export default {
  'zh-cn': {
    loading: '加载中...',
    error: '数据异常',
    noData: '无数据',
    empty: '暂无数据',
    reset: '重置',
  },
  'en-us': {
    loading: 'Loading...',
    error: 'Error',
    noData: 'No data',
    empty: 'No data',
    reset: 'Reset',
  },
};
