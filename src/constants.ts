// 定义全局变量
declare const __VERSION__: string;
declare const __THEME__: string;

const VERSION = __VERSION__;
const THEME = __THEME__;

export { VERSION as __VERSION__ };
export { THEME as __THEME__ };

declare global {
  interface Window {
    /**
     * 通过全局变量控制是否开启用户跟踪系统
     * */
    CloudChartsTrackEnable?: boolean;
  }
}
