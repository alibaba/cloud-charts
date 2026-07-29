import React from 'react';
import type { LegendModel } from '@alicloud/cloud-charts-core';
import { highlightChartByValue, clearChartHighlight } from '@alicloud/cloud-charts-core';

export interface GradientLegendProps {
  legend: LegendModel;
  /** G2 v5 chart instance (for hover highlight) */
  chart?: unknown;
  /** Color channel field name */
  legendField?: string;
  /** Whether hovering is enabled */
  hoverable?: boolean;
  /** 数值范围 [min, max]；缺省取 gradientConfig.range */
  range?: [number, number];
}

const containerStyle: React.CSSProperties = {
  fontSize: 12,
  color: '#333',
  marginTop: 8,
  display: 'flex',
  alignItems: 'center',
  gap: 8,
};
const labelStyle: React.CSSProperties = { color: '#888' };
const colorBlockStyle = (color: string): React.CSSProperties => ({
  width: 50,
  height: 20,
  background: color,
  cursor: 'pointer',
});
const barStyle = (colors: string[]): React.CSSProperties => ({
  width: 200,
  height: 8,
  borderRadius: 4,
  background: `linear-gradient(to right, ${colors.join(', ')})`,
  border: '1px solid rgba(0,0,0,0.06)',
});

const DEFAULT_COLORS = [
  { type: 'green', color: '#52c41a' },
  { type: 'yellow', color: '#fadb14' },
  { type: 'orange', color: '#fa8c16' },
  { type: 'red', color: '#f5222d' },
];

/**
 * GradientLegend：旧 src/aop/component/GradientLegend 的 React 移植。
 * 显示色阶 + 两端数值。支持 hover 高亮对应类型数据。
 */
export function GradientLegend(props: GradientLegendProps): JSX.Element | null {
  if (props.legend.mode !== 'gradient') return null;
  const cfg = (props.legend.gradientConfig ?? {}) as {
    colors?: Array<{ type: string; color: string }> | string[];
    range?: [number, number];
  };

  // Normalize colors: accept both [{type, color}] and ['color1', 'color2'] formats
  let colors: Array<{ type: string; color: string }>;
  if (Array.isArray(cfg.colors) && cfg.colors.length >= 2) {
    if (typeof cfg.colors[0] === 'string') {
      colors = (cfg.colors as string[]).map((color, i) => ({
        type: `color-${i}`,
        color,
      }));
    } else {
      colors = cfg.colors as Array<{ type: string; color: string }>;
    }
  } else {
    colors = DEFAULT_COLORS;
  }

  const [min, max] = props.range ?? cfg.range ?? [0, 100];
  const legendField = props.legendField || 'color';
  const hoverable = props.hoverable ?? props.legend.hoverable ?? true;

  const onHover = (type: string) => {
    if (!hoverable || !props.chart) return;
    highlightChartByValue(props.chart, legendField, type);
  };

  const onLeave = () => {
    if (!hoverable || !props.chart) return;
    clearChartHighlight(props.chart);
  };

  return (
    <div style={containerStyle}>
      <span style={labelStyle}>{min}</span>
      <div style={{ display: 'flex', gap: 1 }}>
        {colors.map(({ type, color }) => (
          <div
            key={type}
            style={colorBlockStyle(color)}
            onMouseEnter={() => onHover(type)}
            onMouseLeave={onLeave}
          />
        ))}
      </div>
      <span style={labelStyle}>{max}</span>
    </div>
  );
}
