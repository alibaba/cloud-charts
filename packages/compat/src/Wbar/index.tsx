import React from 'react';
import { Bar, type BarProps } from '@alicloud/cloud-charts-react';
import type { BarChartConfig } from '@alicloud/cloud-charts-core';

export interface WbarLegacyProps {
  data: BarProps['data'];
  config?: BarChartConfig;
  height?: number | string;
  width?: number | string;
  className?: string;
  style?: React.CSSProperties;
  language?: string;
  theme?: string;
  event?: BarProps['event'];
  interaction?: BarProps['interaction'];
  getChartInstance?: BarProps['getChartInstance'];
  chartRef?: BarProps['chartRef'];
}

/**
 * @alicloud/cloud-charts@3.x 旧 <Wbar> 兼容层：保持旧组件名与 props 不变，内部转发到新 React Bar。
 * 旧版接受 height 字符串（如 '300'），统一转 number；其它字段直接透传给新组件。
 */
export function Wbar(props: WbarLegacyProps): JSX.Element {
  const { height, ...rest } = props;
  const normalizedHeight = typeof height === 'string' && height !== '' && !Number.isNaN(Number(height))
    ? Number(height)
    : height;
  return <Bar {...rest} height={normalizedHeight} />;
}
