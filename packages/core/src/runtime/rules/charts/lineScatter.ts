import {
  DataStructure,
  EmptyDataProcess,
  type ChartRuleDefinition,
  type RuleConfigObject,
  type RuleData,
} from '../types';
import { appendPaddingForCartesian, cartesianBigDataJudgements } from './_shared';
import { runDataRules } from '../dataRules';

const LINESCATTER_CLASSIFY_MAP: Record<string, string> = {
  '0': 'line_scatter_chart',
  '1': 'area_line_scatter_chart',
};

function classifyLineScatter(_data: RuleData, config: RuleConfigObject): string {
  return LINESCATTER_CLASSIFY_MAP[config?.area ? '1' : '0'] ?? 'line_scatter_chart';
}

/** 折线+散点双坐标系图：Origin + appendPadding(lineLabel/scatterLabel) + runDataRules。 */
export const lineScatterRule: ChartRuleDefinition = {
  id: 'line_scatter_chart',
  name: '折线散点图',
  dataStructure: DataStructure.Origin,
  emptyData: EmptyDataProcess.Axis,
  classify: classifyLineScatter,
  bigData: { judgements: cartesianBigDataJudgements(10, '该线点图数据过于密集，建议减少数据量或加大图表宽度') },
  children: {
    area_line_scatter_chart: { id: 'area_line_scatter_chart', name: '面积折线散点图' },
  },
  processConfig: (config) =>
    appendPaddingForCartesian(config, { labelKeys: ['lineLabel', 'scatterLabel'] }),
  processData: (data, config) => runDataRules(data, config),
};
