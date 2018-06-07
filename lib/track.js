'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = track;

var _g = require('@antv/g2');

var _g2 = _interopRequireDefault(_g);

var _log = require('./common/log');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * 打点控制函数
 *
 * @param {bool} enable 是否开启打点
 * */
var trackable = true;
function track(enable) {
  _g2.default.track(enable);
  trackable = enable;
}

// 打点逻辑，使用黄金令箭
var logUrl = '//gm.mmstat.com/aisc-widgets.use.init';
setTimeout(function () {
  if (trackable && process.env.NODE_ENV === 'production') {
    var logMap = (0, _log.getLog)();

    var chartInit = Object.keys(logMap).map(function (name) {
      var chartLog = logMap[name];

      return name + ':' + chartLog.init;
    }).join(',');

    var image = new Image();
    // 统计 版本、主题、当前域名、图表初始化次数
    image.src = logUrl + '?version=' + __VERSION__ + '&theme=' + __THEME__ + '&t=' + Date.now() + '&host=' + (location && location.host) + '&fullurl=' + document.URL + '&chartinit=' + chartInit;
  }
}, 3000);
module.exports = exports['default'];