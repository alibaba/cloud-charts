import { useEffect, useRef, type RefObject } from 'react';

export interface UseResizeOptions {
  /** 节流策略：debounce 一次性触发；raf 每帧最多一次。缺省 raf */
  strategy?: 'raf' | 'debounce';
  /** debounce 模式下的延迟（ms），默认 100 */
  debounceMs?: number;
}

/**
 * useResize：监听 ref 容器尺寸变化，触发回调。
 * 基于 ResizeObserver；不可用时降级为 window.resize（仅触发一次/帧）。
 *
 * @example
 *   const ref = useRef<HTMLDivElement>(null);
 *   useResize(ref, () => chart.resize());
 */
export function useResize<T extends HTMLElement>(
  ref: RefObject<T>,
  onResize: (width: number, height: number) => void,
  options: UseResizeOptions = {},
): void {
  const onResizeRef = useRef(onResize);
  onResizeRef.current = onResize;

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const strategy = options.strategy ?? 'raf';
    const debounceMs = options.debounceMs ?? 100;

    let rafId = 0;
    let timer: number | undefined;
    const trigger = (w: number, h: number) => {
      if (strategy === 'raf') {
        if (rafId) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(() => onResizeRef.current(w, h));
      } else {
        if (timer) window.clearTimeout(timer);
        timer = window.setTimeout(() => onResizeRef.current(w, h), debounceMs);
      }
    };

    if (typeof ResizeObserver !== 'undefined') {
      const observer = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const { width, height } = entry.contentRect;
          trigger(width, height);
        }
      });
      observer.observe(el);
      return () => {
        if (rafId) cancelAnimationFrame(rafId);
        if (timer) window.clearTimeout(timer);
        observer.disconnect();
      };
    }

    // 降级：window.resize
    const handler = () => {
      const rect = el.getBoundingClientRect();
      trigger(rect.width, rect.height);
    };
    window.addEventListener('resize', handler);
    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      if (timer) window.clearTimeout(timer);
      window.removeEventListener('resize', handler);
    };
  }, [ref, options.strategy, options.debounceMs]);
}
