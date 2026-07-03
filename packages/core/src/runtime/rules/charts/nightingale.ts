import {
  DataStructure,
  EmptyDataProcess,
  type ChartRuleDefinition,
  type RuleConfigObject,
  type RuleData,
} from '../types';
import { polarBigDataJudgements } from './_shared';

const NIGHTINGALE_CLASSIFY_MAP: Record<string, string> = {
  '0': 'nightingale_chart',
  '1': 'cycle_nightingale_chart',
};

function classifyNightingale(_data: RuleData, config: RuleConfigObject): string {
  return NIGHTINGALE_CLASSIFY_MAP[config?.cycle ? '1' : '0'] ?? 'nightingale_chart';
}

export const nightingaleRule: ChartRuleDefinition = {
  id: 'nightingale_chart',
  name: '南丁格尔玫瑰图',
  dataStructure: DataStructure.Common,
  emptyData: EmptyDataProcess.Polar,
  classify: classifyNightingale,
  bigData: {
    judgements: polarBigDataJudgements(10, '该极坐标玫瑰图半径过小，会影响展示效果，建议加大图表尺寸'),
  },
  children: {
    cycle_nightingale_chart: { id: 'cycle_nightingale_chart', name: '环形玫瑰图' },
  },
};
