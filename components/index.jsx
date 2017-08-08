import './index.scss';

export Wnumber from './wnumber/index';
export Wcontainer from './wcontainer/index';
export Wicon from './wicon/index';
export Wminiline from './wminiline/index';

//基础图表
import { WG2Line, WHighLine } from './wline/index';
import { WG2Bar, WHighBar } from './wbar/index';
import { WG2Pie, WHighPie } from './wpie/index';

export {
  WHighLine as Wline,
  WG2Line as WLineG2,
  WHighBar as Wbar,
  WG2Bar as WBarG2,
  WHighPie as Wpie,
  WG2Pie as WPieG2
};

// let chartLibrary = 'G2';
