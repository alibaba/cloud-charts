'use strict';

import themes from '../themes/index';
import { pxToNumber, isInvalidNumber } from './common';
import merge from './merge';
import { legendHtmlContainer, legendHtmlList, legendHtmlListItem, legendHtmlMarker, legendTextStyle } from './g2Theme';

/*
* 提取渐变色中的第一个颜色，具体逻辑来自 G2 内部
* */
// const regexTags = /[MLHVQTCSAZ]([^MLHVQTCSAZ]*)/ig;
// const regexDot = /[^\s\,]+/ig;
const regexLG = /^l\s*\(\s*([\d.]+)\s*\)\s*(.*)/i;
const regexRG = /^r\s*\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*\)\s*(.*)/i;
// const regexPR = /^p\s*\(\s*([axyn])\s*\)\s*(.*)/i;
const regexColorStop = /[\d.]+:(#[^\s]+|[^\)]+\))/ig;

// 取匹配出来的第一个颜色
function getFirstStop(steps) {
  return steps.match(regexColorStop)[0].split(':')[1];
}
function getColor(color) {
  if (color[1] === '(' || color[2] === '(') {
    if (color[0] === 'l') {
      // 线性 regexLG.test(color)
      return getFirstStop(regexLG.exec(color)[2]);
    } else if (color[0] === 'r') {
      // 径向 regexRG.test(color)
      return getFirstStop(regexRG.exec(color)[4]);
    } else if (color[0] === 'p') {
      // regexPR.test(color)
      // return parsePattern(color, self, context);
    }
  }
  return color;
}

/**
 * rectLegend 直角坐标系legend配置。
 *
 * @param {Chart} chart 图表实例
 * @param {Object} config 配置项
 * @param {Object} componentConfig 组件的自定义配置
 * @param {boolean} isOneDataGroup 数据是否为单组形式，类似饼图和漏斗图
 * @param {string} field 数据映射字段
 * */
export default function (chart, config, componentConfig, isOneDataGroup, field) {
  // 设置图例
  if (config.legend === false || (config.legend && config.legend.visible === false)) {
    chart.legend(false);
  } else {
    const {
      // 自动折叠图例
      autoCollapse = true,
      collapseRow = 'auto',
      // 图例位置
      position = 'top',
      align,
      // 格式化函数
      nameFormatter,
      valueFormatter,
      showData,
      // 交互相关
      allowAllCanceled = false,
      hoverable = false,
      onHover = null,
      clickable = true,
      onClick = null,
      defaultClickBehavior = true,
      // 自定义配置
      customConfig,
      style = {},
    } = config.legend || {};

    // 因为图例项有下边距，所以bottom设置为0即可
    const legendStyle = Object.assign({}, legendHtmlContainer);
    const legendItemStyle = Object.assign({}, legendHtmlListItem);
    if (position === 'bottom') {
      legendStyle.bottom = 0;
      legendStyle.overflow = 'visible';
      // 置于下方时设置margin top
      legendItemStyle.marginBottom = 0;
      legendItemStyle.marginTop = themes['widgets-font-size-1']
    } else {
      legendStyle.top = 0;
    }
    if (align === 'right') {
      legendStyle.right = 0;
      legendStyle.textAlign = 'right';
    } else if (align === 'left') {
      legendStyle.left = 0;
    } else if (align === 'center') {
      legendStyle.left = 0;
      legendStyle.width = '100%';
      legendStyle.textAlign = 'center';
    } else {
      // 默认放到左边
      legendStyle.left = 0;
    }

    const legendConfig = {
      // 这些是widgets特有的属性
      autoCollapse,
      collapseRow,
      // 以下为g2的属性
      useHtml: true,
      title: null,
      position: position || 'top',
      allowAllCanceled,
      // 这个属性文档里没有，设置为false可以让图例不居中，再手动设置定位样式
      autoPosition: false,
      hoverable,
      onHover,
      clickable,
      onClick,
      // 隐藏属性，设置了 onClick 时依然保留默认点击行为
      defaultClickHandlerEnabled: defaultClickBehavior,
      itemTpl: (value, color, checked, index) => {
        const item = getRawData(config, this.rawData, value, isOneDataGroup);

        const newName = nameFormatter ? nameFormatter(value, {
          ...item,
          color,
          checked,
        }, index) : value;

        if (showData) {
          const dataValue = getDataValue(item.data);
          const newValue = valueFormatter ? valueFormatter(dataValue, {
            ...item,
            color,
            checked,
          }, index) : dataValue;

          return `${'<li class="g2-legend-list-item item-{index} {checked}" data-color="{originColor}" data-value="{originValue}">' +
          `<i class="g2-legend-marker" style="background-color:${getColor(color)};"></i>` +
          '<span class="g2-legend-text">'}${newName}</span><span class="g2-legend-value">${newValue}</span></li>`;
        }

        return `${'<li class="g2-legend-list-item item-{index} {checked}" data-color="{originColor}" data-value="{originValue}">' +
          `<i class="g2-legend-marker" style="background-color:${getColor(color)};"></i>` +
          '<span class="g2-legend-text">'}${newName}</span></li>`;
      },
      'g2-legend': legendStyle,
      'g2-legend-list': Object.assign({}, legendHtmlList),
      'g2-legend-list-item': legendItemStyle,
      'g2-legend-marker': Object.assign({}, legendHtmlMarker),
      textStyle: Object.assign({}, legendTextStyle),
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
        // 确保每一项有值设置了，如果是假值则忽略
        if (style[key]) {
          // hack 字号转化为 px
          if (key === 'fontSize' && !isInvalidNumber(style[key])) {
            legendConfig['g2-legend'][key] = `${style[key]}px`;
          } else {
            legendConfig['g2-legend'][key] = style[key];
          }
          // fix: 新版G2后，图例文字颜色的设置需要注入 textStyle 中才能生效。
          if (key === 'color' && legendConfig.textStyle && typeof legendConfig.textStyle === 'object') {
            legendConfig.textStyle.fill = style[key];
          }
        }
      });
      // Object.assign(legendConfig['g2-legend'], style);
    }

    if (field) {
      // fix: 修复 legend 设置了 field 后，内部 options 变为 { [field]: options }，无法读取 onClick 的问题
      if (onClick) {
        chart.legend({
          onClick,
          // 隐藏属性，设置了 onClick 时依然保留默认点击行为
          defaultClickHandlerEnabled: defaultClickBehavior,
        });
      }
      chart.legend(field, legendConfig);
    } else {
      chart.legend(legendConfig);
    }

    if (this.afterRenderCallbacks && legendConfig.autoCollapse) {
      const legendCollapseInfo = legendCollapse.call(this, legendConfig);
      this.afterRenderCallbacks.push(legendCollapseInfo.render);

      if (this.unmountCallbacks) {
        this.unmountCallbacks.push(legendCollapseInfo.unmount);
      }
    }
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
        data: result,
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
            collapseRow = Math.max(2, Math.round((chartHeight / itemHeight) / 3));
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
          } else if (collapseInstance.dom !== legendWrapperDom || collapseInstance.listDom !== legendListDom) {
            // 重新渲染后，dom节点可能已经改变，销毁重建
            collapseInstance.destroy();

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
    },
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

    const collapseDom = document.createElement('div');
    collapseDom.className = 'widgets-legend-collapse';
    collapseDom.style.paddingTop = `${collapseTop}px`;
    collapseDom.style.paddingBottom = `${collapseBottom}px`;
    this.collapseDom = collapseDom;

    const collapseUpDom = document.createElement('div');
    collapseUpDom.className = 'legend-collapse-btn collapse-up';
    this.collapseUpDom = collapseUpDom;
    const collapseDownDom = document.createElement('div');
    collapseDownDom.className = 'legend-collapse-btn collapse-down';
    this.collapseDownDom = collapseDownDom;
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

    let { moveOffset } = this;

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
    // dom被g2重新渲染后已经不在原来的树中，需要额外判断
    if (this.collapseDom.parentNode === this.dom) {
      this.dom.removeChild(this.collapseDom);
    }
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
