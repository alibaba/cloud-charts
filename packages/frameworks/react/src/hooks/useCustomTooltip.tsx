import React, { useEffect, useRef } from 'react';
import type { TooltipModel } from '@alicloud/cloud-charts-core';
import { FreeTooltip, type FreeTooltipItem } from '../components/FreeTooltip/index';

type CustomTooltipFn = (title: string, items: FreeTooltipItem[]) => unknown;

interface ChartLike {
  on?: (eventName: string, handler: (...args: unknown[]) => unknown) => unknown;
  off?: (eventName?: string, handler?: (...args: unknown[]) => unknown) => unknown;
}

/**
 * useCustomTooltip：旧 src/aop/controller/tooltip.tsx 的 framework-agnostic 移植。
 *
 * 当 model.customTooltip 或 model.reactContent 启用时：
 * 1. 在 document.body 创建 position:fixed 容器
 * 2. 监听 chart 'tooltip:show' / 'tooltip:hide' 事件，使用 React 18 createRoot 渲染
 * 3. IntersectionObserver 监听 chartContainer 离开视口时自动隐藏
 * 4. 视口边界碰撞检测：tooltip 不溢出 viewport
 *
 * 注意：本 hook 仅在 React 18+ 可用（依赖 react-dom/client.createRoot）。
 */
export function useCustomTooltip(
  chartContainer: HTMLElement | null,
  chart: ChartLike | null,
  tooltipModel: Pick<TooltipModel, 'customTooltip' | 'reactContent' | 'dodge'> | undefined,
): void {
  const portalRef = useRef<HTMLDivElement | null>(null);
  const rootRef = useRef<{ render: (n: unknown) => void; unmount: () => void } | null>(null);

  useEffect(() => {
    const enabled = Boolean(tooltipModel?.customTooltip || tooltipModel?.reactContent);
    if (!enabled || !chart || !chartContainer) return undefined;

    // React 18+ 才有 react-dom/client.createRoot；本包 peer react>=18，直接静态 import
    let createRoot: ((c: Element) => { render: (n: unknown) => void; unmount: () => void }) | null = null;
    try {
      // 用 Function('return import...') 规避 ts-strict 静态分析；
      // 实际上 react>=17 都能 require 到 react-dom，client 子模块仅 18+ 存在
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const reactDomClient = (globalThis as any).__reactDomClient__
        // eslint-disable-next-line @typescript-eslint/no-explicit-any, no-eval
        ?? ((0, eval) as any)('require')('react-dom/client');
      createRoot = reactDomClient.createRoot;
    } catch (_e) {
      // React 17 fallback：放弃自定义渲染（与文档一致：customTooltip 需要 React 18+）
      return undefined;
    }
    if (!createRoot) return undefined;

    const portal = document.createElement('div');
    portal.style.position = 'fixed';
    portal.style.zIndex = '1001';
    portal.style.pointerEvents = 'none';
    portal.style.visibility = 'hidden';
    document.body.appendChild(portal);
    portalRef.current = portal;
    const root = createRoot(portal);
    rootRef.current = root;

    const renderContent = (title: string, items: FreeTooltipItem[]) => {
      const userFn: unknown = tooltipModel?.customTooltip ?? tooltipModel?.reactContent;
      if (typeof userFn === 'function') {
        const node = (userFn as CustomTooltipFn)(title, items);
        root.render(node as never);
      } else {
        root.render(<FreeTooltip title={title} data={items} dodge={tooltipModel?.dodge} /> as never);
      }
    };

    const positionAt = (x: number, y: number) => {
      const portalRect = portal.getBoundingClientRect();
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      let left = x + 12;
      let top = y + 12;
      if (left + portalRect.width > vw) left = vw - portalRect.width - 8;
      if (top + portalRect.height > vh) top = vh - portalRect.height - 8;
      portal.style.left = `${Math.max(0, left)}px`;
      portal.style.top = `${Math.max(0, top)}px`;
    };

    const onShow = (...args: unknown[]) => {
      const e = (args[0] ?? {}) as {
        data?: { items?: Array<{ name: string; value: unknown; color?: string; dodge?: unknown; data?: { dodge?: unknown; facet?: unknown } }>; title?: string };
        clientX?: number;
        clientY?: number;
      };
      const items = (e?.data?.items ?? []).map((it) => {
        const name = String(it.name ?? '');
        const dodge = it.dodge ?? it.data?.dodge ?? it.data?.facet;
        return {
          name: name.startsWith('undefined-name-') ? '' : name,
          value: it.value as number | string,
          color: it.color,
          dodge: dodge === undefined ? undefined : String(dodge),
        };
      });
      const title = String(e?.data?.title ?? '');
      renderContent(title, items);
      portal.style.visibility = 'visible';
      requestAnimationFrame(() => positionAt(e?.clientX ?? 0, e?.clientY ?? 0));
    };
    const onHide = () => {
      portal.style.visibility = 'hidden';
    };

    chart.on?.('tooltip:show', onShow);
    chart.on?.('tooltip:hide', onHide);

    let observer: IntersectionObserver | null = null;
    if (typeof IntersectionObserver !== 'undefined') {
      observer = new IntersectionObserver((entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) onHide();
        }
      });
      observer.observe(chartContainer);
    }

    return () => {
      chart.off?.('tooltip:show', onShow);
      chart.off?.('tooltip:hide', onHide);
      observer?.disconnect();
      try {
        root.unmount();
      } catch (_e) {
        /* noop */
      }
      portal.remove();
      rootRef.current = null;
      portalRef.current = null;
    };
  }, [chart, chartContainer, tooltipModel?.customTooltip, tooltipModel?.reactContent, tooltipModel?.dodge]);
}
