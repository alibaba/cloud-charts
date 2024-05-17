import './global';
import { VERSION } from './constants';
import themes, { Themes } from './themes/index';
import './cdn.scss';

// 导出 G2 核心包
import * as G2Core from '@antv/g2/esm/core';
export { G2Core };

export const version = VERSION;
export { VERSION };

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

// 图表基类
export { default as Wbase } from './common/Base';

export { default as Wline, Line as RawLine, WlineConfig } from './Wline';
export { default as Wlinebar, Linebar as RawLinebar, WlinebarConfig } from './Wlinebar';
export { default as Wlinescatter, Linescatter as RawLinescatter, WlinescatterConfig } from './Wlinescatter';
export { default as Wlinebox, Linebox as RawLinebox, WlineboxConfig } from './Wlinebox';
export { default as Wpie, Pie as RawPie, WpieConfig } from './Wpie';
export { default as Wradar, Radar as RawRadar, WradarConfig } from './Wradar';
export { default as Wbar, Bar as RawBar, WbarConfig } from './Wbar';
export { default as Wfunnel, Funnel as RawFunnel, WfunnelConfig } from './Wfunnel';
export { default as Wnightingale, Nightingale as RawNightingale, WnightingaleConfig } from './Wnightingale';
export { default as Wheatmap, Heatmap as RawHeatmap, WheatmapConfig } from './Wheatmap';
export { default as Wmap, Map as RawMap, WmapConfig } from './Wmap';
export { default as Wrectangle, Rectangle as RawRectangle, WrectangleConfig } from './Wrectangle';
export { default as Wminiline, Miniline as RawMiniline, WminilineConfig } from './Wminiline';
export { default as WmultiPie, MultiPie as RawMultiPie, WmultipieConfig } from './Wmultipie';
export { default as Wmulticircle, MultiCircle as RawMultiCircle, WmulticircleConfig } from './Wmulticircle';
export { default as Wbox, Box as RawBox, WboxConfig } from './Wbox';
export { default as Wsankey, Sankey as RawSankey, WsankeyConfig } from './Wsankey';
export { default as Wscatter, Scatter as RawScatter, WscatterConfig } from './Wscatter';
export { default as Whistogram, Histogram as RawHistogram, WhistogramConfig } from './Whistogram';
export { default as Wtreemap, Treemap as RawTreemap, WtreemapConfig } from './Wtreemap';
export { default as Wcandlestick, Candlestick as RawCandlestick, WcandlestickConfig } from './Wcandlestick';
export { default as Whierarchy, Hierarchy as RawHierarchy, WhierarchyConfig } from './Whierarchy';
// 六边形热力图
export { default as Whexagonal, Hexagonal as RawHexagonal, WhexagonalConfig } from './Whexagonal';

// 业务组件，没有依赖其它图表库
export { default as Wnumber, WnumberProps } from './Wnumber/index';
export { default as Wcontainer, WcontainerProps } from './Wcontainer/index';
export { default as Wicon, WiconProps } from './Wicon/cdn'; // Icon 组件也改为 cdn 引入字体
export { default as Wcircle, WcircleProps } from './Wcircle/index';
export { default as Wminicontainer, WminicontainerProps } from './Wminicontainer/index';
export { default as Wshoot, ShootProps as WshootProps } from './Wshoot/index';
export { default as Wplaceholder, WplaceholderProps } from './Wplaceholder/index';
export { default as Wcount, WcountProps } from './Wcount/index';
// export { default as Wdashboard } from './Wdashboard/index';
export { Wnumbercard, Wnumberoverview, IDataItem as WnumbercardProps, IDataOverviewCard as WnumberoverviewProps } from './Wnumbercard/index';
export { default as Wcapacity, WcapacityProps } from './Wcapacity/index';

// 国际化
export { default as ChartProvider, setLanguage, getLanguage } from './ChartProvider/index';
