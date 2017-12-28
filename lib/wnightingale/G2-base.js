'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _merge = require('../utils/merge');

var _merge2 = _interopRequireDefault(_merge);

var _g = require('@antv/g2');

var _g2 = _interopRequireDefault(_g);

require('./G2-base.scss');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// 建议将默认配置放在外层，方便后续维护
var defaultConfig = {
  padding: [32, 5, 32, 45],
  colors: []
};

// 对外暴露一个对象，除了init方法必选外，其余均为可选项，按组件需要选择性使用。
// 方法运行时的this指向图表实例，所以可以在this上挂载需要保留的数据。
// 引入所需要的库和样式
exports.default = {
  // 初始化前对props的预处理函数
  beforeInit: function beforeInit(props) {
    return props;
  },

  // 图表绘制主函数，必选
  init: function init(chart, userConfig, data) {
    var config = (0, _merge2.default)({}, defaultConfig, userConfig);
    chart.source(data);
    chart.coord('polar');
    chart.axis(false);
    chart.interval().position(config.position).label(config.label, {
      offset: -15
    }).style({
      lineWidth: 1,
      stroke: '#fff'
    });
    chart.render();
    // ...绘制流程
  }
};
module.exports = exports['default'];