import { DataStructure, EmptyDataProcess, type ChartRuleDefinition } from '../types';
import { cartesianBigDataJudgements } from './_shared';

/** 线箱型图：Origin 数据结构（与 LineBar/LineScatter 一致），emptyData=Axis。 */
export const lineboxRule: ChartRuleDefinition = {
  id: 'linebox_chart',
  name: '线箱型图',
  dataStructure: DataStructure.Origin,
  emptyData: EmptyDataProcess.Axis,
  bigData: { judgements: cartesianBigDataJudgements(15, '该线箱型图数据过于密集，建议减少数据量或加大图表宽度') },
};
