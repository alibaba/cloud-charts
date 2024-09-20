import { View, registerInteraction } from '@antv/g2/esm/core';

// 更新legendValue的省略文本显示
registerInteraction('ellipsis-custom-text', {
    start: [
      {
        trigger: 'legend-item-name:mousemove',
        action: 'ellipsis-text:show',
        throttle: { wait: 50, leading: true, trailing: false },
      },
      {
        trigger: 'legend-item-name:touchstart',
        action: 'ellipsis-text:show',
        throttle: { wait: 50, leading: true, trailing: false },
      },
      {
        trigger: 'legend-item-value:mousemove',
        action: 'ellipsis-text:show',
        throttle: { wait: 50, leading: true, trailing: false },
      },
      {
        trigger: 'legend-item-value:touchstart',
        action: 'ellipsis-text:show',
        throttle: { wait: 50, leading: true, trailing: false },
      },
      {
        trigger: 'axis-label:mousemove',
        action: 'ellipsis-text:show',
        throttle: { wait: 50, leading: true, trailing: false },
      },
      {
        trigger: 'axis-label:touchstart',
        action: 'ellipsis-text:show',
        throttle: { wait: 50, leading: true, trailing: false },
      },
    ],
    end: [
      { trigger: 'legend-item-name:mouseleave', action: 'ellipsis-text:hide' },
      { trigger: 'legend-item-name:touchend', action: 'ellipsis-text:hide' },
      { trigger: 'legend-item-value:mouseleave', action: 'ellipsis-text:hide' },
      { trigger: 'legend-item-value:touchend', action: 'ellipsis-text:hide' },
      { trigger: 'axis-label:mouseleave', action: 'ellipsis-text:hide' },
      { trigger: 'axis-label:touchend', action: 'ellipsis-text:hide' },
    ],
  });

  export function ellipsisCustomText(view: View) {
    view.interaction('ellipsis-custom-text');
  }
  