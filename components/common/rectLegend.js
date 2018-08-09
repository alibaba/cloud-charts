'use strict';

import { size } from '../theme/index';
import { noop, pxToNumber } from './common';
import merge from './merge';

/*
* 常见直角坐标系的legend，仅包含name和align设置。
* */
export default function (chart, config, componentConfig, isOneDataGroup) {
  // 设置图例
  if (config.legend !== false) {
    const { align, nameFormatter, valueFormatter, showData, customConfig, allowAllCanceled = false, style = {} } = config.legend || {};

    const legendConfig = {
      //这些是widgets特有的属性
      autoCollapse: true,
      // 以下为g2的属性
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
      }, align === 'right' ? { right: 0 } : { left: 0 }),
    };

    if (componentConfig) {
      // 内部的componentConfig直接使用assign浅复制，方便覆盖。
      Object.assign(legendConfig, componentConfig);
    }

    if (customConfig) {
      merge(legendConfig, customConfig);
    }

    if (legendConfig['g2-legend'] && typeof legendConfig['g2-legend'] === 'object') {
      Object.assign(legendConfig['g2-legend'], style);
    }

    chart.legend(legendConfig);

    if (this.afterRenderCallbacks && legendConfig.autoCollapse) {
      const legendCollapseInfo = legendCollapse.call(this, legendConfig);
      this.afterRenderCallbacks.push(legendCollapseInfo.render);

      if (this.unmountCallbacks) {
        this.unmountCallbacks.push(legendCollapseInfo.unmount);
      }
    }
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

function legendCollapse(legendConfig) {
  const { collapseRow = 2 } = legendConfig;
  let collapseInstance = null;
  return {
    render: function (chart, config) {
      if (config.legend !== false && this.chartDom) {
        const legendWrapperDom = this.chartDom.querySelector('.g2-legend');
        const legendListDom = this.chartDom.querySelector('.g2-legend-list');
        const legendListItemDom = this.chartDom.querySelector('.g2-legend-list-item');

        if (!legendWrapperDom || !legendListDom || !legendListItemDom) {
          return;
        }

        const itemStyle = window.getComputedStyle(legendListItemDom);
        const marginTop = pxToNumber(itemStyle.getPropertyValue('margin-top'));
        const marginBottom = pxToNumber(itemStyle.getPropertyValue('margin-bottom'));
        const itemHeight = legendListItemDom.offsetHeight + marginTop + marginBottom;
        const wrapperHeight = legendWrapperDom.offsetHeight;

        if (wrapperHeight > itemHeight * collapseRow) {
          if (!collapseInstance) {
            collapseInstance = new Collapse(legendWrapperDom, legendListDom, {
              itemHeight,
              collapseRow,
              wrapperHeight
            });
          }

          collapseInstance.start();
        } else {
          if (collapseInstance) {
            collapseInstance.end();
          }
        }
      }
    },
    unmount() {
      if (collapseInstance) {
        collapseInstance.destroy();
      }
    }
  }
}

class Collapse {
  constructor(dom, listDom, config) {
    this.dom = dom;
    this.listDom = listDom;
    this.moveOffset = 0;
    this.config = config;
    this.handleClick = this.handleClick.bind(this);

    const collapseDom = this.collapseDom = document.createElement('div');
    collapseDom.className = 'widgets-legend-collapse';
    collapseDom.innerHTML = `<div class="legend-collapse-btn collapse-up"></div><div class="legend-collapse-btn collapse-down"></div>`;
    collapseDom.addEventListener('click', this.handleClick);
    collapseDom.addEventListener('mousemove', noopEvent);
    collapseDom.addEventListener('mouseout', noopEvent);
  }

  handleClick(e) {
    e.stopPropagation();

    if (!e.target.classList.contains('legend-collapse-btn')) {
      return;
    }

    const { itemHeight, collapseRow, wrapperHeight } = this.config;
    let moveOffset = this.moveOffset;

    // 上一页
    if (e.target.classList.contains('collapse-up')) {
      moveOffset = Math.min(0, moveOffset + 1);
      this.listDom.style.transform = `translate(0, ${moveOffset * itemHeight}px)`;
    }
    // 下一页
    if (e.target.classList.contains('collapse-down')) {
      moveOffset = Math.max(-(wrapperHeight / itemHeight) + collapseRow, moveOffset - 1);
      this.listDom.style.transform = `translate(0, ${moveOffset * itemHeight}px)`;
    }

    this.moveOffset = moveOffset;
  }

  start() {
    const { itemHeight, collapseRow } = this.config;

    this.dom.classList.add('has-collapse');
    this.dom.style.maxHeight = itemHeight * collapseRow + 'px';
    this.dom.appendChild(this.collapseDom);
  }

  end() {
    this.dom.classList.remove('has-collapse');
    this.dom.style.maxHeight = '';
    this.dom.removeChild(this.collapseDom);
  }

  destroy() {
    this.end();

    this.collapseDom.removeEventListener('click', this.handleClick);
    this.collapseDom.removeEventListener('mousemove', noopEvent);
    this.collapseDom.removeEventListener('mouseout', noopEvent);
  }
}

function noopEvent(e) {
  e.stopPropagation();
}