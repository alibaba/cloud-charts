import {
  DataStructure,
  EmptyDataProcess,
  type ChartRuleDefinition,
  type RuleConfigObject,
  type RuleData,
} from '../types';
import { appendPaddingForCartesian, cartesianBigDataJudgements } from './_shared';
import { runDataRules } from '../dataRules';

const SCATTER_CLASSIFY_MAP: Record<string, string> = {
  '0': 'scatter_chart',
  '1': 'jitter_scatter_chart',
};

function classifyScatter(_data: RuleData, config: RuleConfigObject): string {
  return SCATTER_CLASSIFY_MAP[config?.jitter ? '1' : '0'] ?? 'scatter_chart';
}

/**
 * 散点图：classify(jitter) + appendPadding（jitter 时跳过）+ runDataRules。
 */
export const scatterRule: ChartRuleDefinition = {
  id: 'scatter_chart',
  name: '散点图',
  dataStructure: DataStructure.Common,
  emptyData: EmptyDataProcess.Axis,
  classify: classifyScatter,
  bigData: { judgements: cartesianBigDataJudgements(20, '该散点图数据过于密集，建议减少数据量或加大图表宽度') },
  children: {
    jitter_scatter_chart: { id: 'jitter_scatter_chart', name: '抖动散点图' },
  },
  processConfig: (config) =>
    appendPaddingForCartesian(config, { labelKeys: ['label'], symbolKey: 'symbol', skipJitter: true }),
  processData: (data, config) => runDataRules(data, config),
};
