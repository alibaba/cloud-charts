import {
  DataStructure,
  EmptyDataProcess,
  type ChartRuleDefinition,
  type RuleConfigObject,
  type RuleData,
} from '../types';
import { cartesianBigDataJudgements } from './_shared';
import { runDataRules } from '../dataRules';

const HISTOGRAM_CLASSIFY_MAP: Record<string, string> = {
  '00': 'histogram_chart',
  '10': 'polar_histogram_chart',
  '01': 'normalize_histogram_chart',
  '11': 'polar_normalize_histogram_chart',
};

function classifyHistogram(_data: RuleData, config: RuleConfigObject): string {
  const polar = !!config?.polar;
  const normalize = !!config?.percentage;
  const code = `${polar ? 1 : 0}${normalize ? 1 : 0}`;
  return HISTOGRAM_CLASSIFY_MAP[code] ?? 'histogram_chart';
}

/** 直方图：classify(column/polar/normalize) + runDataRules。 */
export const histogramRule: ChartRuleDefinition = {
  id: 'histogram_chart',
  name: '直方图',
  dataStructure: DataStructure.Common,
  emptyData: EmptyDataProcess.Axis,
  classify: classifyHistogram,
  bigData: { judgements: cartesianBigDataJudgements(15, '该直方图数据过于密集，建议减少数据量或加大图表宽度') },
  children: {
    polar_histogram_chart: { id: 'polar_histogram_chart', name: '极坐标直方图' },
    normalize_histogram_chart: { id: 'normalize_histogram_chart', name: '百分比直方图' },
    polar_normalize_histogram_chart: { id: 'polar_normalize_histogram_chart', name: '极坐标百分比直方图' },
  },
  processData: (data, config) => runDataRules(data, config),
};
