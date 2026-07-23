import React, { useEffect, useLayoutEffect, useRef } from 'react';
import {
  createPlaceholderElement,
  type CreatePlaceholderOptions,
  type PlaceholderHandle,
} from '@alicloud/cloud-charts-core';
import { useChartProvider } from '../../provider/index';

export interface WplaceholderProps {
  className?: string;
  style?: React.CSSProperties;
  width?: string | number;
  height?: string | number;
  loading?: boolean;
  error?: boolean;
  noData?: boolean;
  empty?: boolean;
  language?: string;
  locale?: CreatePlaceholderOptions['locale'];
  theme?: string;
  children?: React.ReactNode;
}

const useIsoLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

/**
 * 全局占位组件（loading / empty / error / noData）。
 *
 * 实现策略：薄壳。视觉/i18n/订阅逻辑都在 cloud-core 的 createPlaceholderElement 里，
 * 这里只把 vanilla element 挂载到容器 div；当存在 React children 时改走 React 子树渲染，
 * 让 Vue/Solid/Angular 也能复用同一份 core 实现。
 */
export function Wplaceholder(props: WplaceholderProps): JSX.Element {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const handleRef = useRef<PlaceholderHandle | null>(null);
  const provider = useChartProvider();

  const language = props.language ?? provider.locale;
  const theme = props.theme ?? provider.theme;
  const hasReactChildren = props.children != null && props.children !== false;

  useIsoLayoutEffect(() => {
    if (hasReactChildren) return undefined;
    const host = containerRef.current;
    if (!host) return undefined;
    const handle = createPlaceholderElement({
      loading: props.loading,
      error: props.error,
      noData: props.noData,
      empty: props.empty,
      width: props.width,
      height: props.height,
      className: props.className,
      style: props.style as Record<string, string | number> | undefined,
      language,
      locale: props.locale,
      theme,
    });
    handleRef.current = handle;
    host.appendChild(handle.el);
    return () => {
      handle.destroy();
      handleRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasReactChildren]);

  useIsoLayoutEffect(() => {
    const handle = handleRef.current;
    if (!handle) return;
    handle.update({
      loading: props.loading,
      error: props.error,
      noData: props.noData,
      empty: props.empty,
      width: props.width,
      height: props.height,
      className: props.className,
      style: props.style as Record<string, string | number> | undefined,
      language,
      locale: props.locale,
      theme,
    });
  }, [
    props.loading,
    props.error,
    props.noData,
    props.empty,
    props.width,
    props.height,
    props.className,
    props.style,
    props.locale,
    language,
    theme,
  ]);

  if (hasReactChildren) {
    const sizeStyle: React.CSSProperties = {
      width: toCssSize(props.width),
      height: toCssSize(props.height ?? '100%'),
      ...props.style,
    };
    return (
      <div
        className={`cloud-charts-wplaceholder widgets-cloud-charts${props.className ? ` ${props.className}` : ''}`}
        style={sizeStyle}
      >
        <div className="cloud-charts-wplaceholder-children">
          <div className="cloud-charts-wplaceholder-children-text">{props.children}</div>
        </div>
      </div>
    );
  }

  return <div ref={containerRef} style={{ display: 'contents' }} />;
}

function toCssSize(v: string | number | undefined): string | number | undefined {
  if (v == null || v === '') return undefined;
  if (typeof v === 'number') return v;
  return /^\d+$/.test(v) ? Number(v) : v;
}

export default Wplaceholder;
