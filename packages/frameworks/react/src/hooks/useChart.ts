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
  /** 启用 tooltip 锁定：使用 G2 v5 内置 clickLock，pointerdown 切换锁定状态 */
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
    // 仅在 width/height 实际变化时触发，避免 tooltip DOM 增删导致 resize 循环
    let observer: ResizeObserver | null = null;
    let rafId = 0;
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
          rafId = requestAnimationFrame(() => {
            instanceRef.current?.resize();
          });
        }
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

  // tooltip lockable：使用 G2 v5 内置 clickLock，此处仅绘制 lock/unlock icon
  // G2 clickLock 在 pointerdown 时切换 root.tooltipLocked 属性，锁定时 tooltip 不更新/不隐藏
  useEffect(() => {
    if (!options.lockable) return undefined;
    const chart = instanceRef.current?.getChartInstance() as
      | { on?: (n: string, h: (...args: unknown[]) => unknown) => unknown; off?: (n?: string, h?: (...args: unknown[]) => unknown) => unknown }
      | null;
    const container = containerRef.current;
    if (!chart || !container) return undefined;

    const LOCK_ICON_CLASS = 'widgets-tooltip-lock-icon';
    // 旧版 pin/thumbtack 图标
    const LOCK_SVG = '<svg viewBox="0 0 1024 1024" width="12" height="12"><path fill="#999" d="M921.6 391.68l-288-288c-5.12-5.12-11.52-7.68-17.92-7.68s-13.44 2.56-17.92 7.68L497.28 203.52c-5.12 4.48-7.68 11.52-7.68 17.92s2.56 13.44 7.68 17.92l51.84 51.84-241.28 104.32c-3.2 1.28-5.76 3.2-7.68 5.12L202.88 497.92c-10.24 10.24-10.24 26.24 0 36.48l85.76 85.76-185.6 257.92c-8.96 12.8-7.68 30.08 3.2 40.96 6.4 6.4 14.72 9.6 23.04 9.6 6.4 0 12.8-1.92 18.56-5.76l262.4-181.76 81.28 81.28c10.24 10.24 26.24 10.24 36.48 0l96.64-96.64c1.92-1.92 3.84-4.48 5.12-7.68L737.28 480l48 48c5.12 5.12 11.52 7.68 17.92 7.68s13.44-2.56 17.92-7.68L921.6 427.52c5.12-5.12 7.68-11.52 7.68-17.92s-3.2-13.44-7.68-17.92z"/></svg>';
    const UNLOCK_SVG = '<svg viewBox="0 0 1024 1024" width="12" height="12"><path fill="#ccc" d="M920.32 391.68l-288-288c-4.48-5.12-10.88-7.68-17.92-7.68s-13.44 2.56-17.92 7.68L496 203.52c-5.12 5.12-7.68 11.52-7.68 17.92s2.56 13.44 7.68 17.92l51.84 51.84-241.28 104.32c-3.2 1.28-5.76 3.2-7.68 5.12L202.24 497.92c-10.24 10.24-10.24 26.24 0 36.48L288 620.16l-185.6 257.92c-8.96 12.8-7.68 30.08 3.2 40.96 6.4 6.4 14.72 9.6 23.04 9.6 6.4 0 12.8-1.92 18.56-5.76l262.4-181.76 81.28 81.28c10.24 10.24 26.24 10.24 36.48 0l96.64-96.64c1.92-1.92 3.84-4.48 5.12-7.68L736 480l48 48c5.12 5.12 11.52 7.68 17.92 7.68s13.44-2.56 17.92-7.68l100.48-100.48c5.12-5.12 7.68-11.52 7.68-17.92s-2.56-13.44-7.68-17.92z m-117.12 63.36l-51.84-51.84c-5.76-5.76-13.44-7.68-21.12-6.4-7.68 1.28-14.08 6.4-17.28 13.44l-135.04 270.08L508.8 748.8l-72.96-72.96c-8.32-8.32-21.12-9.6-30.72-2.56l-239.36 183.68 188.16-234.24c7.04-9.6 5.76-22.4-2.56-30.72l-76.8-76.8 68.48-68.48 273.92-131.2c7.04-3.2 12.16-9.6 14.08-17.28 1.28-7.68-1.28-16-6.4-21.12l-55.68-55.68 45.44-45.44L848 409.6l-44.8 45.44z"/></svg>';

    let isLocked = false;

    const createLockIcon = (): HTMLElement => {
      const icon = document.createElement('div');
      icon.className = LOCK_ICON_CLASS;
      icon.style.cssText = 'cursor:pointer;line-height:0;flex-shrink:0;margin-left:8px;pointer-events:auto;';
      icon.innerHTML = isLocked ? LOCK_SVG : UNLOCK_SVG;
      icon.addEventListener('click', (e) => {
        e.stopPropagation();
        // 切换 G2 内置锁定状态：在 canvas 上触发 pointerdown
        const canvas = container.querySelector('canvas');
        if (canvas) {
          const rect = canvas.getBoundingClientRect();
          canvas.dispatchEvent(new PointerEvent('pointerdown', {
            bubbles: true,
            clientX: rect.left + rect.width / 2,
            clientY: rect.top + rect.height / 2,
          }));
        }
      });
      return icon;
    };

    const findTooltipEl = (): HTMLElement | null =>
      container.querySelector('.g2-tooltip') as HTMLElement | null;

    const drawLockElement = () => {
      const el = findTooltipEl();
      if (!el) return;
      // 将 lock icon 插入 .g2-tooltip-title（与 title 同行居右，在 padding 内）
      let titleEl = el.querySelector('.g2-tooltip-title') as HTMLElement | null;
      if (titleEl) {
        titleEl.style.display = 'flex';
        titleEl.style.alignItems = 'center';
        titleEl.style.justifyContent = 'space-between';
      } else {
        // 无 title 元素时创建 header row
        titleEl = document.createElement('div');
        titleEl.style.display = 'flex';
        titleEl.style.justifyContent = 'flex-end';
        titleEl.style.alignItems = 'center';
        el.insertBefore(titleEl, el.firstChild);
      }
      // 移除旧 icon
      const oldIcon = titleEl.querySelector(`.${LOCK_ICON_CLASS}`);
      if (oldIcon) oldIcon.remove();
      // 添加新 icon
      titleEl.appendChild(createLockIcon());
    };

    // tooltip:show 时绘制 lock icon（G2 v5 可能不触发 tooltip:show，用 MutationObserver 兼底）
    const onTooltipShow = () => {
      requestAnimationFrame(() => drawLockElement());
    };

    // MutationObserver: 检测 .g2-tooltip 可见性变化，绘制 lock icon
    const tooltipObserver = new MutationObserver(() => {
      const el = findTooltipEl();
      if (el && getComputedStyle(el).visibility === 'visible') {
        const existing = el.querySelector(`.${LOCK_ICON_CLASS}`);
        if (!existing) drawLockElement();
      }
    });
    tooltipObserver.observe(container, { childList: true, subtree: true, attributes: true, attributeFilter: ['style', 'class'] });

    // 监听 canvas pointerdown 同步 isLocked 状态（G2 clickLock 在 pointerdown 时切换）
    const canvas = container.querySelector('canvas');
    const onPointerDown = () => {
      isLocked = !isLocked;
      requestAnimationFrame(() => drawLockElement());
    };

    chart.on?.('tooltip:show', onTooltipShow);
    if (canvas) canvas.addEventListener('pointerdown', onPointerDown);

    return () => {
      chart.off?.('tooltip:show', onTooltipShow);
      tooltipObserver.disconnect();
      if (canvas) canvas.removeEventListener('pointerdown', onPointerDown);
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
