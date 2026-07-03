import {
  DataStructure,
  EmptyDataProcess,
  type ChartRuleDefinition,
  type RuleConfigObject,
  type RuleData,
} from '../types';

const HIERARCHY_CLASSIFY_MAP: Record<string, string> = {
  '0': 'hierarchy_chart',
  '1': 'polar_hierarchy_chart',
};

function classifyHierarchy(_data: RuleData, config: RuleConfigObject): string {
  return HIERARCHY_CLASSIFY_MAP[config?.polar ? '1' : '0'] ?? 'hierarchy_chart';
}

/**
 * 层次相邻图：dataStructure=Tree；emptyData=Background；classify(polar)。
 */
export const hierarchyRule: ChartRuleDefinition = {
  id: 'hierarchy_chart',
  name: '层次相邻图',
  dataStructure: DataStructure.Tree,
  emptyData: EmptyDataProcess.Background,
  classify: classifyHierarchy,
  children: {
    polar_hierarchy_chart: { id: 'polar_hierarchy_chart', name: '极坐标层次图' },
  },
};
