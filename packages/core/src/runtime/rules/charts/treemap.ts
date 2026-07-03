import {
  DataStructure,
  EmptyDataProcess,
  type ChartRuleDefinition,
  type RuleConfigObject,
  type RuleData,
} from '../types';

const TREEMAP_CLASSIFY_MAP: Record<string, string> = {
  '0': 'treemap_chart',
  '1': 'polar_treemap_chart',
};

function classifyTreemap(_data: RuleData, config: RuleConfigObject): string {
  return TREEMAP_CLASSIFY_MAP[config?.polar ? '1' : '0'] ?? 'treemap_chart';
}

/**
 * 树形矩阵：dataStructure=Tree；emptyData=Background；classify(polar)。
 */
export const treemapRule: ChartRuleDefinition = {
  id: 'treemap_chart',
  name: '矩阵树图',
  dataStructure: DataStructure.Tree,
  emptyData: EmptyDataProcess.Background,
  classify: classifyTreemap,
  children: {
    polar_treemap_chart: { id: 'polar_treemap_chart', name: '极坐标矩阵树图' },
  },
};
