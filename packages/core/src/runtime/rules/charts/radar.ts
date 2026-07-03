import {
  DataStructure,
  EmptyDataProcess,
  type ChartRuleDefinition,
  type RuleConfigObject,
  type RuleData,
} from '../types';
import { polarBigDataJudgements } from './_shared';

const RADAR_CLASSIFY_MAP: Record<string, string> = {
  '0': 'radar_chart',
  '1': 'area_radar_chart',
};

function classifyRadar(_data: RuleData, config: RuleConfigObject): string {
  return RADAR_CLASSIFY_MAP[config?.area ? '1' : '0'] ?? 'radar_chart';
}

/**
 * 雷达图：emptyData=Polar，6 点特判已在 empty.ts 的 Polar / G2Radar 分支处理。
 */
export const radarRule: ChartRuleDefinition = {
  id: 'radar_chart',
  name: '雷达图',
  dataStructure: DataStructure.Common,
  emptyData: EmptyDataProcess.Polar,
  classify: classifyRadar,
  bigData: {
    judgements: polarBigDataJudgements(10, '该雷达图半径过小，会影响展示效果，建议加大图表尺寸'),
  },
  children: {
    area_radar_chart: { id: 'area_radar_chart', name: '面积雷达图' },
  },
};
