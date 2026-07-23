import { createMemo, type JSX } from 'solid-js';
import {
  createBarModel,
  type BarChartConfig,
  type BarSeries,
  type ChartRuntimeContext,
  registerLegacyInteractions,
} from '@alicloud/cloud-charts-core';
import { createChartPrimitive } from '../../primitives/createChart';
import { useChartProvider } from '../../provider/index';
import { ChartStateOverlay } from '../../state/ChartStateOverlay';

export interface BarProps {
  data: BarSeries[];
  config?: BarChartConfig;
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

export function Bar(props: BarProps): JSX.Element {
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
    createBarModel({ data: props.data, config: props.config, context: fullContext() }),
  );
  const spec = createMemo(() => model().spec);

  createChartPrimitive(() => ref, spec, {
    event: props.event,
    interaction: props.interaction,
    getChartInstance: props.getChartInstance,
    chartRef: props.chartRef as { current: any } | undefined,
  });

  const wrapperStyle = (): JSX.CSSProperties => ({
    position: 'relative',
    width: typeof props.width === 'number' ? `${props.width}px` : (props.width ?? '100%'),
    height: typeof props.height === 'number' ? `${props.height}px` : (props.height ?? '300px'),
    ...props.style,
  });

  return (
    <div class={props.className} style={wrapperStyle()}>
      <div ref={ref} style={{ width: '100%', height: '100%' }} />
      <ChartStateOverlay
        state={model().state}
        loadingInfo={props.loadingInfo}
        emptyInfo={props.emptyInfo}
        errorInfo={props.errorInfo}
        context={fullContext()}
      />
    </div>
  );
}
