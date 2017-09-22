import './index.scss';

export Wnumber from './wnumber/index';
export Wcontainer from './wcontainer/index';
export Wicon from './wicon/index';
export Wminiline from './wminiline/index';
export Wcircle from './wcircle/index';
export Wminicontainer from './wminicontainer/index';

import * as g2Map from './g2Map';
import * as highchartsMap from './highchartsMap';

//根据设置的library名字暴露默认的图表组件
const chartLibraryName = 'Highcharts';
const chartMap = {
  Highcharts: {
    line: highchartsMap.WHighLine,
    bar: highchartsMap.WHighBar,
    pie: highchartsMap.WHighPie,
    linebar: highchartsMap.WHighLineBar,
    map: g2Map.WG2Map,
    custom: g2Map.WG2Custom
  },
  G2: {
    line: g2Map.WG2Line,
    bar: g2Map.WG2Bar,
    pie: g2Map.WG2Pie,
    linebar: highchartsMap.WHighLineBar,
    map: g2Map.WG2Map,
    custom: g2Map.WG2Custom
  }
};
export const Wline = chartMap[chartLibraryName].line;
export const Wbar = chartMap[chartLibraryName].bar;
export const Wpie = chartMap[chartLibraryName].pie;
export const Wlinebar = chartMap[chartLibraryName].linebar;
export const Wmap = chartMap[chartLibraryName].map;
export const Wcustom = chartMap[chartLibraryName].custom;
