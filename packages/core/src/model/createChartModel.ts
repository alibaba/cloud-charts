import type { ChartPrimitiveValue, ChartSpec } from '../types/spec';
import type {
  ChartModel,
  ChartModelMetadata,
  ChartRenderState,
  ChartRuntimeContext,
  InteractionModel,
  LegendModel,
  ResolvedTheme,
  TooltipModel,
} from '../runtime/types';
import { deepMerge } from '../runtime/rules/merge';
import { runRules, applyRuleProcessors } from '../runtime/rules';
import { resolveTheme } from '../runtime/theme';

export interface RuntimePipelineInput<TData, TConfig> {
  chartName: string;
  data: TData;
  config?: TConfig;
  context?: ChartRuntimeContext;
  getDefaultConfig: () => TConfig;
  normalizeData: (data: TData) => Array<Record<string, ChartPrimitiveValue>>;
}

export interface RuntimePipelineResult<TConfig> {
  context: ChartRuntimeContext;
  finalConfig: TConfig;
  finalData: Array<Record<string, ChartPrimitiveValue>>;
  theme: ResolvedTheme;
  state: ChartRenderState;
  metadata: Partial<ChartModelMetadata>;
}

/**
 * 通用前置管线：mergeDefaultConfig → normalizeData → runRules → applyRuleProcessors → resolveTheme。
 * 折线/柱状/饼图共享，链路与产物形式相同；图表特有逻辑（scale/axis/marks）在调用方按 ChartSpec 自行装配。
 */
export function runRuntimePipeline<TData, TConfig>(
  input: RuntimePipelineInput<TData, TConfig>,
): RuntimePipelineResult<TConfig> {
  const context = input.context ?? {};
  const mergedConfig = deepMerge(
    input.getDefaultConfig() as unknown as Record<string, unknown>,
    input.config as unknown as Record<string, unknown>,
  ) as TConfig;

  // 旧版 src/common/Base.tsx：当 config.dataType === 'g2' 时跳过 highchartsDataToG2Data 转换，
  // 直接把用户传入的 G2 平铺数据原样喂给 G2。新版同样旁路 normalizeData，避免误解析。
  const isG2Native = (mergedConfig as unknown as { dataType?: string })?.dataType === 'g2';
  const normalizedData = isG2Native
    ? ((input.data as unknown as Array<Record<string, ChartPrimitiveValue>>) ?? [])
    : input.normalizeData(input.data);

  const ruleResult = runRules(input.chartName, normalizedData, mergedConfig as Record<string, unknown>, context);
  const afterProcess = applyRuleProcessors(
    input.chartName,
    ruleResult.data ?? normalizedData,
    (ruleResult.config ?? mergedConfig) as Record<string, unknown>,
    context,
  );

  return {
    context,
    finalConfig: afterProcess.config as TConfig,
    finalData: (afterProcess.data ?? []) as Array<Record<string, ChartPrimitiveValue>>,
    theme: resolveTheme(context.theme),
    state: ruleResult.state,
    metadata: ruleResult.metadata,
  };
}

/**
 * 把通用 InteractionModel 列表转写为 G2 spec.interaction 形态。
 * 当前已纳管：legacyLegendHighlight / legacyLegendFilter / legacyEllipsisText / legacyRectZoom。
 */
export function assembleInteractionSpec(interactions: InteractionModel[]): Record<string, unknown> {
  return interactions.reduce<Record<string, unknown>>((interactionSpec, interaction) => {
    if (interaction.name === 'legacyLegendHighlight') {
      interactionSpec.legacyLegendHighlight = interaction.spec ?? true;
      return interactionSpec;
    }
    if (interaction.name === 'legacyLegendFilter') {
      interactionSpec.legacyLegendFilter = interaction.spec ?? true;
      return interactionSpec;
    }
    if (interaction.name === 'legacyEllipsisText') {
      interactionSpec.legacyEllipsisText = interaction.spec ?? true;
      return interactionSpec;
    }
    if (interaction.name === 'legacyRectZoom') {
      interactionSpec.legacyRectZoom = interaction.spec ?? true;
      interactionSpec.legacyTooltipGuard = true;
      return interactionSpec;
    }
    return interactionSpec;
  }, {});
}

export interface ComposeChartModelInput<TConfig> {
  chartName: string;
  spec: ChartSpec;
  pipeline: RuntimePipelineResult<TConfig>;
  legend: LegendModel;
  tooltip: TooltipModel;
  interactions: InteractionModel[];
}

/** 将 spec + pipeline 上下文 + legend/tooltip/interactions 包装为统一的 ChartModel 返回值。 */
export function composeChartModel<TConfig>(input: ComposeChartModelInput<TConfig>): ChartModel {
  const interactionSpec = assembleInteractionSpec(input.interactions);
  // 旧版 rectTooltip 默认 shared + crosshairs 通过 G2 v5 spec.interaction.tooltip 实现
  if (input.tooltip?.interactionTooltip) {
    interactionSpec.tooltip = {
      ...(interactionSpec.tooltip as Record<string, unknown> | undefined),
      ...input.tooltip.interactionTooltip,
    };
  }
  const spec: ChartSpec = { ...input.spec };
  if (Object.keys(interactionSpec).length > 0) {
    spec.interaction = interactionSpec;
  }
  if (spec.animate === undefined) {
    spec.animate = { update: { type: 'morphing', duration: 300 } };
  }
  // 旧版默认 chart.padding('auto')；G2 v5 不传时由 autoFit + 内置 padding 计算，但部分场景（label 显示、长 axis label）会裁切。
  // 主动设置 'auto' 让 G2 v5 走 autopadding 算法，与旧版视觉对齐。
  if (spec.padding === undefined) {
    spec.padding = 'auto';
  }

  return {
    spec,
    data: input.pipeline.finalData,
    config: input.pipeline.finalConfig as Record<string, unknown>,
    context: input.pipeline.context,
    state: input.pipeline.state,
    theme: input.pipeline.theme,
    legend: input.legend,
    tooltip: input.tooltip,
    interactions: input.interactions,
    metadata: { chartName: input.chartName, ...input.pipeline.metadata },
  };
}
