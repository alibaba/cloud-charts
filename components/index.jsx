import './index.scss';

export Wnumber from './wnumber/index';
export Wcontainer from './wcontainer/index';
export Wicon from './wicon/index';
export Wminiline from './wminiline/index';
export Wcircle from './wcircle/index';
export Wminicontainer from './wminicontainer/index';

//基础图表
import { WHighLine, WG2Line } from './wline/index';
import { WHighBar, WG2Bar } from './wbar/index';
import { WHighPie, WG2Pie } from './wpie/index';
import { WHighLineBar } from './wlinebar/index';
import { WG2Map } from './wmap/index';
import { WG2Custom } from './wcustom/index';

//暴露所有包含的基础图表
export {
  WHighLine,
  WHighBar,
  WHighPie,
  WHighLineBar,
  WG2Line,
  WG2Bar,
  WG2Pie,
  WG2Map,
  WG2Custom
};

//根据设置的library名字暴露默认的图表组件
const chartLibraryName = 'Highcharts';
const chartMap = {
  Highcharts: {
    line: WHighLine,
    bar: WHighBar,
    pie: WHighPie,
    linebar: WHighLineBar,
    map: WG2Map,
    custom: WG2Custom
  },
  G2: {
    line: WG2Line,
    bar: WG2Bar,
    pie: WG2Pie,
    linebar: WHighLineBar,
    map: WG2Map,
    custom: WG2Custom
  }
};
export const Wline = chartMap[chartLibraryName].line;
export const Wbar = chartMap[chartLibraryName].bar;
export const Wpie = chartMap[chartLibraryName].pie;
export const Wlinebar = chartMap[chartLibraryName].linebar;
export const Wmap = chartMap[chartLibraryName].map;
export const Wcustom = chartMap[chartLibraryName].custom;
