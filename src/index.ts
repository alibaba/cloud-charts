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

export { default as Wline, Line as RawLine } from './Wline';
export { default as Wlinebar, Linebar as RawLinebar } from './Wlinebar';
export { default as Wpie, Pie as RawPie } from './Wpie';
export { default as Wradar, Radar as RawRadar } from './Wradar';
export { default as Wbar, Bar as RawBar } from './Wbar';
export { default as Wfunnel, Funnel as RawFunnel } from './Wfunnel';
export { default as Wnightingale, Nightingale as RawNightingale } from './Wnightingale';
export { default as Wheatmap, Heatmap as RawHeatmap } from './Wheatmap';
export { default as Wmap, Map as RawMap } from './Wmap'
export { default as Wrectangle, Rectangle as RawRectangle } from './Wrectangle';
export { default as Wminiline, Miniline as RawMiniline } from './Wminiline';
export { default as WmultiPie, MultiPie as RawMultiPie } from './Wmultipie';
export { default as Wbox, Box as RawBox } from './Wbox';
export { default as Wsankey, Sankey as RawSankey } from './Wsankey';
export { default as Wscatter, Scatter as RawScatter } from './Wscatter';
export { default as Whistogram, Histogram as RawHistogram } from './Whistogram';
export { default as Wtreemap, Treemap as RawTreemap } from './Wtreemap';
export { default as Wcandlestick, Candlestick as RawCandlestick } from './Wcandlestick';
export { default as Whierarchy, Hierarchy as RawHierarchy } from './Whierarchy';

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
