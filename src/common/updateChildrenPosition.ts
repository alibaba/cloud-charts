import { Chart } from '../common/types';
import { FullCrossName } from '../constants';
import { pxToNumber } from './common';

/**
 * updateChildrenPosition，需要在 chart afterpaint 中调用，相比 afterrender 事件，在数据更新后也会触发 afterpaint
 *
 * @param {Chart} chart 图表实例
 * @param {HTMLElement} dom 元素节点
 * */
export default function (chart: Chart, dom: HTMLElement) {
  // 更新子元素位置
  // 限制子元素宽度
  const childDom = dom && (dom.querySelector(`.${FullCrossName}-children`) as HTMLElement);

  if (childDom) {
    const centerPoint = chart.getCoordinate().getCenter();
    childDom.style.left = `${centerPoint.x}px`;
    childDom.style.top = `${centerPoint.y}px`;

    let parentMinSize = 0;
    // 获取父元素配置
    const innerRadius = chart?.widgetsCtx?.props?.config?.innerRadius || 0.6;

    // 获取父元素尺寸
    const parentDom = childDom && (childDom.parentNode as HTMLElement);
    if (parentDom) {
      const { width, height } = parentDom?.style || {};
      parentMinSize = Math.min(pxToNumber(width), pxToNumber(height));
    }

    // 获取坐标系尺寸
    const bBoxMinSize = Math.min(chart?.coordinateBBox?.width, chart?.coordinateBBox?.height);

    const minSize = Math.min(parentMinSize, bBoxMinSize);
    if (minSize !== 0) {
      childDom.style.maxWidth = `${minSize * innerRadius}px`;
    }
  }
}
