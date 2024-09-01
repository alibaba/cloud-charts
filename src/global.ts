import { Theme } from './themes/themeTools';

declare global {
  interface Window {
    /**
     * 通过全局变量控制是否开启用户跟踪系统
     * */
    CloudChartsTrackEnable?: boolean;
    /**
     * 通过全局变量设置默认主题
     * */
    CloudChartsDefaultTheme?: string | Theme;

    /**
     * 通过全局变量控制是否开启图表质量统计
     * */
    CloudChartsTestEnable?: boolean;

    /**
     * 通过全局变量获取图表质量
     * */
    CloudChartsQualityInfo?: any;
    /**
     * 通过全局变量关闭consolelog
     * */
    CloudChartsConsoleDisable?: boolean;
  }
}
