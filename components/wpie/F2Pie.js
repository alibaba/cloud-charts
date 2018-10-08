import f2Factory from '../common/f2Factory';
import { color } from '../theme/';
import { legendConfig } from '../common/f2Defaults';
import merge from '../common/merge';

const defaultLegendFormatter = (d, titleStyle) => `<span style="color: ${titleStyle.fill}; font-size: ${titleStyle.fontSize}px;">${d[0]} ${d[1] * 100}%</span>`;

const defaultConfig = {
  width: 130,
  padding: [10, 10, 10, 10],
  xAxis: {
    type: 'timeCat',
    mask: 'YYYY-MM-DD HH:mm:ss'
  },
  yAxis: {
    min: 0
  },
  tooltip: true,
  legend: {
    ...legendConfig,
    show: true,
    position: 'right',
    formatter: defaultLegendFormatter
  },
  colors: color.category_12,

  autoSort: false,
  cycle: false,
  innerRadius: 0.8, // 内环半径大小，仅cycle为true时可用
  outerRadius: 0.8, // 饼图半径大小，初始化时可用，暂不支持
};

const pie = {
  beforeInit(props) {
    const newProps = Object.assign({}, props);
    const newConfig = merge({}, defaultConfig, newProps.config);

    newProps.config = newConfig;
    return newProps;
  },
  init(chart, userConfig, data) {
    if (userConfig.autoSort) {
      data.sort((a, b) => b.y - a.y);
    }
    chart.source(data);
    chart.coord('polar', {
      transposed: true,
      innerRadius: userConfig.innerRadius
    });
    chart.axis(false);

    chart
      .interval()
      .position('type*y')
      .color('x')
      .adjust('stack');

    chart.render();
  },
};

export default f2Factory('f2Pie', pie);
