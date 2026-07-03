import { DataStructure, EmptyDataProcess, type ChartRuleDefinition } from '../types';

/**
 * 矩形分箱图：无 bigData，emptyData=Background（单点 (0,0) 特判已在 empty.ts 处理）。
 */
export const rectangleRule: ChartRuleDefinition = {
  id: 'rectangle_chart',
  name: '矩形分箱图',
  dataStructure: DataStructure.Common,
  emptyData: EmptyDataProcess.Background,
};
