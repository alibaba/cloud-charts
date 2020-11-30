// 定义全局变量
declare const __VERSION__: string;
declare const __THEME__: string;

const VERSION = __VERSION__;
const THEME = __THEME__;

export { VERSION };
export { THEME };

export const FullPackageName = '@alife/aisc-widgets';
export const FullCamelName = 'AiscWidgets';
export const FullCrossName = 'aisc-widgets';
export const FullTrackName = 'AiscWidgetsTrackEnable';
export const TrackName = 'aisc-widgets';
export const PrefixName = 'aisc';

declare global {
  interface Window {
    /**
     * 通过全局变量控制是否开启用户跟踪系统
     * */
    AiscWidgetsTrackEnable?: boolean;
  }
}
