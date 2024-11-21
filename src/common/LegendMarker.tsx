import React from 'react';
import { ListItem } from '@antv/g2/esm/dependents';

export interface LegendMarkerProps {
  /** marker配置项，同g2中数据结构 */
  marker: any;

  /** 当前legend是否disable */
  disable?: boolean;

  item?: ListItem;
}

/**
 * 根据marker配置项绘制legend marker
 */
export default function LegendMarker({ marker, disable = false, item }: LegendMarkerProps) {
  const { symbol, style } = marker;
  if (['line', 'smooth', 'hv', 'circle'].includes(typeof symbol === 'string' ? symbol : symbol?.name)) {
    return (
      <div
        style={{
          width: (symbol || symbol?.name) === 'circle' ? (style?.r * 2 ?? 6) : 8,
          height: (symbol || symbol?.name) === 'circle' ? (style?.r * 2 ?? 6) : 2,
          background: item?.marker?.dataFill ?? style.stroke ?? style.fill,
          opacity: disable ? 0.3 : 1,
          borderRadius: (symbol || symbol?.name) === 'circle' ? '50%' : 0
        }}
      ></div>
    );
  } else {
    // 处理渐变
    const fill = style?.fill?.startsWith('l(') ? style.fill.split(' ')?.[1]?.slice(2) : style.fill;
    return (
      <div
        style={{
          width: 8,
          height: 8,
          background: symbol?.name === 'symbol' ? style?.stroke ?? fill : fill,
          opacity: disable ? 0.3 : 1,
        }}
      ></div>
    );
  }
}
