import type { ChartPrimitiveValue } from '../../types/spec';

/** Tree 结构数据：单根对象，children 是子节点数组（嵌套）。 */
export interface RuleTreeNode {
  name?: string;
  value?: ChartPrimitiveValue;
  children?: RuleTreeNode[];
  [key: string]: unknown;
}

/** Graph 结构数据：单对象包含 nodes/links。 */
export interface RuleGraphData {
  nodes?: Array<Record<string, unknown>>;
  links?: Array<Record<string, unknown>>;
  edges?: Array<Record<string, unknown>>;
  [key: string]: unknown;
}

export type RuleData =
  | Array<Record<string, ChartPrimitiveValue>>
  | RuleTreeNode
  | RuleGraphData
  | null
  | undefined;

export type RuleConfigObject = Record<string, unknown>;

export enum DataStructure {
  Common = 'common',
  Tree = 'tree',
  Origin = 'origin',
  Graph = 'graph',
}

export enum EmptyDataProcess {
  Axis = 'axis',
  Polar = 'polar',
  Background = 'background',
}

export enum BigDataJudgement {
  Length = 'length',
  Area = 'area',
  Polar = 'polar',
  Number = 'number',
}

export interface BigDataJudgementConfig {
  type: BigDataJudgement;
  threshold: number;
  message?: string;
}

export interface BigDataConfig {
  judgements: BigDataJudgementConfig[];
  process?: (params: RuleProcessParams) => RuleProcessOutput;
}

export interface ExtremeDataOutput {
  isExtreme: boolean;
  data?: RuleData;
  config?: RuleConfigObject;
}

export interface RuleProcessParams {
  chartName: string;
  ruleId: string;
  dataSize: number;
  size: [number, number];
  data: RuleData;
  config: RuleConfigObject;
  force?: boolean | Record<string, boolean>;
}

export interface RuleProcessOutput {
  data?: RuleData;
  config?: RuleConfigObject;
}

export interface ChartRuleDefinition {
  id: string;
  name: string;
  mainAxis?: 'x' | 'y';
  dataStructure: DataStructure;
  emptyData: EmptyDataProcess;
  bigData?: BigDataConfig;
  extremeData?: (params: RuleProcessParams) => ExtremeDataOutput;
  processConfig?: (config: RuleConfigObject) => RuleConfigObject;
  processData?: (data: RuleData, config: RuleConfigObject) => RuleProcessOutput;
  classify?: (data: RuleData, config: RuleConfigObject) => string;
  children?: Record<string, Partial<ChartRuleDefinition>>;
}
