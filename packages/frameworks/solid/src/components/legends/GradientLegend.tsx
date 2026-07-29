import { For, type JSX } from 'solid-js';
import {
  highlightChartByValue,
  clearChartHighlight,
  type LegendModel,
} from '@alicloud/cloud-charts-core';

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

const containerStyle: JSX.CSSProperties = {
  'font-size': '12px',
  color: '#333',
  'margin-top': '8px',
  display: 'flex',
  'align-items': 'center',
  gap: '8px',
};
const labelStyle: JSX.CSSProperties = { color: '#888' };
const colorBlockStyle = (color: string): JSX.CSSProperties => ({
  width: '50px',
  height: '20px',
  background: color,
  cursor: 'pointer',
});

const DEFAULT_COLORS = [
  { type: 'green', color: '#52c41a' },
  { type: 'yellow', color: '#fadb14' },
  { type: 'orange', color: '#fa8c16' },
  { type: 'red', color: '#f5222d' },
];

/**
 * GradientLegend：旧 src/aop/component/GradientLegend 的 Solid 移植。
 * 显示色阶 + 两端数值。支持 hover 高亮对应类型数据。
 */
export function GradientLegend(props: GradientLegendProps): JSX.Element | null {
  if (props.legend.mode !== 'gradient') return null;

  const cfg = (props.legend.gradientConfig ?? {}) as {
    colors?: Array<{ type: string; color: string }> | string[];
    range?: [number, number];
  };

  // Normalize colors: accept both [{type, color}] and ['color1', 'color2'] formats
  const colors = (): Array<{ type: string; color: string }> => {
    const raw = cfg.colors;
    if (Array.isArray(raw) && raw.length >= 2) {
      if (typeof raw[0] === 'string') {
        return (raw as string[]).map((color, i) => ({ type: `color-${i}`, color }));
      }
      return raw as Array<{ type: string; color: string }>;
    }
    return DEFAULT_COLORS;
  };

  const range = (): [number, number] => props.range ?? cfg.range ?? [0, 100];
  const legendField = (): string => props.legendField || 'color';
  const hoverable = (): boolean => props.hoverable ?? props.legend.hoverable ?? true;

  const onHover = (type: string) => {
    if (!hoverable() || !props.chart) return;
    highlightChartByValue(props.chart, legendField(), type);
  };

  const onLeave = () => {
    if (!hoverable() || !props.chart) return;
    clearChartHighlight(props.chart);
  };

  const [min, max] = range();

  return (
    <div style={containerStyle}>
      <span style={labelStyle}>{min}</span>
      <div style={{ display: 'flex', gap: '1px' }}>
        <For each={colors()}>
          {({ type, color }) => (
            <div
              style={colorBlockStyle(color)}
              onMouseEnter={() => onHover(type)}
              onMouseLeave={onLeave}
            />
          )}
        </For>
      </div>
      <span style={labelStyle}>{max}</span>
    </div>
  );
}
