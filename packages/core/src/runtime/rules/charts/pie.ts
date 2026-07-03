import {
  BigDataJudgement,
  DataStructure,
  EmptyDataProcess,
  type ChartRuleDefinition,
  type RuleConfigObject,
  type RuleData,
} from '../types';
import { runDataRules } from '../dataRules';
import { processPieBigData } from '../bigData';

const PIE_CLASSIFY_MAP: Record<string, string> = {
  '00': 'pie_chart',
  '10': 'cycle_chart',
  '01': 'rose_chart',
  '11': 'cycle_rose_chart',
};

function classifyPie(_data: RuleData, config: RuleConfigObject): string {
  const isCycle = !!config?.cycle;
  const isRose = !!(config?.outerRadius && config?.innerRadius && (config as Record<string, unknown>).rose);
  const code = `${isCycle ? 1 : 0}${isRose ? 1 : 0}`;
  return PIE_CLASSIFY_MAP[code] ?? 'pie_chart';
}

function filterNegativeNumbers(data: RuleData, config: RuleConfigObject): RuleData {
  if (!Array.isArray(data) || config.filterNegativeNumbers === false) {
    return data;
  }
  return data.map((item) => {
    const record = item as Record<string, unknown>;
    const yValue = Number(record.y);
    if (Number.isFinite(yValue) && yValue < 0) {
      return { ...record, y: 0 };
    }
    return record;
  }) as RuleData;
}

function autoSort(data: RuleData, config: RuleConfigObject): RuleData {
  if (!Array.isArray(data) || config.autoSort === false) {
    return data;
  }
  return [...data].sort((a, b) => {
    const ay = Number((a as Record<string, unknown>).y) || 0;
    const by = Number((b as Record<string, unknown>).y) || 0;
    return by - ay;
  }) as RuleData;
}

export const pieRule: ChartRuleDefinition = {
  id: 'pie_chart',
  name: '饼图',
  dataStructure: DataStructure.Common,
  emptyData: EmptyDataProcess.Polar,
  classify: classifyPie,
  bigData: {
    judgements: [
      { type: BigDataJudgement.Number, threshold: 20 },
    ],
    process: processPieBigData,
  },
  children: {
    cycle_chart: { id: 'cycle_chart', name: '环图' },
    rose_chart: { id: 'rose_chart', name: '玫瑰图' },
    cycle_rose_chart: { id: 'cycle_rose_chart', name: '环形玫瑰图' },
  },
  processData: (data, config) => runDataRules(autoSort(filterNegativeNumbers(data, config), config), config),
};
