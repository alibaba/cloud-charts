import { Show, type JSX } from 'solid-js';
import { getText, type ChartRuntimeContext } from '@alicloud/cloud-charts-core';

export interface ChartStateOverlayProps {
  state: 'normal' | 'loading' | 'empty' | 'error';
  loadingInfo?: JSX.Element;
  emptyInfo?: JSX.Element;
  errorInfo?: JSX.Element;
  context?: ChartRuntimeContext;
}

const baseStyle: JSX.CSSProperties = {
  position: 'absolute',
  inset: '0',
  display: 'flex',
  'align-items': 'center',
  'justify-content': 'center',
  'pointer-events': 'none',
  'font-size': '12px',
  color: '#888',
  background: 'rgba(255,255,255,0.4)',
};

/** 旧版 src/common/Base.tsx loading/empty/error 占位 DOM 的最小 Solid 替代。 */
export function ChartStateOverlay(props: ChartStateOverlayProps): JSX.Element {
  const text = (key: 'loading' | 'empty' | 'error') =>
    getText(key, { language: props.context?.language, locale: props.context?.locale });

  return (
    <Show when={props.state !== 'normal'}>
      <Show when={props.state === 'loading'}>
        <div style={baseStyle} role="status">
          {props.loadingInfo ?? text('loading')}
        </div>
      </Show>
      <Show when={props.state === 'error'}>
        <div style={{ ...baseStyle, color: '#d4380d' }} role="alert">
          {props.errorInfo ?? text('error')}
        </div>
      </Show>
      <Show when={props.state === 'empty'}>
        <div style={baseStyle} role="status">
          {props.emptyInfo ?? text('empty')}
        </div>
      </Show>
    </Show>
  );
}
