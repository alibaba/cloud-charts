export * from '@antv/g2/lib/core';

export * as G2Dependents from "@antv/g2/lib/dependents";

export interface BaseChartConfig {
  padding?: string[];
  dataType?: string;
}

export type ChartData = any;

export type Size = number | string;

export type Status = 'error' | 'warning' | 'normal' | 'success' | 'none';

export type StatusColor = 'red' | 'orange' | 'blue' | 'green' | 'gray';
