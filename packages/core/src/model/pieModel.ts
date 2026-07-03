import type { ChartModel, ChartRuntimeContext, InteractionModel } from '../runtime/types';
import type { ChartSpec } from '../types/spec';
import { getPieDefaultConfig, type PieChartConfig } from './pieDefaultConfig';
import { resolveColorRange } from '../runtime/common';
import { normalizeLegend, normalizeLegendInteractions, normalizeTooltip } from '../runtime/features';
import type { PieSeries, NormalizedPieRecord } from './pie';
import { normalizePieData } from './pie';
import { composeChartModel, runRuntimePipeline } from './createChartModel';

const CHART_NAME = 'G2Pie';

export interface CreatePieModelInput {
  data: PieSeries[];
  config?: PieChartConfig;
  context?: ChartRuntimeContext;
}

/**
 * 饼图运行时模型组装：通用 pipeline + 饼图特有 spec 装配（theta 坐标系 + stackY transform）。
 * 通用部分（mergeDefaultConfig → normalizeData → runRules → applyRuleProcessors → resolveTheme）见 createChartModel.ts。
 */
export function createPieModel(input: CreatePieModelInput): ChartModel {
  const pipeline = runRuntimePipeline<PieSeries[], PieChartConfig>({
    chartName: CHART_NAME,
    data: input.data,
    config: input.config,
    context: input.context,
    getDefaultConfig: getPieDefaultConfig,
    normalizeData: (data) => normalizePieData(data) as unknown as Array<Record<string, never>>,
  });

  const { finalConfig, theme } = pipeline;
  const finalData = pipeline.finalData as unknown as NormalizedPieRecord[];

  const legendValueMap: Record<string, unknown> = {};
  finalData.forEach((record) => {
    if (record && record.x !== undefined && record.x !== null) {
      legendValueMap[String(record.x)] = record.y;
    }
  });
  const legendModel = normalizeLegend(finalConfig.legend, theme.token, {
    marker: 'circle',
    valueMap: legendValueMap,
  });

  const tooltipModel = normalizeTooltip(
    typeof finalConfig.tooltip === 'object'
      ? {
          ...(finalConfig.tooltip as Record<string, unknown>),
          themeToken: theme.token,
        }
      : finalConfig.tooltip,
  );

  const colorRange = resolveColorRange(finalConfig.colors, theme.token);

  const innerRadius = finalConfig.cycle ? finalConfig.innerRadius ?? 0.6 : 0;
  const outerRadius = typeof finalConfig.outerRadius === 'number' ? finalConfig.outerRadius : undefined;

  const intervalSpec: ChartSpec = {
    type: 'interval',
    data: finalData,
    encode: { y: 'y', color: 'x' },
    transform: [{ type: 'stackY' }],
    tooltip: tooltipModel.markSpec,
  } as ChartSpec;

  const spec: ChartSpec = {
    type: 'view',
    data: finalData,
    coordinate: {
      type: 'theta',
      ...(typeof innerRadius === 'number' ? { innerRadius } : {}),
      ...(typeof outerRadius === 'number' ? { outerRadius } : {}),
      ...(typeof finalConfig.startAngle === 'number' ? { startAngle: finalConfig.startAngle } : {}),
      ...(typeof finalConfig.endAngle === 'number' ? { endAngle: finalConfig.endAngle } : {}),
    },
    legend: legendModel.spec === false ? false : { color: legendModel.spec },
    tooltip: tooltipModel.spec,
    theme: theme.g2Theme,
    children: [intervalSpec],
  };

  if (colorRange) {
    spec.scale = { color: { range: colorRange } };
  }

  const legendInteractions = normalizeLegendInteractions(legendModel, {
    rawData: input.data as unknown as Array<Record<string, unknown>>,
  });
  const interactions: InteractionModel[] = legendInteractions.filter(Boolean);

  return composeChartModel({
    chartName: CHART_NAME,
    spec,
    pipeline,
    legend: legendModel,
    tooltip: tooltipModel,
    interactions,
  });
}
