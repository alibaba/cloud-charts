import { useEffect, useMemo, useRef } from 'react';
import type React from 'react';
import type { ChartSpec, ChartRenderState } from '@alicloud/cloud-charts-core';
import type { G2SpecRenderer, G2RenderTarget } from '@alicloud/cloud-charts-core';
import { createChart, type NativeChartInstance } from '@alicloud/cloud-charts-core';
import { g2Renderer as defaultRenderer } from '../renderers/g2Renderer';

export interface UseChartOptions<TChart extends G2RenderTarget = G2RenderTarget> {
  spec: ChartSpec | undefined | null;
  renderer?: G2SpecRenderer<TChart>;
  event?: Record<string, (...args: unknown[]) => unknown>;
  interaction?: Record<string, unknown>;
  getChartInstance?: (chart: TChart | null) => void;
  chartRef?: React.MutableRefObject<TChart | null>;
  /** 由 caller 从 ChartModel.state 传入，hook 仅原样返回供 overlay 使用 */
  state?: ChartRenderState;
  /** 启用 tooltip 锁定：plot:click 切换；beforechangesize / window.resize 自动 unlock */
  lockable?: boolean;
}

export interface UseChartResult<TChart extends G2RenderTarget = G2RenderTarget> {
  containerRef: React.RefObject<HTMLDivElement>;
  getChartInstance: () => TChart | null;
  /** 当前渲染状态：normal / loading / empty / error，由 caller 注入。 */
  state: ChartRenderState;
}

/**
 * 通用 Hook：将 ChartSpec 绑定到 div ref，依赖 core 的 native 控制器完成 create/update/destroy。
 * spec 引用变化触发 update；event 变化触发 off+on 重绑；ResizeObserver 监听容器尺寸变化触发 resize；卸载触发 destroy。
 */
export function useChart<TChart extends G2RenderTarget = G2RenderTarget>(
  options: UseChartOptions<TChart>,
): UseChartResult<TChart> {
  const containerRef = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<NativeChartInstance<TChart> | null>(null);
  const renderer = (options.renderer ?? (defaultRenderer as unknown as G2SpecRenderer<TChart>));
  const event = options.event;
  const eventRef = useRef(event);
  const rendererRef = useRef(renderer);

  const rawSpec = options.spec;
  const interaction = options.interaction;
  const spec = useMemo(() => mergeInteraction(rawSpec, interaction), [rawSpec, interaction]);
  const initialSpecRef = useRef<ChartSpec | null>(spec ?? null);

  useEffect(() => {
    if (!containerRef.current || !initialSpecRef.current) {
      return undefined;
    }
    const container = containerRef.current;
    const instance = createChart<TChart>({
      container,
      renderer: rendererRef.current,
      spec: initialSpecRef.current,
      event: eventRef.current,
    });
    instance.render();
    instanceRef.current = instance;

    // ResizeObserver: 容器尺寸变化时调用 resize（autoFit 兜底，不依赖 G2 内部 forceFit）
    let observer: ResizeObserver | null = null;
    let rafId = 0;
    if (typeof ResizeObserver !== 'undefined') {
      observer = new ResizeObserver(() => {
        if (rafId) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(() => {
          instanceRef.current?.resize();
        });
      });
      observer.observe(container);
    }

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      observer?.disconnect();
      instance.destroy();
      instanceRef.current = null;
    };
    // 仅初始化执行
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const chart = instanceRef.current?.getChartInstance() ?? null;
    options.chartRef && (options.chartRef.current = chart);
    options.getChartInstance?.(chart);
    return () => {
      if (options.chartRef?.current === chart) {
        options.chartRef.current = null;
      }
      options.getChartInstance?.(null);
    };
  }, [options.chartRef, options.getChartInstance]);

  const prevSpecRef = useRef<ChartSpec | null>(spec ?? null);

  useEffect(() => {
    const instance = instanceRef.current;
    if (!instance || !spec) {
      return;
    }
    const prev = prevSpecRef.current;
    // 检测仅 data 变化：除 data 之外其它顶层字段引用全等 → 走 changeData 智能 diff
    const isOnlyDataChange = prev !== null
      && prev !== spec
      && prev.data !== spec.data
      && shallowEqualExcept(prev as unknown as Record<string, unknown>, spec as unknown as Record<string, unknown>, 'data');
    if (isOnlyDataChange) {
      instance.changeData(spec.data);
    } else {
      instance.update(spec);
    }
    prevSpecRef.current = spec;
  }, [spec]);

  // event prop 变化时 off 旧 handler + on 新 handler；保持 ref 同步以供 destroy 时解绑
  useEffect(() => {
    const chart = instanceRef.current?.getChartInstance() as
      | { on?: (n: string, h: (...args: unknown[]) => unknown) => unknown; off?: (n?: string, h?: (...args: unknown[]) => unknown) => unknown }
      | null;
    if (!chart) return undefined;

    const prev = eventRef.current;
    if (prev) {
      Object.entries(prev).forEach(([name, handler]) => chart.off?.(name, handler));
    }
    if (event) {
      Object.entries(event).forEach(([name, handler]) => chart.on?.(name, handler));
    }
    eventRef.current = event;
    return undefined;
  }, [event]);

  // tooltip lockable：旧 src/aop/controller/tooltip.tsx 行为
  // plot:click 切换 lock；beforechangesize / window.resize 自动 unlock
  useEffect(() => {
    if (!options.lockable) return undefined;
    const chart = instanceRef.current?.getChartInstance() as
      | { on?: (n: string, h: (...args: unknown[]) => unknown) => unknown; off?: (n?: string, h?: (...args: unknown[]) => unknown) => unknown }
      | null;
    const container = containerRef.current;
    if (!chart || !container) return undefined;

    const findTooltipEl = (): HTMLElement | null =>
      container.querySelector('.g2-tooltip') as HTMLElement | null;

    const setLocked = (locked: boolean) => {
      const el = findTooltipEl();
      if (!el) return;
      el.dataset.locked = locked ? 'true' : 'false';
      el.style.pointerEvents = locked ? 'auto' : 'none';
    };
    const unlock = () => setLocked(false);
    const togglePlotClick = () => {
      const el = findTooltipEl();
      const next = el?.dataset.locked === 'true' ? false : true;
      setLocked(next);
    };

    chart.on?.('plot:click', togglePlotClick);
    chart.on?.('beforechangesize', unlock);
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', unlock);
    }
    return () => {
      chart.off?.('plot:click', togglePlotClick);
      chart.off?.('beforechangesize', unlock);
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', unlock);
      }
    };
  }, [options.lockable]);

  const getChartInstance = useMemo(
    () => () => instanceRef.current?.getChartInstance() ?? null,
    [],
  );

  return { containerRef, getChartInstance, state: options.state ?? 'normal' };
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

/** 顶层浅比对，忽略指定字段。其它所有 key 必须引用相等。 */
function shallowEqualExcept(a: Record<string, unknown>, b: Record<string, unknown>, except: string): boolean {
  const aKeys = Object.keys(a).filter((k) => k !== except);
  const bKeys = Object.keys(b).filter((k) => k !== except);
  if (aKeys.length !== bKeys.length) return false;
  for (const k of aKeys) {
    if (a[k] !== b[k]) return false;
  }
  return true;
}
