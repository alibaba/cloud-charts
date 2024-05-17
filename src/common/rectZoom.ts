'use strict';

// import { registerAction } from "@antv/g2";
// import ResetButton from '@antv/g2/esm/interaction/action/view/button';
import { Chart, Types } from './types';
import themes from '../themes';
import { registerAction } from '@antv/g2/esm';
import { NoCaptureDimRect } from './interaction/index';

registerAction('rect-mask-nocapture', NoCaptureDimRect, { dim: 'x' });

export interface ZoomConfig {
  zoom?: boolean;
}

function isNotInResetButton(context: Types.IInteractionContext) {
  return !(context.isInShape('button-rect') || context.isInShape('button-text'));
}

function isPointInViewNotInResetButton(context: Types.IInteractionContext) {
  return context.isInPlot() && !(context.isInShape('button-rect') || context.isInShape('button-text'));
}

// registerAction('custom-reset-button', ResetButton, {
//   name: 'reset-button',
//   text: 'reset',
// });

/**
 * 直角坐标系的拖拽缩放设置
 *
 * @param {Chart} chart 图表实例
 * @param {ZoomConfig} config 配置项
 * @param {text} string 重置的文案
 * */
export default function (chart: Chart, config: ZoomConfig, text: string) {
  if (!config.zoom) {
    return;
  }

  // 修改 tooltip 默认行为，进入 reset button 不展示
  chart.interaction('tooltip', {
    start: [
      {
        trigger: 'plot:mousemove',
        action: 'tooltip:show',
        throttle: { wait: 50, leading: true, trailing: false },
        isEnable: isNotInResetButton,
      },
      {
        trigger: 'plot:touchmove',
        action: 'tooltip:show',
        throttle: { wait: 50, leading: true, trailing: false },
        isEnable: isNotInResetButton,
      },
    ],
    end: [
      { trigger: 'plot:mouseleave', action: 'tooltip:hide' },
      { trigger: 'plot:leave', action: 'tooltip:hide' },
      { trigger: 'plot:touchend', action: 'tooltip:hide' },
      { trigger: 'reset-button:mouseenter', action: 'tooltip:hide' },
      // { trigger: 'reset-button:mousemove', action: 'tooltip:hide' },
    ],
  });

  chart.interaction('brush-x', {
    start: [
      {
        trigger: 'mousedown',
        isEnable: isPointInViewNotInResetButton,
        action: ['brush-x:start', 'rect-mask-nocapture:start', 'rect-mask-nocapture:show'],
        callback(context: Types.IInteractionContext) {
          chart.emit(
            'zoom:start',
            {
              ...context.getCurrentPoint(),
            },
            context,
          );
        },
      },
    ],
    processing: [
      {
        trigger: 'mousemove',
        isEnable: isPointInViewNotInResetButton,
        action: ['rect-mask-nocapture:resize'],
      },
    ],
    end: [
      {
        trigger: 'mouseup',
        isEnable: isPointInViewNotInResetButton,
        action: ['brush-x:filter', 'brush-x:end', 'rect-mask-nocapture:end', 'rect-mask-nocapture:hide'],
        callback(context: Types.IInteractionContext) {
          const rangeFilterAction = context.getAction('brush-x');
          const startPoint = rangeFilterAction.startPoint;
          const endPoint = context.getCurrentPoint();

          // 间距过小时不进行filter
          if (Math.abs(endPoint.x - startPoint.x) < 2) {
            // const cursorAction = context.getAction('cursor');
            // cursorAction.crosshair();
            return;
          } else {
            const resetAction = context.getAction('reset-button');
            // @ts-ignore
            if (resetAction.cfg) {
              // @ts-ignore
              Object.assign(resetAction.cfg, {
                text,
                textStyle: {
                  fill: themes['widgets-color-primary'],
                },
                style: {
                  fill: themes['widgets-color-background'],
                  stroke: themes['widgets-color-gray'],
                  lineWidth: 0.5,
                  // strokeWidth: 1,
                },
                activeStyle: {
                  fill: themes['widgets-color-background'],
                  stroke: themes['widgets-color-primary'],
                },
              });
            }
            resetAction.show();

            chart.emit(
              'zoom:end',
              {
                // @ts-ignore
                startPoint: rangeFilterAction.startPoint,
                endPoint: context.getCurrentPoint(),
                // @ts-ignore
                data: context.view.filteredData,
              },
              context,
            );
          }
        },
      },
    ],
    rollback: [
      // { trigger: 'dblclick', action: ['brush-x:reset'] },
      {
        trigger: 'reset-button:click',
        action: ['brush-x:reset', 'reset-button:hide', 'cursor:crosshair'],
        callback(context: Types.IInteractionContext) {
          chart.emit('zoom:reset', context);
        },
      },
    ],
  });
}
