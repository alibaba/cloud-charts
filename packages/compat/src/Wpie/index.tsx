import React from 'react';
import { Pie, type PieProps } from '@alicloud/cloud-charts-react';
import type { PieChartConfig } from '@alicloud/cloud-charts-core';

export interface WpieLegacyProps {
  data: PieProps['data'];
  config?: PieChartConfig;
  height?: number | string;
  width?: number | string;
  className?: string;
  style?: React.CSSProperties;
  language?: string;
  theme?: string;
  event?: PieProps['event'];
  interaction?: PieProps['interaction'];
  getChartInstance?: PieProps['getChartInstance'];
  chartRef?: PieProps['chartRef'];
}

/**
 * @alicloud/cloud-charts@3.x 旧 <Wpie> 兼容层：保持旧组件名与 props 不变，内部转发到新 React Pie。
 */
export function Wpie(props: WpieLegacyProps): JSX.Element {
  const { height, ...rest } = props;
  const normalizedHeight = typeof height === 'string' && height !== '' && !Number.isNaN(Number(height))
    ? Number(height)
    : height;
  return <Pie {...rest} height={normalizedHeight} />;
}
