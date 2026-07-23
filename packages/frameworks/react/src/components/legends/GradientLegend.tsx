import React from 'react';
import type { LegendModel } from '@alicloud/cloud-charts-core';

export interface GradientLegendProps {
  legend: LegendModel;
  /** 数值范围 [min, max]；缺省取 gradientConfig.range */
  range?: [number, number];
}

const containerStyle: React.CSSProperties = { fontSize: 12, color: '#333', marginTop: 8, display: 'flex', alignItems: 'center', gap: 8 };
const labelStyle: React.CSSProperties = { color: '#888' };
const barStyle = (colors: string[]): React.CSSProperties => ({
  width: 200,
  height: 8,
  borderRadius: 4,
  background: `linear-gradient(to right, ${colors.join(', ')})`,
  border: '1px solid rgba(0,0,0,0.06)',
});

const DEFAULT_COLORS = ['#1890ff', '#52c41a', '#fadb14', '#fa8c16', '#f5222d'];

/**
 * GradientLegend：旧 src/aop/component/GradientLegend 的 framework-agnostic 移植。
 * 显示色阶 + 两端数值。color/range 可由 legend.gradientConfig 提供。
 */
export function GradientLegend({ legend, range }: GradientLegendProps): JSX.Element | null {
  if (legend.mode !== 'gradient') return null;
  const cfg = (legend.gradientConfig ?? {}) as { colors?: string[]; range?: [number, number] };
  const colors = cfg.colors && cfg.colors.length >= 2 ? cfg.colors : DEFAULT_COLORS;
  const [min, max] = range ?? cfg.range ?? [0, 100];

  return (
    <div style={containerStyle}>
      <span style={labelStyle}>{min}</span>
      <span style={barStyle(colors)} />
      <span style={labelStyle}>{max}</span>
    </div>
  );
}
