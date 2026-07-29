import React, { useMemo, useState, useEffect, useRef } from 'react';
import {
  registerLegacyInteractions,
  extractLegendItems,
  type ChartModel,
  type ChartRuntimeContext,
  type LegendItem,
} from '@alicloud/cloud-charts-core';
import { useChart } from '../hooks/useChart';
import { useCustomTooltip } from '../hooks/useCustomTooltip';
import { useChartProvider } from '../provider/index';
import { ChartStateOverlay } from '../state/ChartStateOverlay';
import { TableLegend, FoldableLegend, GradientLegend } from '../components/legends/index';

export interface ModelChartProps<TData, TConfig> {
  data: TData;
  config?: TConfig;
  context?: ChartRuntimeContext;
  height?: number | string;
  width?: number | string;
  className?: string;
  style?: React.CSSProperties;
  language?: string;
  theme?: string;
  event?: Record<string, (...args: unknown[]) => unknown>;
  interaction?: Record<string, unknown>;
  getChartInstance?: (chart: unknown) => void;
  chartRef?: React.MutableRefObject<unknown>;
  loading?: boolean;
  loadingInfo?: React.ReactNode;
  emptyInfo?: React.ReactNode;
  errorInfo?: React.ReactNode;
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

// Register legacy interactions once at module level (idempotent)
registerLegacyInteractions();

/**
 * React createModelChart factory — equivalent to Solid's createModelChart.
 * Creates a chart component from a model factory, with full legend/tooltip support.
 */
export function createModelChart<TData, TConfig>(
  displayName: string,
  createModel: ModelFactory<TData, TConfig>,
  options?: CreateModelChartOptions,
): (props: ModelChartProps<TData, TConfig>) => JSX.Element {
  function ReactModelChart(props: ModelChartProps<TData, TConfig>): JSX.Element {
    const provider = useChartProvider();
    const language = props.language ?? props.context?.language ?? provider.locale;
    const themeName = props.theme ?? props.context?.theme ?? provider.theme;

    const ctxState = props.context?.state;
    const fullContext: ChartRuntimeContext = {
      ...props.context,
      language,
      theme: themeName,
      state: { ...ctxState, loading: props.loading ?? ctxState?.loading },
    };

    // Memoize context as JSON string to avoid recreating model on every render
    const contextKey = JSON.stringify(fullContext);
    const model = useMemo(
      () => createModel({ data: props.data, config: props.config, context: fullContext }),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [props.data, props.config, contextKey],
    );

    const { containerRef, getChartInstance } = useChart({
      spec: model.spec,
      event: props.event,
      interaction: props.interaction,
      getChartInstance: props.getChartInstance,
      chartRef: props.chartRef as React.MutableRefObject<any> | undefined,
      state: model.state,
      lockable: Boolean(model.tooltip?.lockable),
    });

    // Track container element via state so useCustomTooltip re-runs after mount
    const [containerEl, setContainerEl] = useState<HTMLDivElement | null>(null);
    const [chartEl, setChartEl] = useState<unknown>(null);
    const containerRefCallback = useRef((el: HTMLDivElement | null) => {
      containerRef.current = el;
      setContainerEl(el);
    });
    useEffect(() => {
      // After mount or spec change, update chart element for useCustomTooltip
      const chart = getChartInstance();
      setChartEl(chart);
    }, [model.spec, getChartInstance]);

    useCustomTooltip(
      containerEl,
      chartEl as unknown as Parameters<typeof useCustomTooltip>[1],
      model.tooltip,
    );

    // Extract legend items from chart instance (for FoldableLegend/TableLegend)
    // G2 v5 render() is async, so we retry until scales are available.
    const [legendItems, setLegendItems] = useState<LegendItem[]>([]);
    useEffect(() => {
      const chart = getChartInstance();
      if (!chart) return;

      let cancelled = false;
      let timerId: ReturnType<typeof setTimeout>;

      const tryExtract = (retryCount: number) => {
        if (cancelled) return;
        const rawItems = extractLegendItems(chart);
        if (rawItems.length > 0 || retryCount >= 15) {
          // Merge valueMap from legend model into items for TableLegend statistics
          const valueMap = model.legend?.tableConfig?.valueMap as Record<string, unknown> | undefined;
          const items = valueMap
            ? rawItems.map((it) => ({ ...it, current: valueMap[it.name] }))
            : rawItems;
          setLegendItems(items);
          return;
        }
        timerId = setTimeout(() => tryExtract(retryCount + 1), 100);
      };

      timerId = setTimeout(() => tryExtract(0), 200);

      return () => {
        cancelled = true;
        clearTimeout(timerId);
      };
    }, [props.data, getChartInstance]);

    const wrapperStyle: React.CSSProperties = {
      position: 'relative',
      width: props.width ?? '100%',
      height: props.height ?? 300,
      ...props.style,
    };

    const chart = getChartInstance();
    const containerWidth =
      typeof props.width === 'number' ? props.width : (containerRef.current?.clientWidth ?? 400);
    const containerHeight = typeof props.height === 'number' ? props.height : 300;

    const renderLegend = () => {
      const legend = model.legend;
      if (!legend) return null;
      if (legend.mode === 'table') {
        return (
          <TableLegend
            legend={legend}
            items={legendItems}
            chart={chart}
            originalSpec={model.spec as Record<string, unknown>}
            legendField={legend.field || 'color'}
            clickable={legend.clickable}
            hoverable={legend.hoverable}
            useReverseChecked={legend.useReverseChecked}
            allowAllCanceled={legend.allowAllCanceled}
            containerHeight={containerHeight}
          />
        );
      }
      if (legend.mode === 'foldable') {
        return (
          <FoldableLegend
            items={legendItems}
            chart={chart}
            originalSpec={model.spec as Record<string, unknown>}
            containerWidth={containerWidth}
            containerHeight={containerHeight}
            legendField={legend.field || 'color'}
            clickable={legend.clickable}
            hoverable={legend.hoverable}
            useReverseChecked={legend.useReverseChecked}
            allowAllCanceled={legend.allowAllCanceled}
            markerType={options?.markerType}
            nameFormatter={
              legend.itemNameFormatter as
                | ((name: string, index: number, item: LegendItem) => string)
                | undefined
            }
          />
        );
      }
      if (legend.mode === 'gradient') {
        return (
          <GradientLegend
            legend={legend}
            chart={chart}
            legendField={legend.field || 'color'}
            hoverable={legend.hoverable}
          />
        );
      }
      return null;
    };

    return (
      <div className={props.className} style={{ ...wrapperStyle, display: 'flex', flexDirection: 'column' }}>
        <div ref={containerRefCallback.current} style={{ width: '100%', flex: '1', minHeight: 0 }} />
        <ChartStateOverlay
          state={model.state}
          loadingInfo={props.loadingInfo}
          emptyInfo={props.emptyInfo}
          errorInfo={props.errorInfo}
          context={fullContext}
        />
        {renderLegend()}
      </div>
    );
  }

  Object.defineProperty(ReactModelChart, 'name', { value: displayName });
  return ReactModelChart;
}
