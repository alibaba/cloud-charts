'use strict';

import { Line, WlineConfig } from '../Wline';
import errorWrap from '../common/errorWrap';
import themes from '../themes';

export class Miniline extends Line {
  chartName = 'G2MiniLine';

  getDefaultConfig(): WlineConfig {
    const lineWidth = themes['widgets-line-width'];
    return {
      padding: [lineWidth, lineWidth, lineWidth, lineWidth],
      xAxis: {
        visible: false,
        type: 'time', // 默认为线性
        mask: 'auto', // 上述type为time时，此字段生效
      },
      yAxis: {
        visible: false,
        max: null,
        min: null,
      },
      legend: false,
      tooltip: false,
      area: false,
      spline: false,
      symbol: false,
      label: false,
    };
  }
}

const Wminiline: typeof Miniline = errorWrap(Miniline)

export default Wminiline;
