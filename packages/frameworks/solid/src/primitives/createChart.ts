import { createEffect, onCleanup, type Accessor } from 'solid-js';
import type { ChartSpec, G2RenderTarget, G2SpecRenderer, NativeChartInstance } from '@alicloud/cloud-charts-core';
import { createChart as coreCreateChart } from '@alicloud/cloud-charts-core';
import { g2Renderer as defaultRenderer } from '../renderers/g2Renderer';

export interface CreateChartOptions<TChart extends G2RenderTarget = G2RenderTarget> {
  renderer?: G2SpecRenderer<TChart>;
  event?: Record<string, (...args: unknown[]) => unknown>;
  interaction?: Record<string, unknown>;
  getChartInstance?: (chart: TChart | null) => void;
  chartRef?: { current: TChart | null };
}

/**
 * Solid primitive (equivalent to React's useChart hook).
 * Mounts a chart on first effect, tracks spec changes via fine-grained reactivity,
 * destroys on cleanup, and observes container size with ResizeObserver to call resize().
 */
export function createChartPrimitive<TChart extends G2RenderTarget = G2RenderTarget>(
  container: Accessor<HTMLDivElement | undefined>,
  spec: Accessor<ChartSpec | undefined | null>,
  options?: CreateChartOptions<TChart>,
): Accessor<NativeChartInstance<TChart> | null> {
  let instance: NativeChartInstance<TChart> | null = null;
  let observer: ResizeObserver | null = null;
  let rafId = 0;
  const renderer = options?.renderer ?? (defaultRenderer as unknown as G2SpecRenderer<TChart>);
  const syncExternalChart = () => {
    const chart = instance?.getChartInstance() ?? null;
    if (options?.chartRef) {
      options.chartRef.current = chart;
    }
    options?.getChartInstance?.(chart);
  };

  createEffect(() => {
    const el = container();
    const s = mergeInteraction(spec(), options?.interaction);
    if (!el || !s) return;

    if (!instance) {
      instance = coreCreateChart({
        container: el,
        renderer,
        spec: s,
        event: options?.event,
      });
      instance.render();
      syncExternalChart();
      // ResizeObserver: 仅在 width/height 实际变化时触发，避免 tooltip DOM 增删导致 resize 循环
      let prevW = 0;
      let prevH = 0;
      if (typeof ResizeObserver !== 'undefined') {
        observer = new ResizeObserver((entries) => {
          for (const entry of entries) {
            const w = entry.contentRect.width;
            const h = entry.contentRect.height;
            if (w === prevW && h === prevH) continue;
            prevW = w;
            prevH = h;
            if (rafId) cancelAnimationFrame(rafId);
            rafId = requestAnimationFrame(() => instance?.resize());
          }
        });
        observer.observe(el);
      }
    } else {
      instance.update(s);
    }
  });

  createEffect(() => {
    syncExternalChart();
  });

  onCleanup(() => {
    const chart = instance?.getChartInstance() ?? null;
    if (options?.chartRef?.current === chart) {
      options.chartRef.current = null;
    }
    options?.getChartInstance?.(null);
    if (rafId) cancelAnimationFrame(rafId);
    observer?.disconnect();
    observer = null;
    instance?.destroy();
    instance = null;
  });

  return () => instance;
}

function mergeInteraction(
  spec: ChartSpec | undefined | null,
  interaction: Record<string, unknown> | undefined,
): ChartSpec | undefined | null {
  if (!spec || !interaction) {
    return spec;
  }
  return {
    ...spec,
    interaction: {
      ...(spec.interaction || {}),
      ...interaction,
    },
  };
}
