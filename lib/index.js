'use strict';

exports.__esModule = true;
exports.Whierarchy = exports.Wtreemap = exports.Wheatmap = exports.Wcandlestick = exports.Wbox = exports.WmultiPie = exports.Wfunnel = exports.Wrectangle = exports.Wradar = exports.Wnightingale = exports.Wsankey = exports.Wmap = exports.Wscatter = exports.Wpie = exports.Wlinebar = exports.Whistogram = exports.Wbar = exports.Wminiline = exports.Wline = exports.PathUtil = exports.MatrixUtil = exports.DomUtil = exports.DataSet = exports.G2 = exports.Wdashboard = exports.Wcount = exports.Wplaceholder = exports.Wshoot = exports.Wminicontainer = exports.Wcircle = exports.Wicon = exports.Wcontainer = exports.Wnumber = exports.Util = exports.pluginManager = exports.plugins = exports.track = exports.themes = exports.THEMES = exports.COLORS = exports.VERSION = exports.version = undefined;

var _track = require('./track');

Object.defineProperty(exports, 'track', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_track).default;
  }
});

var _plugins = require('./plugins');

Object.defineProperty(exports, 'plugins', {
  enumerable: true,
  get: function get() {
    return _plugins.plugins;
  }
});
Object.defineProperty(exports, 'pluginManager', {
  enumerable: true,
  get: function get() {
    return _plugins.pluginManager;
  }
});

var _Util = require('./Util');

Object.defineProperty(exports, 'Util', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_Util).default;
  }
});

var _index = require('./Wnumber/index');

Object.defineProperty(exports, 'Wnumber', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_index).default;
  }
});

var _index2 = require('./Wcontainer/index');

Object.defineProperty(exports, 'Wcontainer', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_index2).default;
  }
});

var _index3 = require('./Wicon/index');

Object.defineProperty(exports, 'Wicon', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_index3).default;
  }
});

var _index4 = require('./Wcircle/index');

Object.defineProperty(exports, 'Wcircle', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_index4).default;
  }
});

var _index5 = require('./Wminicontainer/index');

Object.defineProperty(exports, 'Wminicontainer', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_index5).default;
  }
});

var _index6 = require('./Wshoot/index');

Object.defineProperty(exports, 'Wshoot', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_index6).default;
  }
});

var _index7 = require('./Wplaceholder/index');

Object.defineProperty(exports, 'Wplaceholder', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_index7).default;
  }
});

var _index8 = require('./Wcount/index');

Object.defineProperty(exports, 'Wcount', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_index8).default;
  }
});

var _index9 = require('./Wdashboard/index');

Object.defineProperty(exports, 'Wdashboard', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_index9).default;
  }
});

var _G2Line = require('./Wline/G2Line');

Object.defineProperty(exports, 'Wline', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_G2Line).default;
  }
});

var _G2MiniLine = require('./Wminiline/G2MiniLine');

Object.defineProperty(exports, 'Wminiline', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_G2MiniLine).default;
  }
});

var _G2Bar = require('./Wbar/G2Bar');

Object.defineProperty(exports, 'Wbar', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_G2Bar).default;
  }
});

var _G2Histogram = require('./Whistogram/G2Histogram');

Object.defineProperty(exports, 'Whistogram', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_G2Histogram).default;
  }
});

var _G2LineBar = require('./Wlinebar/G2LineBar');

Object.defineProperty(exports, 'Wlinebar', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_G2LineBar).default;
  }
});

var _G2Pie = require('./Wpie/G2Pie');

Object.defineProperty(exports, 'Wpie', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_G2Pie).default;
  }
});

var _G2Scatter = require('./Wscatter/G2Scatter');

Object.defineProperty(exports, 'Wscatter', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_G2Scatter).default;
  }
});

var _index10 = require('./Wmap/index');

Object.defineProperty(exports, 'Wmap', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_index10).default;
  }
});

var _G2Sankey = require('./Wsankey/G2Sankey');

Object.defineProperty(exports, 'Wsankey', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_G2Sankey).default;
  }
});

var _G2Nightingale = require('./Wnightingale/G2Nightingale');

Object.defineProperty(exports, 'Wnightingale', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_G2Nightingale).default;
  }
});

var _G2Radar = require('./Wradar/G2Radar');

Object.defineProperty(exports, 'Wradar', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_G2Radar).default;
  }
});

var _G2Rectangle = require('./Wrectangle/G2Rectangle');

Object.defineProperty(exports, 'Wrectangle', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_G2Rectangle).default;
  }
});

var _G2Funnel = require('./Wfunnel/G2Funnel');

Object.defineProperty(exports, 'Wfunnel', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_G2Funnel).default;
  }
});

var _G2MultiPie = require('./Wmultipie/G2MultiPie');

Object.defineProperty(exports, 'WmultiPie', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_G2MultiPie).default;
  }
});

var _G2Box = require('./Wbox/G2Box');

Object.defineProperty(exports, 'Wbox', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_G2Box).default;
  }
});

var _G2Candlestick = require('./Wcandlestick/G2Candlestick');

Object.defineProperty(exports, 'Wcandlestick', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_G2Candlestick).default;
  }
});

var _G2Heatmap = require('./Wheatmap/G2Heatmap');

Object.defineProperty(exports, 'Wheatmap', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_G2Heatmap).default;
  }
});

var _G2Treemap = require('./Wtreemap/G2Treemap');

Object.defineProperty(exports, 'Wtreemap', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_G2Treemap).default;
  }
});

var _G2Hierarchy = require('./Whierarchy/G2Hierarchy');

Object.defineProperty(exports, 'Whierarchy', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_G2Hierarchy).default;
  }
});

var _g = require('@antv/g2');

var _g2 = _interopRequireDefault(_g);

var _dataSet = require('@antv/data-set');

var DataSet = _interopRequireWildcard(_dataSet);

var _index11 = require('./themes/index');

var _index12 = _interopRequireDefault(_index11);

require('./index.css');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// 引入依赖库
var version = exports.version = "0.1.9";
var VERSION = exports.VERSION = "0.1.9";

// 主题包和颜色值
var COLORS = exports.COLORS = _index12.default;
var THEMES = exports.THEMES = _index12.default;
exports.themes = _index12.default;

// 打点控制

// 基础图表库依赖
exports.G2 = _g2.default;
exports.DataSet = DataSet;
var DomUtil = _g2.default.DomUtil;
exports.DomUtil = DomUtil;
var MatrixUtil = _g2.default.MatrixUtil;
exports.MatrixUtil = MatrixUtil;
var PathUtil = _g2.default.PathUtil;

// 基础图表组件

exports.PathUtil = PathUtil;