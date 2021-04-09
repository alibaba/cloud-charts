/**
 * Created by Maplor on 2018/3/22.
 */

export interface LocaleItem {
  loading: string;
  error: string;
  noData: string;
}

export default {
  'zh-cn': {
    loading: '加载中...',
    error: '数据异常',
    noData: '无数据',
  },
  'en-us': {
    loading: 'Loading...',
    error: 'Error',
    noData: 'No data',
  },
};
