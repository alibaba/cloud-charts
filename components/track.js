import G2 from '@antv/g2';
// import F2 from '@antv/f2';
import { getLog } from './common/log';
import { isMobile } from './common/platform';

/**
 * 打点控制函数
 *
 * @param {bool} enable 是否开启打点
 * */
let trackable = true;
export default function track(enable) {
  G2.track(enable);
  // F2.track(enable);
  trackable = enable;
}

// 打点逻辑，使用黄金令箭
const logUrl = '//gm.mmstat.com/aisc-widgets.use.init';
setTimeout(() => {
  if (trackable && process.env.NODE_ENV === 'production') {
    const logMap = getLog();

    const chartInit = Object.keys(logMap).map((name) => {
      const chartLog = logMap[name];

      return `${name}:${chartLog.init}`;
    }).join(',');

    const image = new Image();
    // 统计 版本、主题、当前域名、图表初始化次数
    image.src = `${logUrl}?version=${__VERSION__}&theme=${__THEME__}&t=${Date.now()}&host=${location && location.host}&fullurl=${document.URL}&chartinit=${chartInit}&uamobile=${isMobile}`;
  }
}, 3000);
