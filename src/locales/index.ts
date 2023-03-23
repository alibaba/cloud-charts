import zhCN from './zh-cn';
import enUS from './en-us';

export interface LocaleItem {
  loading: string;
  error: string;
  noData: string;
  empty: string;
  reset: string;
}

export default {
  'zh-cn': zhCN,
  'en-us': enUS,
  'zh-CN': zhCN,
  'en-US': enUS,
};
