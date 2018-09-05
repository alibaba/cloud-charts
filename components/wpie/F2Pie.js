import f2Factory from '../common/f2Factory';
import { color } from '../theme/';

const defaultLegendFormatter = d => `<span style="color: ${color.widgetsColorText1}">${d[0]} ${d[1] * 100}%</span>`;

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
  legend: { show: true, dir: 'right' },
  colors: color.category_12,

  autoSort: true,
  cycle: false,
  innerRadius: 0.8, // 内环半径大小，仅cycle为true时可用
  outerRadius: 0.8, // 饼图半径大小，初始化时可用，暂不支持
};

const pie = {
  beforeInit(props) {
    const newProps = Object.assign({}, props);
    const newConfig = Object.assign({}, defaultConfig, newProps.config);

    if (newConfig.legend) {
      if (typeof newConfig.legend === 'boolean') newConfig.legend = {};
      const { dir = 'right', show = true, formatter = defaultLegendFormatter } = newConfig.legend;
      newConfig.legend.dir = dir;
      newConfig.legend.show = show;
      newConfig.legend.formatter = formatter;
    }

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
