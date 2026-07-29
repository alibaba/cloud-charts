import { createMemo, createSignal, createEffect, type JSX } from 'solid-js';
import {
  createPieModel,
  extractLegendItems,
  type PieChartConfig,
  type PieSeries,
  type ChartRuntimeContext,
  type LegendItem,
  registerLegacyInteractions,
} from '@alicloud/cloud-charts-core';
import { createChartPrimitive } from '../../primitives/createChart';
import { useChartProvider } from '../../provider/index';
import { ChartStateOverlay } from '../../state/ChartStateOverlay';
import { useCustomTooltip } from '../../hooks/useCustomTooltip';
import { TableLegend, FoldableLegend, GradientLegend } from '../../components/legends/index';

export interface PieProps {
  data: PieSeries[];
  config?: PieChartConfig;
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

registerLegacyInteractions();

export function Pie(props: PieProps): JSX.Element {
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

  const model = createMemo(() =>
    createPieModel({ data: props.data, config: props.config, context: fullContext() }),
  );
  const spec = createMemo(() => model().spec);

  const chartInstance = createChartPrimitive(() => ref, spec, {
    event: props.event,
    interaction: props.interaction,
    getChartInstance: props.getChartInstance,
    chartRef: props.chartRef as { current: any } | undefined,
  });

  useCustomTooltip(() => ref, () => chartInstance()?.getChartInstance() ?? null, () => model().tooltip);

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
    if (legend.mode === 'table') return <TableLegend legend={legend} />;
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
            markerType="circle"
            nameFormatter={legend.itemNameFormatter as ((name: string, index: number, item: { name: string; color?: string; [key: string]: unknown }) => string) | undefined}
          />
        );
    if (legend.mode === 'gradient') return <GradientLegend legend={legend} />;
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
