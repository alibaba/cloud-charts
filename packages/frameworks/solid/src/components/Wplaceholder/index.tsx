import { createEffect, onCleanup, Show, type JSX } from 'solid-js';
import {
  createPlaceholderElement,
  type CreatePlaceholderOptions,
  type PlaceholderHandle,
} from '@alicloud/cloud-charts-core';
import { useChartProvider } from '../../provider/index';

export interface WplaceholderProps {
  className?: string;
  style?: JSX.CSSProperties;
  width?: string | number;
  height?: string | number;
  loading?: boolean;
  error?: boolean;
  noData?: boolean;
  empty?: boolean;
  language?: string;
  locale?: CreatePlaceholderOptions['locale'];
  theme?: string;
  children?: JSX.Element;
}

/**
 * Solid 全局占位组件（loading / empty / error / noData）。薄壳：
 * 视觉/i18n/订阅逻辑全部位于 @alicloud/cloud-charts-core 的 createPlaceholderElement，
 * 这里仅负责把 vanilla element 挂到容器，children 走 Solid 子树渲染。
 */
export function Wplaceholder(props: WplaceholderProps): JSX.Element {
  const provider = useChartProvider();
  let host: HTMLDivElement | undefined;
  let handle: PlaceholderHandle | null = null;

  const hasChildren = () => props.children != null && props.children !== false;

  const buildOptions = (): CreatePlaceholderOptions => ({
    loading: props.loading,
    error: props.error,
    noData: props.noData,
    empty: props.empty,
    width: props.width,
    height: props.height,
    className: props.className,
    style: props.style as unknown as Record<string, string | number> | undefined,
    language: props.language ?? provider.locale,
    locale: props.locale,
    theme: props.theme ?? provider.theme,
  });

  createEffect(() => {
    if (hasChildren()) {
      if (handle) {
        handle.destroy();
        handle = null;
      }
      return;
    }
    if (!host) return;
    if (!handle) {
      handle = createPlaceholderElement(buildOptions());
      host.appendChild(handle.el);
    } else {
      handle.update(buildOptions());
    }
  });

  onCleanup(() => {
    if (handle) {
      handle.destroy();
      handle = null;
    }
  });

  const sizeStyle = (): JSX.CSSProperties => ({
    width:
      props.width == null
        ? undefined
        : typeof props.width === 'number'
          ? `${props.width}px`
          : props.width,
    height:
      props.height == null
        ? '100%'
        : typeof props.height === 'number'
          ? `${props.height}px`
          : props.height,
    ...props.style,
  });

  return (
    <Show
      when={hasChildren()}
      fallback={<div ref={host} style={{ display: 'contents' }} />}
    >
      <div
        class={`cloud-charts-wplaceholder widgets-cloud-charts${props.className ? ` ${props.className}` : ''}`}
        style={sizeStyle()}
      >
        <div class="cloud-charts-wplaceholder-children">
          <div class="cloud-charts-wplaceholder-children-text">{props.children}</div>
        </div>
      </div>
    </Show>
  );
}
