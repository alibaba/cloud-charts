'use strict';

// 引入所需要的库和样式
import merge from '../utils/merge';
import {color, fonts, size} from "../theme/normal";
import './G2-base.scss';

// 建议将默认配置放在外层，方便后续维护
let defaultConfig = {
  padding: [20, 20, 20, 20],
  colors: color.category_12,
};

// 对外暴露一个对象，除了init方法必选外，其余均为可选项，按组件需要选择性使用。
// 方法运行时的this指向图表实例，所以可以在this上挂载需要保留的数据。
export default {
  // 初始化前对props的预处理函数
  beforeInit(props) {
    const {config} = props;
    // TODO 处理padding
    return Object.assign({}, props, {
      padding: props.padding || config.padding || defaultConfig.padding
    });
  },
  // 图表绘制主函数，必选
  init(chart, userConfig, data) {
    const config = merge({}, defaultConfig, userConfig);
    chart.source(data);
    chart.coord('polar');
    chart.axis(false);

    chart.interval()
      .position('x*y')
      .color('x', config.colors)
      .label('x', {
        offset: -15
      })
      .style({
        lineWidth: 1,
        stroke: color.widgetsColorWhite
      });

    chart.render();
  }
};
