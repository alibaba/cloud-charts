import React, { useEffect, useRef, useState } from 'react';
import { render as reactRender, unmountComponentAtNode } from 'react-dom';
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
 * 2. 监听 chart 'tooltip:show' / 'tooltip:hide' 事件，使用 react-dom render 渲染
 * 3. IntersectionObserver 监听 chartContainer 离开视口时自动隐藏
 * 4. 视口边界碰撞检测：tooltip 不溢出 viewport
 * 5. lockable: plot:click 切换锁定；锁定时 pointerEvents:auto、显示锁定图标、滚动跟随
 *
 * 注意：兼容 React 17+（使用 react-dom 的 render 方法）。
 */
export function useCustomTooltip(
  chartContainer: HTMLElement | null,
  chart: ChartLike | null,
  tooltipModel: Pick<TooltipModel, 'customTooltip' | 'reactContent' | 'dodge' | 'lockable' | 'columns'> | undefined,
): void {
  const portalRef = useRef<HTMLDivElement | null>(null);
  const rootRef = useRef<{ render: (n: unknown) => void; unmount: () => void } | null>(null);
  const [locked, setLocked] = useState(false);
  const lockedRef = useRef(false);
  const lastDataRef = useRef<{ title: string; items: FreeTooltipItem[] } | null>(null);
  const startRectRef = useRef<DOMRect | null>(null);
  const startPosRef = useRef<{ x: number; y: number } | null>(null);
  const mousePosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Keep lockedRef in sync
  useEffect(() => { lockedRef.current = locked; }, [locked]);

  useEffect(() => {
    const enabled = Boolean(tooltipModel?.customTooltip || tooltipModel?.reactContent);
    if (!enabled || !chart || !chartContainer) return undefined;

    // 兼容 React 17 (render) 和 React 18 (createRoot)
    // 使用 react-dom 的 render 方法，在 React 18 中有 deprecation warning 但仍可用
    const renderToPortal = (node: React.ReactNode) => {
      reactRender(node, portal);
    };

    const lockable = Boolean(tooltipModel?.lockable);

    const portal = document.createElement('div');
    portal.style.position = 'fixed';
    portal.style.zIndex = '1001';
    portal.style.pointerEvents = 'none';
    portal.style.visibility = 'hidden';
    document.body.appendChild(portal);
    portalRef.current = portal;
    const root = { render: renderToPortal, unmount: () => unmountComponentAtNode(portal) };
    rootRef.current = root;

    const renderContent = (title: string, items: FreeTooltipItem[]) => {
      lastDataRef.current = { title, items };
      const userFn: unknown = tooltipModel?.customTooltip ?? tooltipModel?.reactContent;
      if (typeof userFn === 'function') {
        const node = (userFn as CustomTooltipFn)(title, items);
        reactRender(node as React.ReactElement, portal);
      } else {
        reactRender(
          <FreeTooltip
            title={title}
            data={items}
            dodge={tooltipModel?.dodge}
            locked={lockable ? lockedRef.current : undefined}
            onLockToggle={lockable ? toggleLock : undefined}
            columns={tooltipModel?.columns as number | undefined}
          />,
          portal,
        );
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
      // G2 v5 的 tooltip:show 事件不包含 clientX/clientY（Object.assign 不拷贝原型属性）
      // 使用 pointermove 追踪的鼠标位置
      requestAnimationFrame(() => positionAt(mousePosRef.current.x, mousePosRef.current.y));
    };
    const onHide = () => {
      portal.style.visibility = 'hidden';
    };

    // ── Tooltip lock/unlock ──────────────────────────────────────────
    const doLock = () => {
      portal.style.pointerEvents = 'auto';
      startRectRef.current = chartContainer.getBoundingClientRect();
      startPosRef.current = {
        x: parseFloat(portal.style.left) || 0,
        y: parseFloat(portal.style.top) || 0,
      };
      // Re-render with locked=true
      if (lastDataRef.current) {
        renderContent(lastDataRef.current.title, lastDataRef.current.items);
      }
    };

    const doUnlock = () => {
      portal.style.pointerEvents = 'none';
      startRectRef.current = null;
      startPosRef.current = null;
      // Re-render with locked=false
      if (lastDataRef.current) {
        renderContent(lastDataRef.current.title, lastDataRef.current.items);
      }
    };

    const toggleLock = () => {
      const newLocked = !lockedRef.current;
      lockedRef.current = newLocked;
      setLocked(newLocked);
      if (newLocked) {
        doLock();
      } else {
        doUnlock();
      }
    };

    const unlockAndHide = () => {
      if (lockedRef.current) {
        setLocked(false);
        doUnlock();
      }
      onHide();
    };

    // Scroll follow: update tooltip position when chart container scrolls
    let scrollTimer: ReturnType<typeof setTimeout> | null = null;
    const handleScroll = () => {
      if (!lockedRef.current || !startRectRef.current || !startPosRef.current) return;
      if (scrollTimer) clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
        const currentRect = chartContainer.getBoundingClientRect();
        const offsetX = currentRect.x - startRectRef.current.x;
        const offsetY = currentRect.y - startRectRef.current.y;
        portal.style.left = `${startPosRef.current.x + offsetX}px`;
        portal.style.top = `${startPosRef.current.y + offsetY}px`;
        scrollTimer = null;
      }, 50);
    };

    // Register events
    chart.on?.('tooltip:show', onShow);
    chart.on?.('tooltip:hide', onHide);
    // 追踪鼠标位置：G2 v5 tooltip:show 事件不包含 clientX/clientY
    const onPointerMove = (ev: PointerEvent) => {
      mousePosRef.current = { x: ev.clientX, y: ev.clientY };
    };
    chartContainer.addEventListener('pointermove', onPointerMove);
    if (lockable) {
      chart.on?.('plot:click', toggleLock);
      chart.on?.('beforechangesize', unlockAndHide);
      window.addEventListener('resize', unlockAndHide);
      window.addEventListener('scroll', handleScroll, true);
    }

    let observer: IntersectionObserver | null = null;
    if (typeof IntersectionObserver !== 'undefined') {
      observer = new IntersectionObserver((entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) unlockAndHide();
        }
      });
      observer.observe(chartContainer);
    }

    return () => {
      chart.off?.('tooltip:show', onShow);
      chart.off?.('tooltip:hide', onHide);
      chartContainer.removeEventListener('pointermove', onPointerMove);
      if (lockable) {
        chart.off?.('plot:click', toggleLock);
        chart.off?.('beforechangesize', unlockAndHide);
        window.removeEventListener('resize', unlockAndHide);
        window.removeEventListener('scroll', handleScroll, true);
      }
      if (scrollTimer) clearTimeout(scrollTimer);
      observer?.disconnect();
      try {
        unmountComponentAtNode(portal);
      } catch (_e) {
        /* noop */
      }
      portal.remove();
      rootRef.current = null;
      portalRef.current = null;
    };
  }, [chart, chartContainer, tooltipModel?.customTooltip, tooltipModel?.reactContent, tooltipModel?.dodge, tooltipModel?.lockable]);
}
