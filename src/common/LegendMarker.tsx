import React from 'react';

export interface LegendMarkerProps {
  /** marker配置项，同g2中数据结构 */
  marker: any;

  /** 当前legend是否disable */
  disable?: boolean;
}

/**
 * 根据marker配置项绘制legend marker
 */
export default function LegendMarker({ marker, disable = false }: LegendMarkerProps) {
  const { symbol, style } = marker;
  if (['line', 'smooth', 'hv'].includes(typeof symbol === 'string' ? symbol : symbol?.name)) {
    return (
      <div
        style={{
          width: 8,
          height: 2,
          background: style.stroke,
          opacity: disable ? 0.3 : 1,
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
