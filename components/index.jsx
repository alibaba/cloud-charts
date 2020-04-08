// 引入依赖库
import G2 from '@antv/g2';
import * as DataSet from '@antv/data-set';
import themes from './themes/index';
import './index.scss';

export const version = __VERSION__;
export const VERSION = __VERSION__;

// 主题包和颜色值
export const COLORS = themes;
export const THEMES = themes;
export { themes };

// 打点控制
export { default as track } from './track';

// 插件系统
export { plugins, pluginManager } from './plugins';

// 暴露工具类
export { default as Util } from './Util';

// 业务组件，没有依赖其它图表库
export { default as Wnumber } from './Wnumber/index';
export { default as Wcontainer } from './Wcontainer/index';
export { default as Wicon } from './Wicon/index';
export { default as Wcircle } from './Wcircle/index';
export { default as Wminicontainer } from './Wminicontainer/index';
export { default as Wshoot } from './Wshoot/index';
export { default as Wplaceholder } from './Wplaceholder/index';
export { default as Wperline } from './Wperline/index';
export { default as Wcount } from './Wcount/index';
export { default as Wdashboard } from './Wdashboard/index';

// 基础图表库依赖
export { G2, DataSet };

export const { DomUtil } = G2;
export const { MatrixUtil } = G2;
export const { PathUtil } = G2;

// 基础图表组件
export { default as Wline } from './Wline/G2Line';
export { default as Wminiline } from './Wminiline/G2MiniLine';
export { default as Wbar } from './Wbar/G2Bar';
export { default as Whistogram } from './Whistogram/G2Histogram';
export { default as Wlinebar } from './Wlinebar/G2LineBar';
export { default as Wpie } from './Wpie/G2Pie';
export { default as Wscatter } from './Wscatter/G2Scatter';
export { default as Wmap } from './Wmap/index';
export { default as Wcustom } from './Wcustom/G2Custom';
export { default as Wsankey } from './Wsankey/G2Sankey';
export { default as Wnightingale } from './Wnightingale/G2Nightingale';
export { default as Wradar } from './Wradar/G2Radar';
export { default as Wrectangle } from './Wrectangle/G2Rectangle';
export { default as Wfunnel } from './Wfunnel/G2Funnel';
export { default as WmultiPie } from './Wmultipie/G2MultiPie';
export { default as Wbox } from './Wbox/G2Box';
export { default as Wcandlestick } from './Wcandlestick/G2Candlestick';
export { default as Wheatmap } from './Wheatmap/G2Heatmap';
export { default as Wtreemap } from './Wtreemap/G2Treemap';

// import * as highchartsMap from './highchartsMap';
//
// export const WG2Line = g2Map.WG2Line;
// export const WG2Bar = g2Map.WG2Bar;
// export const WG2Pie = g2Map.WG2Pie;
// export const WG2Map = g2Map.WG2Map;
// export const WG2Custom = g2Map.WG2Custom;
//
// export const WHighLine = highchartsMap.WHighLine;
// export const WHighBar = highchartsMap.WHighBar;
// export const WHighPie = highchartsMap.WHighPie;
// export const WHighLineBar = highchartsMap.WHighLineBar;
//
// //根据设置的library名字暴露默认的图表组件
// const chartLibraryName = 'G2';
// const chartMap = {
//   // Highcharts: {
//   //   line: highchartsMap.WHighLine,
//   //   bar: highchartsMap.WHighBar,
//   //   pie: highchartsMap.WHighPie,
//   //   linebar: highchartsMap.WHighLineBar,
//   //   map: g2Map.WG2Map,
//   //   custom: g2Map.WG2Custom
//   // },
//   G2: {
//     line: g2Map.WG2Line,
//     bar: g2Map.WG2Bar,
//     pie: g2Map.WG2Pie,
//     linebar: highchartsMap.WHighLineBar,
//     map: g2Map.WG2Map,
//     custom: g2Map.WG2Custom
//   }
// };
// export const Wline = chartMap[chartLibraryName].line;
// export const Wbar = chartMap[chartLibraryName].bar;
// export const Wpie = chartMap[chartLibraryName].pie;
// export const Wlinebar = chartMap[chartLibraryName].linebar;
// export const Wmap = chartMap[chartLibraryName].map;
// export const Wcustom = chartMap[chartLibraryName].custom;
