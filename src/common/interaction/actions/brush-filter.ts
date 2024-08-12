import { Event, View, Action } from '@antv/g2/esm/core';
// import RangeFilter from '@antv/g2/esm/interaction/action/data/range-filter';
import { G2DInterfaces, G2Dependents } from '../../types';

function isMultipleMask(context: G2DInterfaces.IInteractionContext): boolean {
  return context.event.target?.get('name') === 'multi-mask';
}

function isMask(context: G2DInterfaces.IInteractionContext): boolean {
  const event = context.event;
  const target = event.target;
  return (target && target?.get('name') === 'mask') || isMultipleMask(context);
}

/** range-filter 只用于：brush-filter, brush-x-filter, brush-y-filter */
enum EVENTS {
  FILTER = 'brush-filter-processing',
  RESET = 'brush-filter-reset',
  BEFORE_FILTER = 'brush-filter:beforefilter',
  AFTER_FILTER = 'brush-filter:afterfilter',
  BEFORE_RESET = 'brush-filter:beforereset',
  AFTER_RESET = 'brush-filter:afterreset',
}

// 获取对应的 scale
function getFilter(
  scale: G2Dependents.Scale,
  dim: string,
  point1: G2Dependents.Point,
  point2: G2Dependents.Point,
): G2DInterfaces.FilterCondition {
  let min = Math.min(point1[dim], point2[dim]);
  let max = Math.max(point1[dim], point2[dim]);
  const [rangeMin, rangeMax] = scale.range ?? [0, 1];
  // 约束值在 scale 的 range 之间
  if (min < rangeMin) {
    min = rangeMin;
  }
  if (max > rangeMax) {
    max = rangeMax;
  }
  // 范围大于整个 view 的范围，则返回 null
  if (min === rangeMax && max === rangeMax) {
    return null;
  }
  const minValue = scale.invert(min);
  const maxValue = scale.invert(max);
  if (scale.isCategory && scale.values) {
    const minIndex = scale.values.indexOf(minValue);
    const maxIndex = scale.values.indexOf(maxValue);
    const arr = scale.values.slice(minIndex, maxIndex + 1);
    return (value) => {
      return arr.includes(value);
    };
  } else {
    return (value) => {
      return value >= minValue && value <= maxValue;
    };
  }
}

// 框选缩放 Action
export class RangeCustomFilter extends Action {
  /** 允许外部传入 dims */
  protected cfgFields: ['dims'];
  /**
   * 范围过滤生效的字段/维度，可以是 x, y
   */
  protected dims: string[] = ['x', 'y'];
  /** 起始点 */
  protected startPoint: G2Dependents.Point = null;

  protected isCustomStarted: boolean = false;

  // x,y 是否生效
  protected hasCustomDim(dim: string) {
    return this.dims.includes(dim);
  }

  public start() {
    const context = this.context;
    this.isCustomStarted = true;
    this.startPoint = context.getCurrentPoint();
  }

  public filter() {
    let startPoint;
    let currentPoint;
    if (isMask(this.context)) {
      const maskShape = this.context.event.target;
      const bbox = maskShape.getCanvasBBox();
      startPoint = { x: bbox.x, y: bbox.y };
      currentPoint = { x: bbox.maxX, y: bbox.maxY };
    } else {
      if (!this.isCustomStarted) {
        // 如果没有开始，则不执行过滤
        return;
      }
      startPoint = this.startPoint;
      currentPoint = this.context.getCurrentPoint();
    }
    if (Math.abs(startPoint.x - currentPoint.x) < 5 || Math.abs(startPoint.x - currentPoint.y) < 5) {
      // 距离过小也不生效
      return;
    }
    const { view, event } = this.context;
    const payload = { view, event, dims: this.dims };
    view.emit(EVENTS.BEFORE_FILTER, Event.fromData(view, EVENTS.BEFORE_FILTER, payload));

    const coord = view.getCoordinate();
    const normalCurrent = coord.invert(currentPoint);
    const normalStart = coord.invert(startPoint);

    // 多视图下取第一个视图
    if (view.views.length > 0) {
      const subView = view.views[0];
      // 设置 x 方向的 filter
      if (this.hasCustomDim('x')) {
        const xScale = subView.getXScale();
        const filter = getFilter(xScale, 'x', normalCurrent, normalStart);
        this.filterView(view, xScale.field, filter);
      }
      // 设置 y 方向的 filter
      if (this.hasCustomDim('y')) {
        const yScale = subView.getYScales()[0];
        const filter = getFilter(yScale, 'y', normalCurrent, normalStart);
        this.filterView(view, yScale.field, filter);
      }
      // view.views.forEach((subView: View) => {
      //   // 设置 x 方向的 filter
      //   if (this.hasCustomDim('x')) {
      //     const xScale = subView.getXScale();
      //     const filter = getFilter(xScale, 'x', normalCurrent, normalStart);
      //     this.filterView(subView, xScale.field, filter);
      //   }
      //   // 设置 y 方向的 filter
      //   if (this.hasCustomDim('y')) {
      //     const yScale = subView.getYScales()[0];
      //     const filter = getFilter(yScale, 'y', normalCurrent, normalStart);
      //     this.filterView(subView, yScale.field, filter);
      //   }
      // });
    } else {
      // 设置 x 方向的 filter
      if (this.hasCustomDim('x')) {
        const xScale = view.getXScale();
        const filter = getFilter(xScale, 'x', normalCurrent, normalStart);
        this.filterView(view, xScale.field, filter);
      }
      // 设置 y 方向的 filter
      if (this.hasCustomDim('y')) {
        const yScale = view.getYScales()[0];
        const filter = getFilter(yScale, 'y', normalCurrent, normalStart);
        this.filterView(view, yScale.field, filter);
      }
    }

    this.reRender(view, { source: EVENTS.FILTER });

    view.emit(EVENTS.AFTER_FILTER, Event.fromData(view, EVENTS.AFTER_FILTER, payload));
  }

  public end() {
    this.isCustomStarted = false;
  }

  public reset() {
    const view = this.context.view;
    view.emit(EVENTS.BEFORE_RESET, Event.fromData(view, EVENTS.BEFORE_RESET, {}));

    this.isCustomStarted = false;
    if (view.views.length > 0) {
      const subView = view.views[0];
      if (this.hasCustomDim('x')) {
        const xScale = subView.getXScale();
        this.filterView(view, xScale.field, null); // 取消过滤
      }
      if (this.hasCustomDim('y')) {
        // y 轴过滤仅取第一个 yScale
        const yScale = subView.getYScales()[0];
        this.filterView(view, yScale.field, null); // 取消过滤
      }
    } else {
      if (this.hasCustomDim('x')) {
        const xScale = view.getXScale();
        this.filterView(view, xScale.field, null); // 取消过滤
      }
      if (this.hasCustomDim('y')) {
        // y 轴过滤仅取第一个 yScale
        const yScale = view.getYScales()[0];
        this.filterView(view, yScale.field, null); // 取消过滤
      }
    }
    this.reRender(view, { source: EVENTS.RESET });

    view.emit(EVENTS.AFTER_RESET, Event.fromData(view, EVENTS.AFTER_RESET, {}));
  }


  /**
   * 对 view 进行过滤
   */
  protected filterView(view: View, field: string, filter: G2DInterfaces.FilterCondition) {
    if (view.views.length > 0) {
      view.views.forEach((subView: View) => {
        subView.filter(field, filter);
      });
    } else {
      view.filter(field, filter);
    }
  }

  /**
   * 重新渲染
   * @param view
   */
  protected reRender(view: View, payload?: G2DInterfaces.EventPayload) {
    view.render(true, payload);
  }
}
