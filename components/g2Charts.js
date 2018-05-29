// 引入依赖库
import G2 from '@antv/g2';
import * as DataSet from '@antv/data-set';
import g2Connect from '@alife/g2-connect';
import * as common from './common/common';
import g2Factory from './common/g2Factory';

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

// 暴露基础图表库
export { G2, DataSet };

// 暴露工具类
export const Util = Object.assign({}, G2.Util, {
  Connect: g2Connect, // 图表联动组件
  propertyAssign: common.propertyAssign,
  getParentSize: common.getParentSize,
  getStatusColor: common.getStatusColor,
  isInvalidNumber: common.isInvalidNumber,
  numberDecimal: common.numberDecimal,
  beautifyNumber: common.beautifyNumber
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

// 打点控制函数
let trackable = true;
export function track(enable) {
  G2.track(enable);
  trackable = enable;
}

// 打点逻辑，使用黄金令箭
const logUrl = '//gm.mmstat.com/aisc-widgets.use.init';
setTimeout(() => {
  if (trackable && process.env.NODE_ENV === 'production') {
    const image = new Image();
    // 统计 版本、主题、当前域名
    image.src = `${logUrl}?version=${__VERSION__}&theme=${__THEME__}&t=${Date.now()}&host=${location && location.host}&url=${document.URL}`;
  }
}, 3000);
