import G2 from '@antv/g2';
import g2Factory from './chartCommon/g2Factory';

import G2Line from './wline/G2Line';
import G2Bar from './wbar/G2Bar';
import G2Pie from './wpie/G2Pie';
import G2Map from './wmap/G2Map';
import G2Custom from './wcustom/G2Custom';
import G2Sankey from './wsankey/G2Sankey';

//暴露所有基础图表
export const WG2Line = g2Factory('G2Line', G2Line);
export const WG2Bar = g2Factory('G2Bar', G2Bar);
export const WG2Pie = g2Factory('G2Pie', G2Pie);
export const WG2Map = g2Factory('G2Map', G2Map, false);
export const WG2Custom = g2Factory('G2Custom', G2Custom);
export const WG2Sankey = g2Factory('G2Sankey', G2Sankey,false);

//暴露基础图表库
export { G2 }

export const Wline = WG2Line;
export const Wbar = WG2Bar;
export const Wpie = WG2Pie;
export const Wmap = WG2Map;
export const Wcustom = WG2Custom;
export const WSankey = WG2Sankey;
