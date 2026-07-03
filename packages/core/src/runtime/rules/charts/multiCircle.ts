import { DataStructure, EmptyDataProcess, type ChartRuleDefinition } from '../types';
import { polarBigDataJudgements } from './_shared';

/**
 * 多重圆环图：emptyData=Polar；bigData judgements 同 Pie 家族。
 */
export const multiCircleRule: ChartRuleDefinition = {
  id: 'multi_circle_chart',
  name: '多重圆环图',
  dataStructure: DataStructure.Common,
  emptyData: EmptyDataProcess.Polar,
  bigData: {
    judgements: polarBigDataJudgements(15, '该多重圆环图半径过小，会影响展示效果，建议加大图表尺寸'),
  },
};
