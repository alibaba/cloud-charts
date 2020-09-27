'use strict';

exports.__esModule = true;
exports.default = chartLog;
exports.getLog = getLog;
exports.themeLog = themeLog;
exports.track = track;

var _platform = require('./platform');

/**
 * 日志记录
 *
 * 包含 chartLog  getLog 方法
 * */
var logMap = {};

/**
 * chartLog 图表日志
 *
 * @param {string} name 图表名称
 * @param {string} logType 单次日志类型
 * */
function chartLog(name, logType) {
  if (!logMap[name]) {
    logMap[name] = {
      init: 0
    };
  }

  if (logType === 'init') {
    logMap[name][logType] += 1;
  }
}

function getLog() {
  return logMap;
}

var currentTheme = '';
function themeLog(name) {
  currentTheme = name;
}

var trackable = window.CloudChartsTrackEnable !== false;
/**
 * 打点控制函数
 *
 * @param {bool} enable 是否开启打点
 * */
function track(enable) {
  // 新版本中 G2 不再打点，所以关闭该指令
  // G2.track(enable);
  // F2.track(enable);
  trackable = enable;
}

// 打点逻辑，使用黄金令箭
var logUrl = '//gm.mmstat.com/cloud-chart.use.init';
setTimeout(function () {
  if (trackable && process.env.NODE_ENV === 'production') {
    var chartInit = Object.keys(logMap).map(function (name) {
      var chartLog = logMap[name];

      return name + ':' + chartLog.init;
    }).join(',');

    var image = new Image();
    // 统计 版本、主题、当前域名、图表初始化次数
    image.src = logUrl + '?version=' + "0.1.5" + '&theme=' + (currentTheme || "index") + '&t=' + Date.now() + '&host=' + (location && location.host) + '&chartinit=' + chartInit + '&uamobile=' + _platform.isMobile;
  }
}, 3000);