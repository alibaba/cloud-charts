import React from 'react';
import { Funnel, type FunnelProps } from '@alicloud/cloud-charts-react';
import type { FunnelChartConfig } from '@alicloud/cloud-charts-core';

export interface WfunnelLegacyProps {
  data: FunnelProps['data'];
  config?: FunnelChartConfig;
  height?: number | string;
  width?: number | string;
  className?: string;
  style?: React.CSSProperties;
  language?: string;
  theme?: string;
  event?: FunnelProps['event'];
  interaction?: FunnelProps['interaction'];
  getChartInstance?: FunnelProps['getChartInstance'];
  chartRef?: FunnelProps['chartRef'];
}

/** @alicloud/cloud-charts@3.x 旧 <Wfunnel> 兼容层 */
export function Wfunnel(props: WfunnelLegacyProps): JSX.Element {
  const { height, ...rest } = props;
  const normalizedHeight =
    typeof height === 'string' && height !== '' && !Number.isNaN(Number(height))
      ? Number(height)
      : height;
  return <Funnel {...rest} height={normalizedHeight} />;
}
