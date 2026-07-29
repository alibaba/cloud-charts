import { createMemo, createSignal, createEffect, type JSX } from 'solid-js';
import {
  registerLegacyInteractions,
  extractLegendItems,
  type ChartModel,
  type ChartRuntimeContext,
  type LegendItem,
} from '@alicloud/cloud-charts-core';
import { createChartPrimitive } from '../primitives/createChart';
import { useChartProvider } from '../provider/index';
import { ChartStateOverlay } from '../state/ChartStateOverlay';
import { useCustomTooltip } from '../hooks/useCustomTooltip';
import { TableLegend, FoldableLegend, GradientLegend } from '../components/legends/index';

export interface ModelChartProps<TData, TConfig> {
  data: TData;
  config?: TConfig;
  context?: ChartRuntimeContext;
  height?: number | string;
  width?: number | string;
  className?: string;
  style?: JSX.CSSProperties;
  language?: string;
  theme?: string;
  event?: Record<string, (...args: unknown[]) => unknown>;
  interaction?: Record<string, unknown>;
  getChartInstance?: (chart: unknown) => void;
  chartRef?: { current: unknown };
  loading?: boolean;
  loadingInfo?: JSX.Element;
  emptyInfo?: JSX.Element;
  errorInfo?: JSX.Element;
}

export type ModelFactory<TData, TConfig> = (input: {
  data: TData;
  config?: TConfig;
  context?: ChartRuntimeContext;
}) => ChartModel;

export interface CreateModelChartOptions {
  /** Marker type for FoldableLegend: line='hyphen', bar='square', pie='circle' */
  markerType?: 'hyphen' | 'square' | 'circle';
}

registerLegacyInteractions();

export function createModelChart<TData, TConfig>(
  displayName: string,
  createModel: ModelFactory<TData, TConfig>,
  options?: CreateModelChartOptions,
): (props: ModelChartProps<TData, TConfig>) => JSX.Element {
  function SolidModelChart(props: ModelChartProps<TData, TConfig>): JSX.Element {
    const provider = useChartProvider();
    let ref: HTMLDivElement | undefined;

    const fullContext = createMemo<ChartRuntimeContext>(() => {
      const language = props.language ?? props.context?.language ?? provider.locale;
      const themeName = props.theme ?? props.context?.theme ?? provider.theme;
      const ctxState = props.context?.state;
      return {
        ...props.context,
        language,
        theme: themeName,
        state: { ...ctxState, loading: props.loading ?? ctxState?.loading },
      };
    });

    const model = createMemo(() => createModel({ data: props.data, config: props.config, context: fullContext() }));
    const spec = createMemo(() => model().spec);

    const chartInstance = createChartPrimitive(() => ref, spec, {
      event: props.event,
      interaction: props.interaction,
      getChartInstance: props.getChartInstance,
      chartRef: props.chartRef as { current: any } | undefined,
    });

    useCustomTooltip(() => ref, () => chartInstance()?.getChartInstance() ?? null, () => model().tooltip);

    // G2 内置 tooltip 锁定 UI（当 customTooltip 未启用时生效）
    // 使用 G2 v5 内置 clickLock，此处仅绘制 lock/unlock icon
    createEffect(() => {
      const tooltipModel = model().tooltip;
      const lockable = Boolean(tooltipModel?.lockable);
      const useCustom = Boolean(tooltipModel?.customTooltip || tooltipModel?.reactContent);
      if (!lockable || useCustom) return;
      const instance = chartInstance();
      const container = ref;
      if (!instance || !container) return;
      const chart = instance.getChartInstance() as
        | { on?: (n: string, h: (...args: unknown[]) => unknown) => unknown; off?: (n?: string, h?: (...args: unknown[]) => unknown) => unknown }
        | null;
      if (!chart) return;

      const LOCK_ICON_CLASS = 'widgets-tooltip-lock-icon';
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
        let titleEl = el.querySelector('.g2-tooltip-title') as HTMLElement | null;
        if (titleEl) {
          titleEl.style.display = 'flex';
          titleEl.style.alignItems = 'center';
          titleEl.style.justifyContent = 'space-between';
        } else {
          titleEl = document.createElement('div');
          titleEl.style.display = 'flex';
          titleEl.style.justifyContent = 'flex-end';
          titleEl.style.alignItems = 'center';
          el.insertBefore(titleEl, el.firstChild);
        }
        const oldIcon = titleEl.querySelector(`.${LOCK_ICON_CLASS}`);
        if (oldIcon) oldIcon.remove();
        titleEl.appendChild(createLockIcon());
      };

      const onTooltipShow = () => { requestAnimationFrame(() => drawLockElement()); };

      // MutationObserver: 检测 .g2-tooltip 可见性变化，绘制 lock icon
      const tooltipObserver = new MutationObserver(() => {
        const el = findTooltipEl();
        if (el && getComputedStyle(el).visibility === 'visible') {
          const existing = el.querySelector(`.${LOCK_ICON_CLASS}`);
          if (!existing) drawLockElement();
        }
      });
      tooltipObserver.observe(container, { childList: true, subtree: true, attributes: true, attributeFilter: ['style', 'class'] });

      const canvas = container.querySelector('canvas');
      const onPointerDown = () => {
        isLocked = !isLocked;
        requestAnimationFrame(() => drawLockElement());
      };

      chart.on?.('tooltip:show', onTooltipShow);
      if (canvas) canvas.addEventListener('pointerdown', onPointerDown);

      onCleanup(() => {
        chart.off?.('tooltip:show', onTooltipShow);
        tooltipObserver.disconnect();
        if (canvas) canvas.removeEventListener('pointerdown', onPointerDown);
      });
    });

    const [legendItems, setLegendItems] = createSignal<LegendItem[]>([]);
    createEffect(() => {
      const instance = chartInstance();
      if (!instance) {
        setLegendItems([]);
        return;
      }
      const chart = instance.getChartInstance();
      if (!chart) return;
      requestAnimationFrame(() => {
        setLegendItems(extractLegendItems(chart));
      });
    });

    const wrapperStyle = (): JSX.CSSProperties => ({
      position: 'relative',
      width: typeof props.width === 'number' ? `${props.width}px` : (props.width ?? '100%'),
      height: typeof props.height === 'number' ? `${props.height}px` : (props.height ?? '300px'),
      ...props.style,
    });

    const legendNode = () => {
      const legend = model().legend;
      if (!legend) return null;
      if (legend.mode === 'table') return (
        <TableLegend
          legend={legend}
          items={legendItems()}
          chart={chartInstance()?.getChartInstance()}
          originalSpec={spec() as Record<string, unknown>}
          legendField={legend.field || 'color'}
          clickable={legend.clickable}
          hoverable={legend.hoverable}
          useReverseChecked={legend.useReverseChecked}
          allowAllCanceled={legend.allowAllCanceled}
          containerHeight={typeof props.height === 'number' ? props.height : 300}
        />
      );
      if (legend.mode === 'foldable') return (
        <FoldableLegend
          items={legendItems()}
          chart={chartInstance()?.getChartInstance()}
          originalSpec={spec() as Record<string, unknown>}
          containerWidth={typeof props.width === 'number' ? props.width : (ref?.clientWidth ?? 400)}
          containerHeight={typeof props.height === 'number' ? props.height : 300}
          legendField={legend.field || 'color'}
          clickable={legend.clickable}
          hoverable={legend.hoverable}
          nameFormatter={legend.itemNameFormatter as ((name: string, index: number, item: { name: string; color?: string; [key: string]: unknown }) => string) | undefined}
          markerType={options?.markerType}
        />
      );
      if (legend.mode === 'gradient') return (
        <GradientLegend
          legend={legend}
          chart={chartInstance()?.getChartInstance()}
          legendField={legend.field || 'color'}
          hoverable={legend.hoverable}
        />
      );
      return null;
    };

    return (
      <div class={props.className} style={{ ...wrapperStyle(), display: 'flex', 'flex-direction': 'column' }}>
        <div ref={ref} style={{ width: '100%', flex: '1', 'min-height': '0' }} />
        <ChartStateOverlay
          state={model().state}
          loadingInfo={props.loadingInfo}
          emptyInfo={props.emptyInfo}
          errorInfo={props.errorInfo}
          context={fullContext()}
        />
        {legendNode()}
      </div>
    );
  }

  Object.defineProperty(SolidModelChart, 'name', { value: displayName });
  return SolidModelChart;
}
