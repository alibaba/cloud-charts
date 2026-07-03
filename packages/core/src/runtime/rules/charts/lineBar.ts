import {
  DataStructure,
  EmptyDataProcess,
  type ChartRuleDefinition,
  type RuleConfigObject,
  type RuleData,
} from '../types';
import { appendPaddingForCartesian, cartesianBigDataJudgements } from './_shared';
import { runDataRules } from '../dataRules';

const LINEBAR_CLASSIFY_MAP: Record<string, string> = {
  '000': 'line_bar_chart',
  '100': 'dodge_stack_line_bar_chart',
  '010': 'stack_line_bar_chart',
  '001': 'area_line_bar_chart',
  '011': 'area_stack_line_bar_chart',
};

function classifyLineBar(_data: RuleData, config: RuleConfigObject): string {
  const dodge = !!(config?.dodgeStack);
  const stack = !!(config?.stack);
  const area = !!(config?.area);
  const code = `${dodge ? 1 : 0}${stack ? 1 : 0}${area ? 1 : 0}`;
  return LINEBAR_CLASSIFY_MAP[code] ?? 'line_bar_chart';
}

/** 折线+柱状双坐标系图：Origin + appendPadding(lineLabel/barLabel) + runDataRules。 */
export const lineBarRule: ChartRuleDefinition = {
  id: 'line_bar_chart',
  name: '线柱图',
  dataStructure: DataStructure.Origin,
  emptyData: EmptyDataProcess.Axis,
  classify: classifyLineBar,
  bigData: { judgements: cartesianBigDataJudgements(15, '该线柱图数据过于密集，建议减少数据量或加大图表宽度') },
  children: {
    dodge_stack_line_bar_chart: { id: 'dodge_stack_line_bar_chart', name: '分组堆叠线柱图' },
    stack_line_bar_chart: { id: 'stack_line_bar_chart', name: '堆叠线柱图' },
    area_line_bar_chart: { id: 'area_line_bar_chart', name: '面积线柱图' },
    area_stack_line_bar_chart: { id: 'area_stack_line_bar_chart', name: '面积堆叠线柱图' },
  },
  processConfig: (config) =>
    appendPaddingForCartesian(config, { labelKeys: ['lineLabel', 'barLabel'] }),
  processData: (data, config) => runDataRules(data, config),
};
