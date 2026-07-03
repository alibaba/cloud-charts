import {
  BigDataJudgement,
  DataStructure,
  EmptyDataProcess,
  type ChartRuleDefinition,
  type ExtremeDataOutput,
  type RuleConfigObject,
  type RuleData,
  type RuleProcessParams,
} from '../types';
import { runDataRules } from '../dataRules';
import { processBarBigData } from '../bigData';

const BAR_CLASSIFY_MAP: Record<string, string> = {
  '10000000': 'bar_chart',
  '00000000': 'horizontal_bar_chart',
  '11000000': 'interval_bar_chart',
  '01000000': 'horizontal_interval_bar_chart',
  '10000010': 'stacked_bar_chart',
  '00000010': 'horizontal_stacked_bar_chart',
  '10001010': 'percentage_bar_chart',
  '10000100': 'grouped_stacked_bar_chart',
  '10001100': 'grouped_percentage_stack_bar_chart',
  '10010000': 'facet_bar_chart',
  '00010000': 'horizontal_facet_bar_chart',
  '10100000': 'polar_bar_chart',
  '00100000': 'polar_horizontal_bar_chart',
  '10100010': 'polar_stacked_bar_chart',
};

function classifyBar(data: RuleData, config: RuleConfigObject): string {
  const isColumn = config?.column === undefined || config?.column === true;
  const isInterval = Array.isArray(data) && data.some((item) => Array.isArray((item as Record<string, unknown>).y));
  const isPolar = !!config?.polar;
  const hasDodges = Array.isArray(data)
    ? new Set(data.map((item) => (item as Record<string, unknown>).dodge)).size > 1
    : false;
  const isFacet = !!config?.facet && Array.isArray(data) && new Set(data.map((item) => (item as Record<string, unknown>).facet)).size > 1;
  const isPercentage = !!config?.percentage;
  const isDodgeStack = !!config?.dodgeStack && hasDodges;
  const isStack = !isDodgeStack && !!config?.stack;
  const isDodge = !isDodgeStack && !isStack && !!config?.dodge && hasDodges;

  const code = `${isColumn ? 1 : 0}${isInterval ? 1 : 0}${isPolar ? 1 : 0}${isFacet ? 1 : 0}${isPercentage ? 1 : 0}${isDodgeStack ? 1 : 0}${isStack ? 1 : 0}${isDodge ? 1 : 0}`;
  return BAR_CLASSIFY_MAP[code] ?? 'bar_chart';
}

function processBarConfig(config: RuleConfigObject): RuleConfigObject {
  let finalConfig = config;

  if (finalConfig.percentage) {
    const yAxis = finalConfig.yAxis as Record<string, unknown> | undefined;
    if (!yAxis?.labelFormatter) {
      finalConfig = {
        ...finalConfig,
        yAxis: { ...(yAxis || {}), min: 0, max: 1, labelFormatter: (v: number) => `${Math.round(v * 100)}%` },
      };
    }
  }

  const label = finalConfig.label as { visible?: boolean } | boolean | undefined;
  const labelVisible = label === true || (typeof label === 'object' && label !== null && label.visible !== false);
  if (labelVisible) {
    finalConfig = {
      ...finalConfig,
      appendPadding: finalConfig.appendPadding || [20, 20, 0, 0],
    };
  }

  return finalConfig;
}

function processBarExtremeData(params: RuleProcessParams): ExtremeDataOutput {
  const { dataSize, size, config, data, force } = params;
  const width = size[0];
  const length = width - 50;

  const types = Array.isArray(data)
    ? new Set(data.map((item) => (item as Record<string, unknown>).type)).size
    : 1;
  const barWidth = 24;
  const groups = config?.stack ? 1 : types;
  const minCount = Math.floor(length / (groups * barWidth + 80));

  if (dataSize >= minCount) {
    return { isExtreme: false };
  }

  if (force === true || (typeof force === 'object' && force?.extreme === true)) {
    return { isExtreme: true };
  }

  return {
    isExtreme: true,
    config: { ...config, xAxis: { ...(config.xAxis as Record<string, unknown> || {}), range: [0, (dataSize / minCount)] } },
  };
}

export const barRule: ChartRuleDefinition = {
  id: 'bar_chart',
  name: '柱图',
  mainAxis: 'x',
  dataStructure: DataStructure.Common,
  emptyData: EmptyDataProcess.Axis,
  classify: classifyBar,
  bigData: {
    judgements: [
      { type: BigDataJudgement.Length, threshold: 15 },
      { type: BigDataJudgement.Number, threshold: 30 },
    ],
    process: processBarBigData,
  },
  extremeData: processBarExtremeData,
  processConfig: processBarConfig,
  children: {
    horizontal_bar_chart: { id: 'horizontal_bar_chart', name: '横向柱图', mainAxis: 'y' },
    interval_bar_chart: { id: 'interval_bar_chart', name: '区间柱图' },
    horizontal_interval_bar_chart: { id: 'horizontal_interval_bar_chart', name: '横向区间柱图', mainAxis: 'y' },
    stacked_bar_chart: { id: 'stacked_bar_chart', name: '堆叠柱图' },
    horizontal_stacked_bar_chart: { id: 'horizontal_stacked_bar_chart', name: '横向堆叠柱图', mainAxis: 'y' },
    percentage_bar_chart: { id: 'percentage_bar_chart', name: '百分比柱图' },
    grouped_stacked_bar_chart: { id: 'grouped_stacked_bar_chart', name: '分组堆叠柱图' },
    grouped_percentage_stack_bar_chart: { id: 'grouped_percentage_stack_bar_chart', name: '分组百分比堆叠柱图' },
    facet_bar_chart: { id: 'facet_bar_chart', name: '镜面柱图' },
    horizontal_facet_bar_chart: { id: 'horizontal_facet_bar_chart', name: '横向镜面柱图', mainAxis: 'y' },
    polar_bar_chart: { id: 'polar_bar_chart', name: '极坐标柱图' },
    polar_horizontal_bar_chart: { id: 'polar_horizontal_bar_chart', name: '玉玦图', mainAxis: 'y' },
    polar_stacked_bar_chart: { id: 'polar_stacked_bar_chart', name: '极坐标堆叠柱图' },
  },
  processData: (data, config) => runDataRules(data, config),
};
