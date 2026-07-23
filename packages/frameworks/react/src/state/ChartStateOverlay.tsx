import React from 'react';
import { getText, type ChartRuntimeContext } from '@alicloud/cloud-charts-core';

export interface ChartStateOverlayProps {
  /** 'loading' / 'empty' / 'error'；为 'normal' 时不渲染 */
  state: 'normal' | 'loading' | 'empty' | 'error';
  /** 自定义 React 节点；优先级高于内置文案 */
  loadingInfo?: React.ReactNode;
  emptyInfo?: React.ReactNode;
  errorInfo?: React.ReactNode;
  context?: ChartRuntimeContext;
}

const baseStyle: React.CSSProperties = {
  position: 'absolute',
  inset: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  pointerEvents: 'none',
  fontSize: 12,
  color: '#888',
  background: 'rgba(255,255,255,0.4)',
};

/**
 * 旧版 src/common/Base.tsx loading/empty/error 占位 DOM 的最小 React 替代。
 * loading/empty/error 三态时覆盖在图表容器之上。custom info 节点会替换默认文案。
 */
export function ChartStateOverlay(props: ChartStateOverlayProps): JSX.Element | null {
  const { state, context } = props;
  if (state === 'normal') return null;

  if (state === 'loading') {
    return (
      <div style={baseStyle} role="status" aria-live="polite">
        {props.loadingInfo ?? getText('loading', { language: context?.language, locale: context?.locale })}
      </div>
    );
  }
  if (state === 'error') {
    return (
      <div style={{ ...baseStyle, color: '#d4380d' }} role="alert">
        {props.errorInfo ?? getText('error', { language: context?.language, locale: context?.locale })}
      </div>
    );
  }
  // empty
  return (
    <div style={baseStyle} role="status">
      {props.emptyInfo ?? getText('empty', { language: context?.language, locale: context?.locale })}
    </div>
  );
}
