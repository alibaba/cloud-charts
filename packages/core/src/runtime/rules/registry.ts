import type { ChartRuleDefinition, RuleConfigObject, RuleData } from './types';
import { lineRule } from './charts/line';
import { barRule } from './charts/bar';
import { pieRule } from './charts/pie';
// 极坐标家族
import { nightingaleRule } from './charts/nightingale';
import { radarRule } from './charts/radar';
import { multiCircleRule } from './charts/multiCircle';
import { multiPieRule } from './charts/multiPie';
// 树/图家族
import { treemapRule } from './charts/treemap';
import { hierarchyRule } from './charts/hierarchy';
import { sankeyRule } from './charts/sankey';
import { funnelRule } from './charts/funnel';
// 笛卡尔简单家族
import { boxRule } from './charts/box';
import { candlestickRule } from './charts/candlestick';
import { lineboxRule } from './charts/linebox';
import { heatmapRule } from './charts/heatmap';
import { rectangleRule } from './charts/rectangle';
// 笛卡尔含 processConfig
import { histogramRule } from './charts/histogram';
import { scatterRule } from './charts/scatter';
import { lineScatterRule } from './charts/lineScatter';
import { lineBarRule } from './charts/lineBar';

const ruleRegistry: Record<string, ChartRuleDefinition> = {
  // 基础三件套
  G2Line: lineRule,
  G2Bar: barRule,
  G2Pie: pieRule,
  // 极坐标家族
  G2Nightingale: nightingaleRule,
  G2Radar: radarRule,
  G2MultiCircle: multiCircleRule,
  G2MultiPie: multiPieRule,
  // 树/图家族
  G2Treemap: treemapRule,
  G2Hierarchy: hierarchyRule,
  G2Sankey: sankeyRule,
  G2Funnel: funnelRule,
  // 笛卡尔简单家族
  G2Box: boxRule,
  // 旧 chartName 拼写带 W 前缀，保留兼容
  G2Wcandlestick: candlestickRule,
  G2Candlestick: candlestickRule,
  G2Linebox: lineboxRule,
  G2Heatmap: heatmapRule,
  G2Rectangle: rectangleRule,
  // 笛卡尔含 processConfig
  G2Histogram: histogramRule,
  G2Scatter: scatterRule,
  G2LineScatter: lineScatterRule,
  G2LineBar: lineBarRule,
};

/**
 * 根据配置项与数据判断图表类型，复现旧 rule/classification.ts 的 classifyChart。
 * 合并父类与命中子类的规则。
 */
export function classifyChart(
  chartName: string,
  data: RuleData,
  config: RuleConfigObject,
): ChartRuleDefinition | null {
  const parentRule = ruleRegistry[chartName];
  if (!parentRule) {
    return null;
  }

  if (!parentRule.classify) {
    return parentRule;
  }

  const category = parentRule.classify(data, config);
  if (!category) {
    return null;
  }
  if (category === parentRule.id) {
    return parentRule;
  }

  const childRule = parentRule.children?.[category];
  return { ...parentRule, ...(childRule || {}) } as ChartRuleDefinition;
}

export function registerRule(chartName: string, rule: ChartRuleDefinition): void {
  ruleRegistry[chartName] = rule;
}
