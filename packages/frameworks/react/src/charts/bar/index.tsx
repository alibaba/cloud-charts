import React, { useMemo } from 'react';
import {
  createBarModel,
  type BarChartConfig,
  type BarSeries,
  type ChartRuntimeContext,
} from '@alicloud/cloud-charts-core';
import { registerLegacyInteractions } from '@alicloud/cloud-charts-core';
import { useChart } from '../../hooks/useChart';
import { useCustomTooltip } from '../../hooks/useCustomTooltip';
import { useChartProvider } from '../../provider/index';
import { ChartStateOverlay } from '../../state/ChartStateOverlay';
import { TableLegend, FoldableLegend, GradientLegend } from '../../components/legends/index';

export interface BarProps {
  data: BarSeries[];
  config?: BarChartConfig;
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
  /** 旧版 props.loading 兼容：true 时覆盖 loading 占位 */
  loading?: boolean;
  loadingInfo?: React.ReactNode;
  emptyInfo?: React.ReactNode;
  errorInfo?: React.ReactNode;
}

/**
 * 新 React Bar 组件：基于 createBarModel 生成 ChartSpec，再通过 useChart 渲染。
 * Provider 注入的 theme/locale 与 props 显式传入冲突时，以 props 为准（与旧 Wbar 行为一致）。
 * loading/empty/error 状态由 ChartStateOverlay 覆盖渲染。
 */
export function Bar(props: BarProps): JSX.Element {
  registerLegacyInteractions();
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

  const model = useMemo(
    () =>
      createBarModel({
        data: props.data,
        config: props.config,
        context: fullContext,
      }),
    [props.data, props.config, fullContext],
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
  useCustomTooltip(containerRef.current, getChartInstance() as unknown as Parameters<typeof useCustomTooltip>[1], model.tooltip);

  const wrapperStyle: React.CSSProperties = {
    position: 'relative',
    width: props.width ?? '100%',
    height: props.height ?? 300,
    ...props.style,
  };
  const containerStyle: React.CSSProperties = { width: '100%', height: '100%' };

  return (
    <div className={props.className} style={wrapperStyle}>
      <div ref={containerRef} style={containerStyle} />
      <ChartStateOverlay
        state={model.state}
        loadingInfo={props.loadingInfo}
        emptyInfo={props.emptyInfo}
        errorInfo={props.errorInfo}
        context={fullContext}
      />
      {model.legend?.mode === 'table' ? <TableLegend legend={model.legend} /> : null}
      {model.legend?.mode === 'foldable' ? <FoldableLegend legend={model.legend} /> : null}
      {model.legend?.mode === 'gradient' ? <GradientLegend legend={model.legend} /> : null}
    </div>
  );
}
