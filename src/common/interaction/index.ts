import { View } from '@antv/g2/esm/core';
import DimRect from '@antv/g2/esm/interaction/action/mask/dim-rect';
import themes from '../../themes';

/* 更新内置的 interaction */

// 带主题设置的 active-region 配置项，使用函数包裹，保证主题始终保持最新
export function activeRegionWithTheme(view: View) {
  view.interaction('active-region', {
    start: [
      {
        trigger: 'plot:mousemove',
        action: 'active-region:show',
        arg: {
          style: {
            // 这一段必须放在函数中运行，否则主题无法更新
            fill: themes['widgets-tooltip-cross-react'],
            opacity: themes['widgets-tooltip-cross-react-opacity'],
          },
          // {number} appendRatio 适用于笛卡尔坐标系. 对于 x 轴非 linear 类型: 默认：0.25, x 轴 linear 类型: 默认 0
          // appendRatio,
          // {number} appendWidth  适用于笛卡尔坐标系. 像素级别，优先级 > appendRatio
          // appendWidth,
        },
      },
    ],
    end: [
      {
        trigger: 'plot:mouseleave',
        action: 'active-region:hide',
      },
    ],
  });
}

// 拖拽缩放时的mask显示
export class NoCaptureDimRect extends DimRect {
  // 添加图形
  protected getMaskAttrs() {
    const { start, end } = this.getRegion();
    const x = Math.min(start.x, end.x);
    const y = Math.min(start.y, end.y);
    const width = Math.abs(end.x - start.x);
    const height = Math.abs(end.y - start.y);
    return {
      x,
      y,
      width: width - 2,
      height,
    };
  }
}
