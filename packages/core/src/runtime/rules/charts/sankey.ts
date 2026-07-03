import { DataStructure, EmptyDataProcess, type ChartRuleDefinition } from '../types';

/**
 * 桑基图：dataStructure=Graph；emptyData=Background；无 bigData / classify。
 */
export const sankeyRule: ChartRuleDefinition = {
  id: 'sankey_chart',
  name: '桑基图',
  dataStructure: DataStructure.Graph,
  emptyData: EmptyDataProcess.Background,
};
