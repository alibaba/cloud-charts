import { Chart } from '../common/types';
import { FullCrossName } from '../constants';

/**
 * updateChildrenPosition，需要在 chart afterpaint 中调用，相比 afterrender 事件，在数据更新后也会触发 afterpaint
 *
 * @param {Chart} chart 图表实例
 * @param {HTMLElement} dom 元素节点
 * */
export default function (chart: Chart, dom: HTMLElement) {
  // 更新子元素位置
  const childDom = dom && (dom.querySelector(`.${FullCrossName}-children`) as HTMLElement);
  if (childDom) {
    const centerPoint = chart.getCoordinate().getCenter();
    childDom.style.left = `${centerPoint.x}px`;
    childDom.style.top = `${centerPoint.y}px`;
  }
}
