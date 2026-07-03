import type {
  ChartRenderState,
  ChartRuntimeContext,
  RuleConfig,
  RuleResult,
} from '../types';
import type { ChartPrimitiveValue } from '../../types/spec';
import { classifyChart, registerRule } from './registry';
import { calcDataSize, isEmptyData } from './data';
import { processEmptyData } from './empty';
import { isBigDataInit } from './bigData';
import { deepMerge } from './merge';
import type { RuleConfigObject, RuleData } from './types';

export * from './types';
export { classifyChart, registerRule } from './registry';

type RuleInput = Array<Record<string, ChartPrimitiveValue>> | null | undefined;

function isRuleEnabled(rule: RuleConfig | undefined, key: keyof Exclude<RuleConfig, boolean>): boolean {
  if (rule === undefined || rule === true) {
    return true;
  }
  if (rule === false) {
    return false;
  }
  return rule[key] !== false;
}

function resolveForce(config: RuleConfigObject): boolean | Record<string, boolean> | undefined {
  const force = config.force;
  if (typeof force === 'boolean') {
    return force;
  }
  if (typeof force === 'object' && force !== null) {
    return force as Record<string, boolean>;
  }
  return undefined;
}

/**
 * 运行图表初始化规则管线，复现旧 rule/runRule.tsx 的 runInitRule，去 React/this 化。
 * 返回纯数据模型（data/config/state/metadata），不触碰 DOM、不渲染占位 UI。
 */
export function runRules(
  chartName: string,
  data: RuleInput,
  config: RuleConfigObject,
  context: ChartRuntimeContext = {},
): RuleResult {
  const size = context.size ?? [0, 0];
  const ruleSwitch = context.rule;
  const stateConfig = context.state ?? {};

  const chartRule = classifyChart(chartName, data as RuleData, config);
  if (!chartRule) {
    return {
      data: data ?? [],
      config,
      state: 'normal',
      metadata: { chartName },
    };
  }

  let state: ChartRenderState = 'normal';
  let showPlaceholder = false;

  if (stateConfig.loading) {
    state = 'loading';
    showPlaceholder = true;
  } else if (stateConfig.errorInfo) {
    state = 'error';
    showPlaceholder = true;
  }

  const dataSize = calcDataSize(chartRule.dataStructure, data as RuleData);
  let isEmpty = false;

  if (!showPlaceholder) {
    if (isEmptyData(dataSize)) {
      isEmpty = true;
      state = 'empty';
      showPlaceholder = true;
    }
  }

  if (showPlaceholder && isRuleEnabled(ruleSwitch, 'empty')) {
    const { data: emptyData, config: emptyConfig } = processEmptyData(
      chartRule.emptyData,
      chartRule.dataStructure,
      chartName,
    );
    const mergedConfig = deepMerge(config, emptyConfig ?? undefined);

    const yAxisOverride = (emptyConfig as RuleConfigObject | null)?.yAxis;
    if (Array.isArray(config.yAxis) && yAxisOverride) {
      mergedConfig.yAxis = yAxisOverride;
    }

    return {
      data: (emptyData ?? []) as Array<Record<string, ChartPrimitiveValue>>,
      config: mergedConfig,
      state,
      metadata: { chartName, dataSize, isEmpty: state === 'empty' },
    };
  }

  const force = resolveForce(config);

  if (
    isRuleEnabled(ruleSwitch, 'bigData') &&
    isBigDataInit(chartRule.bigData?.judgements, dataSize, size[0], size[1], chartRule.mainAxis)
  ) {
    if (chartRule.bigData?.process) {
      const output = chartRule.bigData.process({
        chartName,
        ruleId: chartRule.id,
        dataSize,
        size,
        data: data as RuleData,
        config,
        force,
      });
      return {
        data: (output.data ?? data ?? []) as Array<Record<string, ChartPrimitiveValue>>,
        config: deepMerge(config, output.config),
        state,
        metadata: { chartName, dataSize, isBigData: true },
      };
    }
  }

  if (isRuleEnabled(ruleSwitch, 'extremeData') && chartRule.extremeData) {
    const extremeOutput = chartRule.extremeData({
      chartName,
      ruleId: chartRule.id,
      dataSize,
      size,
      data: data as RuleData,
      config,
      force,
    });
    if (extremeOutput.isExtreme) {
      return {
        data: (extremeOutput.data ?? data ?? []) as Array<Record<string, ChartPrimitiveValue>>,
        config: deepMerge(config, extremeOutput.config),
        state,
        metadata: { chartName, dataSize, isExtreme: true },
      };
    }
  }

  return {
    data: (data ?? []) as Array<Record<string, ChartPrimitiveValue>>,
    config,
    state,
    metadata: { chartName, dataSize, isEmpty, isBigData: false, isExtreme: false },
  };
}

/**
 * 配置预处理（processConfig）与数据预处理（processData），复现旧 processFinalData 的合并逻辑。
 */
export function applyRuleProcessors(
  chartName: string,
  data: RuleInput,
  config: RuleConfigObject,
  context: ChartRuntimeContext = {},
): { data: RuleInput; config: RuleConfigObject } {
  const ruleSwitch = context.rule;
  const chartRule = classifyChart(chartName, data as RuleData, config);
  if (!chartRule) {
    return { data, config };
  }

  let finalConfig = config;
  if (isRuleEnabled(ruleSwitch, 'processConfig') && chartRule.processConfig) {
    finalConfig = chartRule.processConfig(finalConfig);
  }

  let finalData = data;
  if (isRuleEnabled(ruleSwitch, 'processData') && chartRule.processData) {
    const output = chartRule.processData(finalData as RuleData, finalConfig);
    finalData = (output.data ?? finalData) as RuleInput;
    finalConfig = deepMerge(finalConfig, output.config);
  }

  return { data: finalData, config: finalConfig };
}
