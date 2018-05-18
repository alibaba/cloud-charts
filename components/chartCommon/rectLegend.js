'use strict';
import { getRawData } from './common';
import { size } from "../theme/normal";

/*
* 常见直角坐标系的legend，仅包含name和align设置。
* */
export default function (chart, config, customConfig) {
  // 设置图例
  if (config.legend) {
    const legendConfig = {
      useHtml: true,
      title: null,
      position: 'top',
      // 这个属性文档里没有，设置为false可以让图例不居中，再手动设置定位样式
      autoPosition: false,
      itemTpl: (value, color, checked, index) => {
        const item = (this.rawData && this.rawData[index]) || {};
        const result = config.legend.nameFormatter ? config.legend.nameFormatter(value, {
          ...item,
          color,
          checked
        }, index) : value;
        return '<li class="g2-legend-list-item item-{index} {checked}" data-color="{originColor}" data-value="{originValue}">' +
          '<i class="g2-legend-marker" style="background-color:{color};"></i>' +
          '<span class="g2-legend-text">' + result + '</span></li>';
      },
      'g2-legend': Object.assign({
        top: size.s3,
      }, config.legend.align === 'right' ? { right: 0 } : { left: 0 }),
    };

    if (customConfig) {
      Object.assign(legendConfig, customConfig);
    }

    chart.legend(legendConfig);
  } else {
    chart.legend(false);
  }
}
