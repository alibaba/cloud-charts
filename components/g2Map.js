import './index.scss';
import G2 from 'g2';

//基础图表
import { WG2Line } from './wline/index';
import { WG2Bar } from './wbar/index';
import { WG2Pie } from './wpie/index';
import { WG2Map } from './wmap/index';
import { WG2Custom } from './wcustom/index';

//暴露基础图表库
export { G2 }

//暴露所有包含的基础图表
export {
  WG2Line,
  WG2Bar,
  WG2Pie,
  WG2Map,
  WG2Custom
};

export const Wline = WG2Line;
export const Wbar = WG2Bar;
export const Wpie = WG2Pie;
export const Wmap = WG2Map;
export const Wcustom = WG2Custom;
