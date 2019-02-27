// 引入依赖库
import G2 from '@antv/g2';
import * as DataSet from '@antv/data-set';
import g2Connect from '@alife/g2-connect';
import * as common from './common/common';
import g2Factory from './common/g2Factory';
// import { autoSelect } from './common/platform';

// 引入组件
import G2Line from './wline/G2Line';
import G2MiniLine from './wminiline/G2MiniLine';
import G2Bar from './wbar/G2Bar';
import G2LineBar from './wlinebar/G2LineBar';
import G2Pie from './wpie/G2Pie';
import G2Scatter from './wscatter/G2Scatter';
import G2Map from './wmap/index';
import G2Custom from './wcustom/G2Custom';
import G2Sankey from './wsankey/G2Sankey';
import G2Nightingale from './wnightingale/G2-base';
import G2Radar from './wradar/G2Radar';
import G2Rectangle from './wrectangle/G2Rectangle';
import G2Funnel from './wfunnel/G2Funnel';
import G2MultiPie from './wmultipie/G2MultiPie';

import F2Line from './wline/F2Line';
import F2Pie from './wpie/F2Pie';
import F2Bar from './wbar/F2Bar';
import F2RangeLine from './wrangeline/F2RangeLine';
// 未实现，空白占位
// import G2RangeLine from './wrangeline/G2RangeLine';

// 暴露所有基础图表
export const WG2Line = g2Factory('G2Line', G2Line);
export const WG2MiniLine = g2Factory('G2MiniLine', G2MiniLine);
export const WG2Bar = g2Factory('G2Bar', G2Bar);
export const WG2LineBar = g2Factory('G2LineBar', G2LineBar, false);
export const WG2Pie = g2Factory('G2Pie', G2Pie);
export const WG2Scatter = g2Factory('G2Scatter', G2Scatter);
export const WG2Map = G2Map;
export const WG2Custom = g2Factory('G2Custom', G2Custom);
export const WG2Sankey = g2Factory('G2Sankey', G2Sankey, false);
export const WG2Nightingale = g2Factory('G2Nightingale', G2Nightingale);
export const WG2Radar = g2Factory('G2Radar', G2Radar);
export const WG2Rectangle = g2Factory('G2Rectangle', G2Rectangle, false);
export const WG2Funnel = g2Factory('G2Funnel', G2Funnel);
export const WG2MultiPie = g2Factory('G2MultiPie', G2MultiPie, false);

// 暴露基础图表库
export { G2, DataSet };

// 暴露工具类
export const Util = Object.assign({}, G2.Util, {
  Connect: g2Connect, // 图表联动组件
  propertyMap: common.propertyMap,
  propertyAssign: common.propertyAssign,
  getParentSize: common.getParentSize,
  getStatusColor: common.getStatusColor,
  isInvalidNumber: common.isInvalidNumber,
  numberDecimal: common.numberDecimal,
  beautifyNumber: common.beautifyNumber,
  getRawData: common.getRawData,
  filterKey: common.filterKey,
});
export const DomUtil = G2.DomUtil;
export const MatrixUtil = G2.MatrixUtil;
export const PathUtil = G2.PathUtil;

// 暴露图表组件
export const Wline = WG2Line;
export const Wminiline = WG2MiniLine;
export const Wbar = WG2Bar;
export const Wlinebar = WG2LineBar;
export const Wpie = WG2Pie;
export const Wscatter = WG2Scatter;
export const Wmap = WG2Map;
export const Wcustom = WG2Custom;
export const Wsankey = WG2Sankey;
export const Wnightingale = WG2Nightingale;
export const Wradar = WG2Radar;
export const Wrectangle = WG2Rectangle;
export const Wfunnel = WG2Funnel;
export const WmultiPie = WG2MultiPie;

// export const GFLine = autoSelect(Wline, F2Line);
// export const GFPie = autoSelect(Wpie, F2Pie);
// export const GFBar = autoSelect(Wbar, F2Bar);
// export const GFRangeLine = autoSelect(G2RangeLine, F2RangeLine);
export const GFLine = F2Line;
export const GFPie = F2Pie;
export const GFBar = F2Bar;
export const GFRangeLine = F2RangeLine;
