'use strict';

import { size } from '../theme/index';
import { noop } from './common';
import merge from './merge';

/*
* 常见直角坐标系的legend，仅包含name和align设置。
* */
export default function (chart, config, componentConfig, isOneDataGroup) {
  // 设置图例
  if (config.legend !== false) {
    const { align, nameFormatter, valueFormatter, showData, customConfig, allowAllCanceled = false, style = {} } = config.legend || {};

    const legendConfig = {
      useHtml: true,
      title: null,
      position: 'top',
      allowAllCanceled,
      // 这个属性文档里没有，设置为false可以让图例不居中，再手动设置定位样式
      autoPosition: false,
      onHover: noop,
      itemTpl: (value, color, checked, index) => {
        const item = getRawData(config, this.rawData, value, isOneDataGroup);

        const newName = nameFormatter ? nameFormatter(value, {
          ...item,
          color,
          checked
        }, index) : value;

        if (showData) {
          const dataValue = getDataValue(item.data);
          const newValue = valueFormatter ? valueFormatter(dataValue, {
            ...item,
            color,
            checked
          }, index) : dataValue;

          return `${'<li class="g2-legend-list-item item-{index} {checked}" data-color="{originColor}" data-value="{originValue}">' +
          '<i class="g2-legend-marker" style="background-color:{color};"></i>' +
          '<span class="g2-legend-text">'}${newName}</span><span class="g2-legend-value">${newValue}</span></li>`;
        }

        return `${'<li class="g2-legend-list-item item-{index} {checked}" data-color="{originColor}" data-value="{originValue}">' +
          '<i class="g2-legend-marker" style="background-color:{color};"></i>' +
          '<span class="g2-legend-text">'}${newName}</span></li>`;
      },
      'g2-legend': Object.assign({
        top: size.s3,
        ...style
      }, align === 'right' ? { right: 0 } : { left: 0 }),
    };

    if (componentConfig) {
      // 内部的componentConfig直接使用assign浅复制，方便覆盖。
      Object.assign(legendConfig, componentConfig);
    }

    if (customConfig) {
      merge(legendConfig, customConfig);
    }


    chart.legend(legendConfig);
  } else {
    chart.legend(false);
  }
}

function getRawData(config, rawData, name, isOneDataGroup) {
  if (!rawData) {
    return {};
  }

  if (isOneDataGroup) {
    const originData = rawData[0] || {};
    let result = {};

    originData.data.some((r) => {
      if ((Array.isArray(r) && r[0] === name) || (typeof r === 'object' && r.x === name)) {
        result = r;
        return true;
      }
      return false;
    });

    if (Array.isArray(result)) {
      result = {
        data: result
      };
    }

    return result;
  }

  let originData = {};
  if (config.dataType !== 'g2') {
    rawData.some((r) => {
      if (r.name === name) {
        originData = r;
        return true;
      }
      return false;
    });
  }

  return originData;
}

function getDataValue(data) {
  if (!Array.isArray(data)) {
    return '-';
  }

  for (let i = 0; i < data.length; i++) {
    // 单组数据时，如饼图/漏斗图，data[i] 不是数组/对象
    if (typeof data[i] !== 'object' && i === 1) {
      return data[i];
    }
    if (i === data.length - 1) {
      if (Array.isArray(data[i])) {
        return data[i][1];
      }
      if (typeof data[i] === 'object') {
        return data[i].y;
      }
    }
  }
}
