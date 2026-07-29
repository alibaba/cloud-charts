import React from 'react';
import type { LegendModel, LegendItem } from '@alicloud/cloud-charts-core';
import { useLegendInteractions } from './useLegendInteractions';

export interface TableLegendProps {
  legend: LegendModel;
  items?: LegendItem[];
  chart?: unknown;
  originalSpec?: Record<string, unknown>;
  legendField?: string;
  clickable?: boolean;
  hoverable?: boolean;
  useReverseChecked?: boolean;
  allowAllCanceled?: boolean;
  containerHeight?: number;
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
 * TableLegend：旧 src/aop/component/TableLegend 的 React 移植。
 * 支持统计列（min/max/avg/current）由 tableConfig.statistics 字符串数组指定。
 * 支持 filter（点击过滤）和 highlight（hover 高亮）交互。
 */
export function TableLegend(props: TableLegendProps): JSX.Element | null {
  if (props.legend.mode !== 'table') return null;
  const cfg = (props.legend.tableConfig ?? {}) as {
    statistics?: string[];
    columns?: Array<{ key: string; title: string; render?: (item: LegendItem) => React.ReactNode }>;
  };
  const statistics = cfg.statistics ?? ['current'];
  const columns = cfg.columns ?? [];
  const list = props.items ?? props.legend.items ?? [];

  const {
    isFiltered,
    isActive,
    onItemClick,
    onItemEnter,
    onItemLeave,
  } = useLegendInteractions({
    chart: props.chart,
    items: list,
    legendField: props.legendField || 'color',
    clickable: props.clickable ?? props.legend.clickable,
    hoverable: props.hoverable ?? props.legend.hoverable,
    useReverseChecked: props.useReverseChecked ?? props.legend.useReverseChecked,
    allowAllCanceled: props.allowAllCanceled ?? props.legend.allowAllCanceled,
    originalSpec: props.originalSpec,
  });

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
        {list.map((item) => {
          const id = String(item.name);
          return (
            <tr
              key={id}
              onClick={(e) => onItemClick(item, e)}
              onMouseEnter={() => onItemEnter(item)}
              onMouseLeave={() => onItemLeave()}
              style={{
                cursor: 'pointer',
                color: !isFiltered(id) ? (isActive(id) ? '#333' : '#666') : '#ccc',
              }}
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
          );
        })}
      </tbody>
    </table>
  );
}
