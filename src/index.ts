import './global';
import { VERSION } from './constants';
import themes, { Themes } from './themes/index';
import './index.scss';

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

export { default as Wline, Line as RawLine } from './Wline';
export { default as Wlinebar, Linebar as RawLinebar } from './Wlinebar';
export { default as Wlinescatter, Linescatter as RawLinescatter } from './Wlinescatter';
export { default as Wlinebox, Linebox as RawLinebox } from './Wlinebox';
export { default as Wpie, Pie as RawPie } from './Wpie';
export { default as Wradar, Radar as RawRadar } from './Wradar';
export { default as Wbar, Bar as RawBar } from './Wbar';
export { default as Wfunnel, Funnel as RawFunnel } from './Wfunnel';
export { default as Wnightingale, Nightingale as RawNightingale } from './Wnightingale';
export { default as Wheatmap, Heatmap as RawHeatmap } from './Wheatmap';
export { default as Wmap, Map as RawMap } from './Wmap';
export { default as Wrectangle, Rectangle as RawRectangle } from './Wrectangle';
export { default as Wminiline, Miniline as RawMiniline } from './Wminiline';
export { default as WmultiPie, MultiPie as RawMultiPie } from './Wmultipie';
export { default as Wmulticircle, MultiCircle as RawMultiCircle } from './Wmulticircle';
export { default as Wbox, Box as RawBox } from './Wbox';
export { default as Wsankey, Sankey as RawSankey } from './Wsankey';
export { default as Wscatter, Scatter as RawScatter } from './Wscatter';
export { default as Whistogram, Histogram as RawHistogram } from './Whistogram';
export { default as Wtreemap, Treemap as RawTreemap } from './Wtreemap';
export { default as Wcandlestick, Candlestick as RawCandlestick } from './Wcandlestick';
export { default as Whierarchy, Hierarchy as RawHierarchy } from './Whierarchy';
// 六边形热力图
export { default as Whexagonal, Hexagonal as RawHexagonal } from './Whexagonal';

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
export { Wnumbercard, Wnumberoverview } from './Wnumbercard/index';
export { default as Wcapacity } from './Wcapacity/index';

// export type
export type { WlineConfig } from './Wline';
export type { WlinebarConfig } from './Wlinebar';
export type { WlinescatterConfig } from './Wlinescatter';
export type { WlineboxConfig } from './Wlinebox';
export type { WpieConfig } from './Wpie';
export type { WradarConfig } from './Wradar';
export type { WbarConfig } from './Wbar';
export type { WfunnelConfig } from './Wfunnel';
export type { WnightingaleConfig } from './Wnightingale';
export type { WheatmapConfig } from './Wheatmap';
export type { WmapConfig } from './Wmap';
export type { WrectangleConfig } from './Wrectangle';
export type { WminilineConfig } from './Wminiline';
export type { WmultipieConfig } from './Wmultipie';
export type { WmulticircleConfig } from './Wmulticircle';
export type { WboxConfig } from './Wbox';
export type { WsankeyConfig } from './Wsankey';
export type { WscatterConfig } from './Wscatter';
export type { WhistogramConfig } from './Whistogram';
export type { WtreemapConfig } from './Wtreemap';
export type { WcandlestickConfig } from './Wcandlestick';
export type { WhierarchyConfig } from './Whierarchy';
export type { WhexagonalConfig } from './Whexagonal';

export type { IDataItem as WnumbercardProps, IDataOverviewCard as WnumberoverviewProps } from './Wnumbercard/index';
export type { WnumberProps } from './Wnumber/index';
export type { WcontainerProps } from './Wcontainer/index';
export type { WiconProps } from './Wicon/index';
export type { WcircleProps } from './Wcircle/index';
export type { WminicontainerProps } from './Wminicontainer/index';
export type { ShootProps as WshootProps } from './Wshoot/index';
export type { WplaceholderProps } from './Wplaceholder/index';
export type { WcountProps } from './Wcount/index';
export type { WcapacityProps } from './Wcapacity/index';

// 国际化
export { default as ChartProvider, setLanguage, getLanguage } from './ChartProvider/index';
