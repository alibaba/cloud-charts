'use strict';

import COLORS from '../chartCommon/colors';
import merge from '../utils/merge';
import G2 from 'g2';
import './index.scss';

let defaultConfig = {
  legend: {
    position: 'bottom',
    labelFormatter: null, //可以强制覆盖，手动设置label
  },
  tooltip: {
    titleFormatter: null,//function参数value
    nameFormatter: null,
    valueFormatter: null,
  },
  cycle: false,
  labelFormatter: null//函数参数 name, percent
};

export default {
  init(chart, userConfig, data) {
    const config = merge({}, defaultConfig, userConfig);

    let defs = {
      type: {
        type: 'cat'
      },
    };

    chart.source(data, defs);
    // 重要：绘制饼图时，必须声明 theta 坐标系
    let thetaConfig = {
      radius: 0.8 // 设置饼图的大小
    }
    if (config.cycle) {
      thetaConfig = merge({}, thetaConfig, {
        inner: 0.7
      });
    }
    chart.coord('theta', thetaConfig);



    // position若直接使用value导致图例点击某项隐藏，余下展示不为值和不为1
    var Stat = G2.Stat;

    //labelFormatter
    if (config.labelFormatter) {
      chart.intervalStack().position(Stat.summary.percent('value')).color('name').label('name*..percent', config.labelFormatter);
    } else {
      chart.intervalStack().position(Stat.summary.percent('value')).color('name');
    }

    // 设置图例
    if (config.legend) {
      chart.legend({
        position: config.legend.position,
        title: null,
        spacingX: 8
      });
    } else {
      chart.legend(false);
    }
    // 设置提示

    if(config.tooltip.titleFormatter){
      chart.tooltip({
        title: config.tooltip.titleFormatter
      });
    }else{
      chart.tooltip({
        title: null
      });
    }
    chart.render();
  }
};
