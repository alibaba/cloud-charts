// 定义全局变量
declare const __VERSION__: string;
declare const __THEME__: string;

const VERSION = __VERSION__;
const THEME = __THEME__;

export { VERSION };
export { THEME };

export const FullCamelName = 'CloudCharts';
export const FullCrossName = 'cloud-charts';
export const FullTrackName = 'CloudChartsTrackEnable';
export const FullTestName = 'CloudChartsTestEnable';
export const FullConsoleName = 'CloudChartsConsoleDisable';
export const FullQualityName = 'CloudChartsQualityInfo';
export const FullThemeName = 'CloudChartsDefaultTheme';
export const FullThemeEventName = 'setCloudChartsTheme';
export const TrackName = 'cloud-chart.use.init';
export const PrefixName = 'cloud';
export const FullLanguageName = 'CloudChartsDefaultLanguage';
export const FullLanguageEventName = 'setCloudChartsLanguage';
export const HideTooltipEventName = 'hideCloudChartsTooltip';

declare global {
  interface Window {
    /**
     * 通过全局变量控制是否开启用户跟踪系统
     * */
    CloudChartsTrackEnable?: boolean;
  }
}
