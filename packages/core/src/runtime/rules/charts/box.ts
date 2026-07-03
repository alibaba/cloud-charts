import { DataStructure, EmptyDataProcess, type ChartRuleDefinition } from '../types';
import { cartesianBigDataJudgements } from './_shared';

/** 箱型图：仅 bigData judgements，emptyData=Axis。 */
export const boxRule: ChartRuleDefinition = {
  id: 'box_chart',
  name: '箱型图',
  dataStructure: DataStructure.Common,
  emptyData: EmptyDataProcess.Axis,
  bigData: { judgements: cartesianBigDataJudgements(15, '该箱型图数据过于密集，建议减少数据量或加大图表宽度') },
};
