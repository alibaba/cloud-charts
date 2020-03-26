import themes, { getTheme, setTheme } from './theme/index';
import './index.scss';

export var version = "2.6.3";
export var VERSION = "2.6.3";

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

// 暴露颜色值
export var COLORS = themes;
export var THEMES = themes;

export { getTheme, setTheme };

// 暴露所有图表组件、底层依赖的G2、工具类
export * from './g2Charts';

// 打点控制
export { default as track } from './track';

export { plugins, pluginManager } from './plugins';

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