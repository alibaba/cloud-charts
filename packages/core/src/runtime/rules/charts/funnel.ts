import {
  BigDataJudgement,
  DataStructure,
  EmptyDataProcess,
  type ChartRuleDefinition,
  type RuleConfigObject,
  type RuleData,
} from '../types';

const FUNNEL_CLASSIFY_MAP: Record<string, string> = {
  column: 'funnel_chart',
  pyramid: 'pyramid_chart',
};

function classifyFunnel(_data: RuleData, config: RuleConfigObject): string {
  const shape = String(config?.shape ?? 'column');
  return FUNNEL_CLASSIFY_MAP[shape] ?? 'funnel_chart';
}

/**
 * 漏斗图：dataStructure=Common；emptyData=Background；
 * classify 区分 column 漏斗（默认）和 pyramid 金字塔；bigData 仅 judgements。
 */
export const funnelRule: ChartRuleDefinition = {
  id: 'funnel_chart',
  name: '漏斗图',
  dataStructure: DataStructure.Common,
  emptyData: EmptyDataProcess.Background,
  classify: classifyFunnel,
  bigData: {
    judgements: [
      { type: BigDataJudgement.Length, threshold: 8, message: '该漏斗图层级过多，建议减少数据量' },
    ],
  },
  children: {
    pyramid_chart: { id: 'pyramid_chart', name: '金字塔图' },
  },
};
