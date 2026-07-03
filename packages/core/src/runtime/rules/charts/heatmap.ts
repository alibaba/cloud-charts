import { DataStructure, EmptyDataProcess, type ChartRuleDefinition } from '../types';

/** 热力图：无 bigData，emptyData=Background。 */
export const heatmapRule: ChartRuleDefinition = {
  id: 'heatmap_chart',
  name: '热力图',
  dataStructure: DataStructure.Common,
  emptyData: EmptyDataProcess.Background,
};
