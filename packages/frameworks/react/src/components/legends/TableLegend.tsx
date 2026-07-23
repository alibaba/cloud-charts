import React from 'react';
import type { LegendModel } from '@alicloud/cloud-charts-core';

export interface LegendItem {
  name: string;
  color?: string;
  value?: unknown;
  [key: string]: unknown;
}

export interface TableLegendProps {
  legend: LegendModel;
  items?: LegendItem[];
  onItemClick?: (item: LegendItem) => void;
  onItemHover?: (item: LegendItem | null) => void;
}

const tableStyle: React.CSSProperties = {
  fontSize: 12,
  color: '#333',
  borderCollapse: 'collapse' as const,
  marginTop: 8,
  width: '100%',
};
const cellStyle: React.CSSProperties = {
  padding: '4px 8px',
  textAlign: 'left' as const,
  borderBottom: '1px solid rgba(0,0,0,0.06)',
};
const headerStyle: React.CSSProperties = {
  ...cellStyle,
  fontWeight: 600,
  background: 'rgba(0,0,0,0.02)',
};
const markerStyle = (color: string): React.CSSProperties => ({
  display: 'inline-block',
  width: 8,
  height: 8,
  borderRadius: '50%',
  background: color,
  marginRight: 6,
  verticalAlign: 'middle',
});

/**
 * TableLegend：旧 src/aop/component/TableLegend 的 framework-agnostic 移植。
 * 支持统计列（min/max/avg/current）由 tableConfig.statistics 字符串数组指定。
 */
export function TableLegend({ legend, items, onItemClick, onItemHover }: TableLegendProps): JSX.Element | null {
  if (legend.mode !== 'table') return null;
  const cfg = (legend.tableConfig ?? {}) as { statistics?: string[]; columns?: Array<{ key: string; title: string; render?: (item: LegendItem) => React.ReactNode }> };
  const statistics = cfg.statistics ?? ['current'];
  const columns = cfg.columns ?? [];
  const list = items ?? legend.items ?? [];

  return (
    <table style={tableStyle}>
      <thead>
        <tr>
          <th style={headerStyle}>系列</th>
          {statistics.map((s) => (
            <th key={s} style={headerStyle}>{s}</th>
          ))}
          {columns.map((c) => (
            <th key={c.key} style={headerStyle}>{c.title}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {list.map((item) => (
          <tr
            key={item.name}
            onClick={() => onItemClick?.(item)}
            onMouseEnter={() => onItemHover?.(item)}
            onMouseLeave={() => onItemHover?.(null)}
            style={{ cursor: 'pointer' }}
          >
            <td style={cellStyle}>
              {item.color ? <span style={markerStyle(item.color)} /> : null}
              {item.name}
            </td>
            {statistics.map((s) => (
              <td key={s} style={cellStyle}>
                {String((item[s] as unknown) ?? '')}
              </td>
            ))}
            {columns.map((c) => (
              <td key={c.key} style={cellStyle}>
                {c.render ? c.render(item) : String((item[c.key] as unknown) ?? '')}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
