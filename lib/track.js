'use strict';

exports.__esModule = true;
exports.default = track;

var _log = require('./common/log');

var _platform = require('./common/platform');

/**
 * 打点控制函数
 *
 * @param {bool} enable 是否开启打点
 * */
// import G2 from '@antv/g2';
// import F2 from '@antv/f2';
var trackable = true;
function track(enable) {
  // 新版本中 G2 不再打点，所以关闭该指令
  // G2.track(enable);
  // F2.track(enable);
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
    image.src = logUrl + '?version=' + __VERSION__ + '&theme=' + __THEME__ + '&t=' + Date.now() + '&host=' + (location && location.host) + '&fullurl=' + document.URL + '&chartinit=' + chartInit + '&uamobile=' + _platform.isMobile;
  }
}, 3000);
module.exports = exports['default'];