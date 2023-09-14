import zhCN from './zh-cn';
import enUS from './en-us';
import zhTW from './zh-tw';

export interface LocaleItem {
  loading: string;
  error: string;
  noData: string;
  empty: string;
  reset: string;
  [key: string]: string;
}

export default {
  'zh-cn': zhCN,
  'en-us': enUS,
  'zh-CN': zhCN,
  'en-US': enUS,
  'zh-tw': zhTW,
  'zh-TW': zhTW,
};
