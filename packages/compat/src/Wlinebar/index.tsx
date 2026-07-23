import React from 'react';
import { LineBar, type LineBarProps } from '@alicloud/cloud-charts-react';
import type { LineBarChartConfig } from '@alicloud/cloud-charts-core';

export interface WlinebarLegacyProps {
  data: LineBarProps['data'];
  config?: LineBarChartConfig;
  height?: number | string;
  width?: number | string;
  className?: string;
  style?: React.CSSProperties;
  language?: string;
  theme?: string;
  event?: LineBarProps['event'];
  interaction?: LineBarProps['interaction'];
  getChartInstance?: LineBarProps['getChartInstance'];
  chartRef?: LineBarProps['chartRef'];
}

/** @alicloud/cloud-charts@3.x 旧 <Wlinebar> 兼容层 */
export function Wlinebar(props: WlinebarLegacyProps): JSX.Element {
  const { height, ...rest } = props;
  const normalizedHeight =
    typeof height === 'string' && height !== '' && !Number.isNaN(Number(height))
      ? Number(height)
      : height;
  return <LineBar {...rest} height={normalizedHeight} />;
}
