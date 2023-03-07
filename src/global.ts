import { Theme } from './themes/themeTools';

declare global {
  interface Window {
    /**
     * 通过全局变量控制是否开启用户跟踪系统
     * */
    AiscWidgetsTrackEnable?: boolean;
    /**
     * 通过全局变量设置默认主题
     * */
    AiscWidgetsDefaultTheme?: string | Theme;
  }
}
