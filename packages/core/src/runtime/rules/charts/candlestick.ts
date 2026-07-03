import { DataStructure, EmptyDataProcess, type ChartRuleDefinition } from '../types';
import { cartesianBigDataJudgements } from './_shared';

/**
 * K 线图（蜡烛图）：仅 bigData judgements，emptyData=Axis。
 * 旧 chartName 是 G2Wcandlestick（带 W 前缀），保留原名以匹配 registry 查询。
 */
export const candlestickRule: ChartRuleDefinition = {
  id: 'candlestick_chart',
  name: 'K 线图',
  dataStructure: DataStructure.Common,
  emptyData: EmptyDataProcess.Axis,
  bigData: { judgements: cartesianBigDataJudgements(30, '该 K 线图数据过于密集，建议减少数据量或加大图表宽度') },
};
