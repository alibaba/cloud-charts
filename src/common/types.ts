import { ViewPadding } from "@antv/g2/esm/interface";

export * from '@antv/g2/esm/core';

export * as G2Dependents from "@antv/g2/esm/dependents";

export interface BaseChartConfig {
  padding?: ViewPadding;
  dataType?: string;
  animate?: boolean;
}

export type ChartData = any;

export type Size = number | string;

export type Status = 'error' | 'warning' | 'normal' | 'success' | 'none';

export type StatusColor = 'red' | 'orange' | 'blue' | 'green' | 'gray';

export type Language = 'zh-cn' | 'en-us';

export type Trend = 'raise' | 'drop';
