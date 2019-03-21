'use strict';

exports.__esModule = true;
exports.Wbox = exports.WmultiPie = exports.Wfunnel = exports.Wrectangle = exports.Wradar = exports.Wnightingale = exports.Wsankey = exports.Wcustom = exports.Wmap = exports.Wscatter = exports.Wpie = exports.Wlinebar = exports.Wbar = exports.Wminiline = exports.Wline = exports.PathUtil = exports.MatrixUtil = exports.DomUtil = exports.Util = exports.DataSet = exports.G2 = exports.WG2Box = exports.WG2MultiPie = exports.WG2Funnel = exports.WG2Rectangle = exports.WG2Radar = exports.WG2Nightingale = exports.WG2Sankey = exports.WG2Custom = exports.WG2Map = exports.WG2Scatter = exports.WG2Pie = exports.WG2LineBar = exports.WG2Bar = exports.WG2MiniLine = exports.WG2Line = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; // 引入依赖库

// import { autoSelect } from './common/platform';

// 引入组件


var _g = require('@antv/g2');

var _g2 = _interopRequireDefault(_g);

var _dataSet = require('@antv/data-set');

var DataSet = _interopRequireWildcard(_dataSet);

var _g2Connect = require('@alife/g2-connect');

var _g2Connect2 = _interopRequireDefault(_g2Connect);

var _common = require('./common/common');

var common = _interopRequireWildcard(_common);

var _g2Factory = require('./common/g2Factory');

var _g2Factory2 = _interopRequireDefault(_g2Factory);

var _G2Line = require('./wline/G2Line');

var _G2Line2 = _interopRequireDefault(_G2Line);

var _G2MiniLine = require('./wminiline/G2MiniLine');

var _G2MiniLine2 = _interopRequireDefault(_G2MiniLine);

var _G2Bar = require('./wbar/G2Bar');

var _G2Bar2 = _interopRequireDefault(_G2Bar);

var _G2LineBar = require('./wlinebar/G2LineBar');

var _G2LineBar2 = _interopRequireDefault(_G2LineBar);

var _G2Pie = require('./wpie/G2Pie');

var _G2Pie2 = _interopRequireDefault(_G2Pie);

var _G2Scatter = require('./wscatter/G2Scatter');

var _G2Scatter2 = _interopRequireDefault(_G2Scatter);

var _index = require('./wmap/index');

var _index2 = _interopRequireDefault(_index);

var _G2Custom = require('./wcustom/G2Custom');

var _G2Custom2 = _interopRequireDefault(_G2Custom);

var _G2Sankey = require('./wsankey/G2Sankey');

var _G2Sankey2 = _interopRequireDefault(_G2Sankey);

var _G2Base = require('./wnightingale/G2-base');

var _G2Base2 = _interopRequireDefault(_G2Base);

var _G2Radar = require('./wradar/G2Radar');

var _G2Radar2 = _interopRequireDefault(_G2Radar);

var _G2Rectangle = require('./wrectangle/G2Rectangle');

var _G2Rectangle2 = _interopRequireDefault(_G2Rectangle);

var _G2Funnel = require('./wfunnel/G2Funnel');

var _G2Funnel2 = _interopRequireDefault(_G2Funnel);

var _G2MultiPie = require('./wmultipie/G2MultiPie');

var _G2MultiPie2 = _interopRequireDefault(_G2MultiPie);

var _G2Box = require('./wbox/G2Box');

var _G2Box2 = _interopRequireDefault(_G2Box);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import F2Line from './wline/F2Line';
// import F2Pie from './wpie/F2Pie';
// import F2Bar from './wbar/F2Bar';
// import F2RangeLine from './wrangeline/F2RangeLine';
// 未实现，空白占位
// import G2RangeLine from './wrangeline/G2RangeLine';

// 暴露所有基础图表
var WG2Line = exports.WG2Line = (0, _g2Factory2.default)('G2Line', _G2Line2.default);
var WG2MiniLine = exports.WG2MiniLine = (0, _g2Factory2.default)('G2MiniLine', _G2MiniLine2.default);
var WG2Bar = exports.WG2Bar = (0, _g2Factory2.default)('G2Bar', _G2Bar2.default);
var WG2LineBar = exports.WG2LineBar = (0, _g2Factory2.default)('G2LineBar', _G2LineBar2.default, false);
var WG2Pie = exports.WG2Pie = (0, _g2Factory2.default)('G2Pie', _G2Pie2.default);
var WG2Scatter = exports.WG2Scatter = (0, _g2Factory2.default)('G2Scatter', _G2Scatter2.default);
var WG2Map = exports.WG2Map = _index2.default;
var WG2Custom = exports.WG2Custom = (0, _g2Factory2.default)('G2Custom', _G2Custom2.default);
var WG2Sankey = exports.WG2Sankey = (0, _g2Factory2.default)('G2Sankey', _G2Sankey2.default, false);
var WG2Nightingale = exports.WG2Nightingale = (0, _g2Factory2.default)('G2Nightingale', _G2Base2.default);
var WG2Radar = exports.WG2Radar = (0, _g2Factory2.default)('G2Radar', _G2Radar2.default);
var WG2Rectangle = exports.WG2Rectangle = (0, _g2Factory2.default)('G2Rectangle', _G2Rectangle2.default, false);
var WG2Funnel = exports.WG2Funnel = (0, _g2Factory2.default)('G2Funnel', _G2Funnel2.default);
var WG2MultiPie = exports.WG2MultiPie = (0, _g2Factory2.default)('G2MultiPie', _G2MultiPie2.default, false);
var WG2Box = exports.WG2Box = (0, _g2Factory2.default)('G2Box', _G2Box2.default);

// 暴露基础图表库
exports.G2 = _g2.default;
exports.DataSet = DataSet;

// 暴露工具类

var Util = exports.Util = _extends({}, _g2.default.Util, {
  Connect: _g2Connect2.default, // 图表联动组件
  propertyMap: common.propertyMap,
  propertyAssign: common.propertyAssign,
  getParentSize: common.getParentSize,
  getStatusColor: common.getStatusColor,
  isInvalidNumber: common.isInvalidNumber,
  numberDecimal: common.numberDecimal,
  beautifyNumber: common.beautifyNumber,
  getRawData: common.getRawData,
  filterKey: common.filterKey
});
var DomUtil = exports.DomUtil = _g2.default.DomUtil;
var MatrixUtil = exports.MatrixUtil = _g2.default.MatrixUtil;
var PathUtil = exports.PathUtil = _g2.default.PathUtil;

// 暴露图表组件
var Wline = exports.Wline = WG2Line;
var Wminiline = exports.Wminiline = WG2MiniLine;
var Wbar = exports.Wbar = WG2Bar;
var Wlinebar = exports.Wlinebar = WG2LineBar;
var Wpie = exports.Wpie = WG2Pie;
var Wscatter = exports.Wscatter = WG2Scatter;
var Wmap = exports.Wmap = WG2Map;
var Wcustom = exports.Wcustom = WG2Custom;
var Wsankey = exports.Wsankey = WG2Sankey;
var Wnightingale = exports.Wnightingale = WG2Nightingale;
var Wradar = exports.Wradar = WG2Radar;
var Wrectangle = exports.Wrectangle = WG2Rectangle;
var Wfunnel = exports.Wfunnel = WG2Funnel;
var WmultiPie = exports.WmultiPie = WG2MultiPie;
var Wbox = exports.Wbox = WG2Box;

// export const GFLine = autoSelect(Wline, F2Line);
// export const GFPie = autoSelect(Wpie, F2Pie);
// export const GFBar = autoSelect(Wbar, F2Bar);
// export const GFRangeLine = autoSelect(G2RangeLine, F2RangeLine);
// export const GFLine = F2Line;
// export const GFPie = F2Pie;
// export const GFBar = F2Bar;
// export const GFRangeLine = F2RangeLine;