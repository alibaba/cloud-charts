import { createEffect, createSignal, onCleanup, type Accessor, type JSX } from 'solid-js';
import { render } from 'solid-js/web';
import type { TooltipModel, G2RenderTarget } from '@alicloud/cloud-charts-core';
import { FreeTooltip, type FreeTooltipItem } from '../components/FreeTooltip/index';

type CustomTooltipFn = (title: string, items: FreeTooltipItem[]) => JSX.Element;

export function useCustomTooltip<TChart extends G2RenderTarget>(
  chartContainer: Accessor<HTMLElement | undefined | null>,
  chart: Accessor<TChart | undefined | null>,
  tooltipModel: Accessor<Pick<TooltipModel, 'customTooltip' | 'reactContent' | 'dodge' | 'lockable' | 'columns'> | undefined>,
): void {
  createEffect(() => {
    const enabled = Boolean(tooltipModel()?.customTooltip || tooltipModel()?.reactContent);
    const targetChart = chart();
    const targetContainer = chartContainer();
    if (!enabled || !targetChart || !targetContainer || typeof document === 'undefined') return;

    const lockable = Boolean(tooltipModel()?.lockable);

    const portal = document.createElement('div');
    portal.style.position = 'fixed';
    portal.style.zIndex = '1001';
    portal.style.pointerEvents = 'none';
    portal.style.visibility = 'hidden';
    document.body.appendChild(portal);

    const [locked, setLocked] = createSignal(false);
    const [tooltipData, setTooltipData] = createSignal<{ title: string; items: FreeTooltipItem[] } | null>(null);
    const startRect: { value: DOMRect | null } = { value: null };
    const startPos: { value: { x: number; y: number } | null } = { value: null };
    const mousePos: { value: { x: number; y: number } } = { value: { x: 0, y: 0 } };

    const dispose = render(() => {
      const data = tooltipData();
      if (!data) return null;
      const userFn: unknown = tooltipModel()?.customTooltip ?? tooltipModel()?.reactContent;
      if (typeof userFn === 'function') {
        return (userFn as CustomTooltipFn)(data.title, data.items);
      }
      return (
        <FreeTooltip
          title={data.title}
          data={data.items}
          dodge={tooltipModel()?.dodge}
          locked={lockable ? locked() : undefined}
          onLockToggle={lockable ? () => toggleLock() : undefined}
          columns={tooltipModel()?.columns as number | undefined}
        />
      );
    }, portal);

    const renderContent = (title: string, items: FreeTooltipItem[]) => {
      setTooltipData({ title, items });
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
      const items = (e.data?.items ?? []).map((it) => {
        const name = String(it.name ?? '');
        const dodge = it.dodge ?? it.data?.dodge ?? it.data?.facet;
        return {
          name: name.startsWith('undefined-name-') ? '' : name,
          value: it.value as number | string,
          color: it.color,
          dodge: dodge === undefined ? undefined : String(dodge),
        };
      });
      renderContent(String(e.data?.title ?? ''), items);
      portal.style.visibility = 'visible';
      // G2 v5 的 tooltip:show 事件不包含 clientX/clientY（Object.assign 不拷贝原型属性）
      // 使用 pointermove 追踪的鼠标位置
      requestAnimationFrame(() => positionAt(mousePos.value.x, mousePos.value.y));
    };
    const onHide = () => {
      portal.style.visibility = 'hidden';
    };

    // ── Tooltip lock/unlock ──────────────────────────────────────────
    const doLock = () => {
      portal.style.pointerEvents = 'auto';
      startRect.value = targetContainer.getBoundingClientRect();
      startPos.value = {
        x: parseFloat(portal.style.left) || 0,
        y: parseFloat(portal.style.top) || 0,
      };
    };

    const doUnlock = () => {
      portal.style.pointerEvents = 'none';
      startRect.value = null;
      startPos.value = null;
    };

    const toggleLock = () => {
      const newLocked = !locked();
      setLocked(newLocked);
      if (newLocked) {
        doLock();
      } else {
        doUnlock();
      }
    };

    const unlockAndHide = () => {
      if (locked()) {
        setLocked(false);
        doUnlock();
      }
      onHide();
    };

    // Scroll follow: update tooltip position when chart container scrolls
    let scrollTimer: ReturnType<typeof setTimeout> | null = null;
    const handleScroll = () => {
      if (!locked() || !startRect.value || !startPos.value) return;
      if (scrollTimer) clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
        const currentRect = targetContainer.getBoundingClientRect();
        const offsetX = currentRect.x - startRect.value.x;
        const offsetY = currentRect.y - startRect.value.y;
        portal.style.left = `${startPos.value.x + offsetX}px`;
        portal.style.top = `${startPos.value.y + offsetY}px`;
        scrollTimer = null;
      }, 50);
    };

    targetChart.on?.('tooltip:show', onShow);
    targetChart.on?.('tooltip:hide', onHide);
    // 追踪鼠标位置：G2 v5 tooltip:show 事件不包含 clientX/clientY
    const onPointerMove = (ev: PointerEvent) => {
      mousePos.value = { x: ev.clientX, y: ev.clientY };
    };
    targetContainer.addEventListener('pointermove', onPointerMove);
    if (lockable) {
      targetChart.on?.('plot:click', toggleLock);
      targetChart.on?.('beforechangesize', unlockAndHide);
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
      observer.observe(targetContainer);
    }

    onCleanup(() => {
      targetChart.off?.('tooltip:show', onShow);
      targetChart.off?.('tooltip:hide', onHide);
      targetContainer.removeEventListener('pointermove', onPointerMove);
      if (lockable) {
        targetChart.off?.('plot:click', toggleLock);
        targetChart.off?.('beforechangesize', unlockAndHide);
        window.removeEventListener('resize', unlockAndHide);
        window.removeEventListener('scroll', handleScroll, true);
      }
      if (scrollTimer) clearTimeout(scrollTimer);
      observer?.disconnect();
      dispose();
      portal.remove();
    });
  });
}
