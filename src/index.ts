import { VERSION } from './constants';
import themes, { Themes } from './themes/index';
import './index.scss';

export const version = VERSION;
export { VERSION } ;

// 主题包和颜色值
export const COLORS: Themes = themes;
export const THEMES: Themes = themes;
export { themes };

// 打点控制
export { default as track } from './track';

// 插件系统
export { plugins, pluginManager } from './plugins';

// 暴露工具类
export { default as Util } from './Util';

export { default as Wline } from './Wline';
export { default as Wlinebar } from './Wlinebar';
export { default as Wpie } from './Wpie';
export { default as Wradar } from './Wradar';
export { default as Wbar } from './Wbar';
export { default as Wfunnel } from './Wfunnel';
export { default as Wnightingale } from './Wnightingale';
export { default as Wheatmap } from './Wheatmap';
export { default as Wmap } from './Wmap'
export { default as Wrectangle } from './Wrectangle';
export { default as Wminiline } from './Wminiline';
export { default as WmultiPie } from './Wmultipie';
export { default as Wbox } from './Wbox';
export { default as Wsankey } from './Wsankey';
export { default as Wscatter } from './Wscatter';
export { default as Whistogram } from './Whistogram';
export { default as Wtreemap } from './Wtreemap';
export { default as Wcandlestick } from './Wcandlestick';

// 业务组件，没有依赖其它图表库
export { default as Wnumber } from './Wnumber/index';
export { default as Wcontainer } from './Wcontainer/index';
export { default as Wicon } from './Wicon/index';
export { default as Wcircle } from './Wcircle/index';
export { default as Wminicontainer } from './Wminicontainer/index';
export { default as Wshoot } from './Wshoot/index';
export { default as Wplaceholder } from './Wplaceholder/index';
export { default as Wcount } from './Wcount/index';
// export { default as Wdashboard } from './Wdashboard/index';
