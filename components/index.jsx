import './index.scss';

export Wnumber from './wnumber/index';
export Wcontainer from './wcontainer/index';
export Wicon from './wicon/index';
export Wminiline from './wminiline/index';
export Wcircle from './wcircle/index';
export Wminicontainer from './Wminicontainer/index';

//基础图表
import { WHighLine } from './wline/index';
import { WHighBar } from './wbar/index';
import { WHighPie } from './wpie/index';

//暴露所有包含的基础图表
export {
  WHighLine,
  WHighBar,
  WHighPie,
  // WG2Line,
  // WG2Bar,
  // WG2Pie
};

//根据设置的library名字暴露默认的图表组件
const chartLibraryName = 'Highcharts';
const chartMap = {
  Highcharts: {
    line: WHighLine,
    bar: WHighBar,
    pie: WHighPie,
  },
  // G2: {
  //   line: WG2Line,
  //   bar: WG2Bar,
  //   pie: WG2Pie
  // }
};
export const Wline = chartMap[chartLibraryName].line;
export const Wbar = chartMap[chartLibraryName].bar;
export const Wpie = chartMap[chartLibraryName].pie;
