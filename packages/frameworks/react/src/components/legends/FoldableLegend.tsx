import React, { useState } from 'react';
import type { LegendModel } from '@alicloud/cloud-charts-core';

export interface LegendItem {
  name: string;
  color?: string;
  value?: unknown;
  [key: string]: unknown;
}

export interface FoldableLegendProps {
  legend: LegendModel;
  items?: LegendItem[];
  onItemClick?: (item: LegendItem) => void;
  onItemHover?: (item: LegendItem | null) => void;
}

const containerStyle: React.CSSProperties = { fontSize: 12, color: '#333', marginTop: 8 };
const itemRowStyle: React.CSSProperties = { display: 'flex', flexWrap: 'wrap' as const, gap: 12, alignItems: 'center' };
const itemStyle: React.CSSProperties = { display: 'flex', alignItems: 'center', cursor: 'pointer' };
const markerStyle = (color: string): React.CSSProperties => ({
  display: 'inline-block',
  width: 8,
  height: 8,
  borderRadius: '50%',
  background: color,
  marginRight: 4,
});
const moreBtnStyle: React.CSSProperties = {
  background: 'transparent',
  border: '1px solid rgba(0,0,0,0.12)',
  borderRadius: 3,
  padding: '0 6px',
  fontSize: 11,
  cursor: 'pointer',
  color: '#666',
};

const DEFAULT_VISIBLE = 6;

/**
 * FoldableLegend：旧 src/aop/component/FoldableLegend 的 framework-agnostic 移植。
 * 默认展示前 N 个，超出后用 "+N" 按钮展开。
 */
export function FoldableLegend({ legend, items, onItemClick, onItemHover }: FoldableLegendProps): JSX.Element | null {
  const [expanded, setExpanded] = useState(false);
  if (legend.mode !== 'foldable') return null;
  const list = items ?? legend.items ?? [];
  const visibleCount = expanded ? list.length : DEFAULT_VISIBLE;
  const visible = list.slice(0, visibleCount);
  const overflow = list.length - visibleCount;

  return (
    <div style={containerStyle}>
      <div style={itemRowStyle}>
        {visible.map((item) => (
          <span
            key={item.name}
            style={itemStyle}
            onClick={() => onItemClick?.(item)}
            onMouseEnter={() => onItemHover?.(item)}
            onMouseLeave={() => onItemHover?.(null)}
          >
            {item.color ? <span style={markerStyle(item.color)} /> : null}
            {item.name}
          </span>
        ))}
        {!expanded && overflow > 0 ? (
          <button type="button" style={moreBtnStyle} onClick={() => setExpanded(true)}>
            +{overflow}
          </button>
        ) : null}
        {expanded && list.length > DEFAULT_VISIBLE ? (
          <button type="button" style={moreBtnStyle} onClick={() => setExpanded(false)}>
            收起
          </button>
        ) : null}
      </div>
    </div>
  );
}
