'use strict';

// import { registerAction } from "@antv/g2";
// import ResetButton from '@antv/g2/esm/interaction/action/view/button';
import { Chart, Types, Language } from "./types";

export interface ZoomConfig {
  zoom?: boolean;
}

const locale = {
  'zh-cn': {
    reset: '重置',
  },
  'en-us': {
    reset: 'Reset',
  },
};

function isNotInResetButton(context: Types.IInteractionContext) {
  return !(context.isInShape('button-rect') || context.isInShape('button-text'));
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
 * @param {Language} language 当前语言
 * */
export default function(chart: Chart, config: ZoomConfig, language?: Language) {
  if (!config.zoom) {
    return;
  }

  // 修改 tooltip 默认行为，进入 reset button 不展示
  chart.interaction('tooltip', {
    start: [
      {
        trigger: 'plot:mousemove',
        action: 'tooltip:show',
        throttle: {wait: 50, leading: true, trailing: false},
        isEnable: isNotInResetButton,
      },
      {
        trigger: 'plot:touchmove',
        action: 'tooltip:show',
        throttle: {wait: 50, leading: true, trailing: false},
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
    end: [
      {
        trigger: 'mouseup',
        isEnable(context: Types.IInteractionContext) {
          const isInPlot = context.isInPlot();
          // 自定义设置重置按钮的文案
          if (isInPlot) {
            const resetAction = context.getAction('reset-button');
            // @ts-ignore
            if (resetAction.cfg) {
              // @ts-ignore
              resetAction.cfg.text = (locale[language] || locale['zh-cn']).reset
              // TODO 重置按钮根据主题设置样式
            }
          }
          return isInPlot;
        },
        action: ['brush-x:filter', 'brush-x:end', 'x-rect-mask:end', 'x-rect-mask:hide', 'reset-button:show'],
      },
    ],
    rollback: [
      // { trigger: 'dblclick', action: ['brush-x:reset'] },
      {trigger: 'reset-button:click', action: ['brush-x:reset', 'reset-button:hide', 'cursor:crosshair']}
    ],
  });
}
