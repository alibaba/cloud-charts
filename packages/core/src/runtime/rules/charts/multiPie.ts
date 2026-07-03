import {
  DataStructure,
  EmptyDataProcess,
  type ChartRuleDefinition,
  type RuleConfigObject,
  type RuleData,
} from '../types';
import { polarBigDataJudgements } from './_shared';

const MULTIPIE_CLASSIFY_MAP: Record<string, string> = {
  '0': 'multi_pie_chart',
  '1': 'cycle_multi_pie_chart',
};

function classifyMultiPie(_data: RuleData, config: RuleConfigObject): string {
  return MULTIPIE_CLASSIFY_MAP[config?.cycle ? '1' : '0'] ?? 'multi_pie_chart';
}

/**
 * 多重饼图（旧称 sunburst）：dataStructure=Tree（依赖 data.ts BFS）；emptyData=Polar。
 */
export const multiPieRule: ChartRuleDefinition = {
  id: 'multi_pie_chart',
  name: '多重饼图',
  dataStructure: DataStructure.Tree,
  emptyData: EmptyDataProcess.Polar,
  classify: classifyMultiPie,
  bigData: {
    judgements: polarBigDataJudgements(20, '该多重饼图半径过小，会影响展示效果，建议加大图表尺寸'),
  },
  children: {
    cycle_multi_pie_chart: { id: 'cycle_multi_pie_chart', name: '环形多重饼图' },
  },
};
