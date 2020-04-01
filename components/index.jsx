// 引入依赖库
import G2 from '@antv/g2';
import * as DataSet from '@antv/data-set';
import themes, { getTheme, setTheme } from './theme/index';
import './index.scss';

export const version = __VERSION__;
export const VERSION = __VERSION__;

// 主题包和颜色值
export const COLORS = themes;
export const THEMES = themes;

export { getTheme, setTheme };

// 打点控制
export { default as track } from './track';

// 插件系统
export { plugins, pluginManager } from './plugins';

// 暴露工具类
export { default as Util } from './Util';

// 业务组件，没有依赖其它图表库
export { default as Wnumber } from './wnumber/index';
export { default as Wcontainer } from './wcontainer/index';
export { default as Wicon } from './wicon/index';
export { default as Wcircle } from './wcircle/index';
export { default as Wminicontainer } from './wminicontainer/index';
export { default as Wshoot } from './wshoot/index';
export { default as Wplaceholder } from './wplaceholder/index';
export { default as Wperline } from './wperline/index';
export { default as Wcount } from './wcount/index';
export { default as Wdashboard } from './wdashboard/index';

// 基础图表库依赖
export { G2, DataSet };

export const { DomUtil } = G2;
export const { MatrixUtil } = G2;
export const { PathUtil } = G2;

// 基础图表组件
export { default as Wline} from './wline/G2Line';
export { default as Wminiline} from './wminiline/G2MiniLine';
export { default as Wbar} from './wbar/G2Bar';
export { default as Whistogram} from './whistogram/G2Histogram';
export { default as Wlinebar} from './wlinebar/G2LineBar';
export { default as Wpie} from './wpie/G2Pie';
export { default as Wscatter} from './wscatter/G2Scatter';
export { default as Wmap} from './wmap/index';
export { default as Wcustom} from './wcustom/G2Custom';
export { default as Wsankey} from './wsankey/G2Sankey';
export { default as Wnightingale} from './wnightingale/G2Nightingale';
export { default as Wradar} from './wradar/G2Radar';
export { default as Wrectangle} from './wrectangle/G2Rectangle';
export { default as Wfunnel} from './wfunnel/G2Funnel';
export { default as WmultiPie} from './wmultipie/G2MultiPie';
export { default as Wbox} from './wbox/G2Box';
export { default as Wcandlestick} from './wcandlestick/G2Candlestick';
export { default as Wheatmap} from './wheatmap/G2Heatmap';


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
