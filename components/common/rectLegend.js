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
    const { autoCollapse = true, collapseRow = 'auto', align, nameFormatter, valueFormatter, showData, customConfig, allowAllCanceled = false, style = {} } = config.legend || {};

    const legendConfig = {
      // 这些是widgets特有的属性
      autoCollapse,
      collapseRow,
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
      Object.keys(style).forEach((key) => {
        if (style[key]) {
          legendConfig['g2-legend'][key] = style[key];
        }
      });
      // Object.assign(legendConfig['g2-legend'], style);
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
  let { collapseRow = 2 } = legendConfig;
  let collapseInstance = null;
  return {
    render(chart, config) {
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

        // 自动适配图例折叠高度
        if (collapseRow === 'auto') {
          const chartHeight = this._size && this._size[1];
          if (chartHeight) {
            // 行数最多占图表高度的三分之一，最小为2。
            collapseRow = Math.max(2, Math.round(( chartHeight / itemHeight ) / 3));
          }
        } else {
          collapseRow = Number(collapseRow);
        }

        if (wrapperHeight > itemHeight * collapseRow) {
          if (!collapseInstance) {
            collapseInstance = new Collapse(legendWrapperDom, legendListDom, {
              wrapperHeight,
              itemHeight,
              collapseRow,
              collapseTop: marginTop,
              collapseBottom: marginBottom,
            });
          }

          collapseInstance.start({ collapseRow });
        } else if (collapseInstance) {
          collapseInstance.end();
        }
      }
    },
    unmount() {
      if (collapseInstance) {
        collapseInstance.destroy();
      }
    }
  };
}

class Collapse {
  constructor(dom, listDom, config) {
    this.dom = dom;
    this.listDom = listDom;
    this.moveOffset = 0;
    this.config = config;
    this.handleClick = this.handleClick.bind(this);

    const { itemHeight, collapseRow, wrapperHeight, collapseTop, collapseBottom } = this.config;

    const collapseDom = this.collapseDom = document.createElement('div');
    collapseDom.className = 'widgets-legend-collapse';
    collapseDom.style.paddingTop = `${collapseTop}px`;
    collapseDom.style.paddingBottom = `${collapseBottom}px`;

    const collapseUpDom = this.collapseUpDom = document.createElement('div');
    collapseUpDom.className = 'legend-collapse-btn collapse-up';
    const collapseDownDom = this.collapseDownDom = document.createElement('div');
    collapseDownDom.className = 'legend-collapse-btn collapse-down';
    collapseDom.appendChild(collapseUpDom);
    collapseDom.appendChild(collapseDownDom);

    collapseDom.addEventListener('click', this.handleClick);
    collapseDom.addEventListener('mousemove', noopEvent);
    collapseDom.addEventListener('mouseout', noopEvent);

    this.minOffset = -(wrapperHeight / itemHeight) + collapseRow;
    this.maxOffset = 0;
  }

  handleClick(e) {
    e.stopPropagation();

    if (!e.target.classList.contains('legend-collapse-btn') || e.target.classList.contains('disable')) {
      return;
    }

    let moveOffset = this.moveOffset;

    // 上一页
    if (e.target.classList.contains('collapse-up')) {
      moveOffset += 1;
    }
    // 下一页
    if (e.target.classList.contains('collapse-down')) {
      moveOffset -= 1;
    }

    this.moveOffset = moveOffset;

    this.renderState();
  }

  renderState() {
    const { itemHeight } = this.config;

    this.collapseUpDom.classList.remove('disable');
    this.collapseDownDom.classList.remove('disable');

    // 不能向下
    if (this.moveOffset <= this.minOffset) {
      this.moveOffset = this.minOffset;
      this.collapseDownDom.classList.add('disable');
    }

    // 不能向上
    if (this.moveOffset >= this.maxOffset) {
      this.moveOffset = this.maxOffset;
      this.collapseUpDom.classList.add('disable');
    }

    this.listDom.style.transform = `translate(0, ${this.moveOffset * itemHeight}px)`;
  }

  start({ collapseRow: newCollapseRow }) {
    const { itemHeight, collapseRow: oldCollapseRow } = this.config;
    const collapseRow = newCollapseRow || oldCollapseRow;

    this.dom.classList.add('has-collapse');

    // 展示时重新获取高度
    // 修复因样式变化导致滚动范围改变所引起的问题。
    this.config.wrapperHeight = this.dom.offsetHeight;
    this.minOffset = -(this.config.wrapperHeight / itemHeight) + collapseRow;

    this.dom.style.maxHeight = `${itemHeight * collapseRow}px`;
    this.dom.appendChild(this.collapseDom);

    this.renderState();
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
